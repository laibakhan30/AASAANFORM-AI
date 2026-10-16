
import logging
import re

import pytesseract
from PIL import (
    Image,
    ImageEnhance,
    ImageFilter,
    ImageOps,
)
from pytesseract import Output, TesseractError

logger = logging.getLogger(__name__)

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

MIN_IMAGE_SIZE = 20
MAX_IMAGE_PIXELS = 25_000_000
TARGET_WIDTH = 1800

# Allow more time for large or complex documents.
OCR_TIMEOUT_SECONDS = 45

# Start with English for faster processing.
# Hindi and Marathi are used only if English OCR is weak.
PRIMARY_LANGUAGE = "eng"
FALLBACK_LANGUAGES = ("hin", "mar")


def _available_languages() -> set[str]:
    try:
        return set(pytesseract.get_languages(config=""))
    except (TesseractError, OSError):
        logger.exception("Could not read Tesseract languages.")
        return set()


def _prepare_image(image: Image.Image) -> Image.Image:
    if not isinstance(image, Image.Image):
        raise ValueError("Input must be a PIL image.")

    image = ImageOps.exif_transpose(image)

    width, height = image.size

    if width < MIN_IMAGE_SIZE or height < MIN_IMAGE_SIZE:
        raise ValueError("Image is too small for reliable OCR.")

    if width * height > MAX_IMAGE_PIXELS:
        raise ValueError("Image is too large to process safely.")

    # Flatten transparent images onto a white background.
    if image.mode in ("RGBA", "LA") or "transparency" in image.info:
        rgba = image.convert("RGBA")
        background = Image.new("RGBA", rgba.size, "white")
        image = Image.alpha_composite(
            background, rgba
        ).convert("RGB")
    else:
        image = image.convert("RGB")

    image = ImageOps.grayscale(image)
    image = ImageOps.autocontrast(image)

    # Resize small images, but do not enlarge already-large images.
    width, height = image.size

    if width < TARGET_WIDTH:
        scale = TARGET_WIDTH / width
        new_size = (
            TARGET_WIDTH,
            round(height * scale),
        )
        image = image.resize(
            new_size,
            Image.Resampling.LANCZOS,
        )

    image = ImageEnhance.Contrast(image).enhance(1.3)

    return image.filter(ImageFilter.SHARPEN)


def _clean_text(text: str) -> str:
    lines = [
        re.sub(r"[ \t]+", " ", line).strip()
        for line in text.splitlines()
    ]

    return "\n".join(
        line for line in lines if line
    ).strip()


def _run_ocr(
    image: Image.Image,
    languages: str,
    psm: int = 6,
) -> dict:
    data = pytesseract.image_to_data(
        image,
        lang=languages,
        config=f"--oem 3 --psm {psm}",
        output_type=Output.DICT,
        timeout=OCR_TIMEOUT_SECONDS,
    )

    lines = {}
    confidences = []
    word_count = 0

    for i, raw_word in enumerate(data["text"]):
        word = raw_word.strip()

        if not word:
            continue

        try:
            confidence = float(data["conf"][i])
        except (TypeError, ValueError):
            confidence = -1

        if confidence >= 0:
            confidences.append(confidence)
            word_count += 1

        key = (
            data["block_num"][i],
            data["par_num"][i],
            data["line_num"][i],
        )

        lines.setdefault(key, []).append(word)

    text = _clean_text(
        "\n".join(
            " ".join(words)
            for words in lines.values()
        )
    )

    average_confidence = (
        sum(confidences) / len(confidences)
        if confidences
        else 0.0
    )

    return {
        "text": text,
        "average_confidence": round(
            average_confidence, 2
        ),
        "word_count": word_count,
        "psm": psm,
    }


def _is_weak_result(result: dict) -> bool:
    return (
        not result["text"]
        or result["word_count"] < 5
        or result["average_confidence"] < 25
    )


def _is_better_result(candidate: dict, current: dict) -> bool:
    if candidate["word_count"] != current["word_count"]:
        return candidate["word_count"] > current["word_count"]

    return (
        candidate["average_confidence"]
        > current["average_confidence"]
    )


def extract_text_with_diagnostics(
    image: Image.Image,
) -> dict:
    image = _prepare_image(image)
    installed = _available_languages()

    if PRIMARY_LANGUAGE not in installed:
        raise RuntimeError(
            "English Tesseract language data is not installed."
        )

    languages_used = [PRIMARY_LANGUAGE]

    try:
        # First pass: English only.
        best = _run_ocr(
            image,
            PRIMARY_LANGUAGE,
            psm=6,
        )

        # Retry with a different layout mode if needed.
        if _is_weak_result(best):
            logger.info(
                "English OCR result is weak; retrying with PSM 11."
            )

            retry = _run_ocr(
                image,
                PRIMARY_LANGUAGE,
                psm=11,
            )

            if _is_better_result(retry, best):
                best = retry

        # If English OCR is still weak, try the installed
        # Indian-language models together with English.
        if _is_weak_result(best):
            available_fallbacks = [
                language
                for language in FALLBACK_LANGUAGES
                if language in installed
            ]

            if available_fallbacks:
                fallback_config = "+".join(
                    [PRIMARY_LANGUAGE] + available_fallbacks
                )

                logger.info(
                    "English OCR remains weak; trying languages: %s",
                    fallback_config,
                )

                fallback = _run_ocr(
                    image,
                    fallback_config,
                    psm=6,
                )

                if _is_better_result(fallback, best):
                    best = fallback
                    languages_used = (
                        [PRIMARY_LANGUAGE] + available_fallbacks
                    )

    except TesseractError:
        logger.exception("Tesseract failed.")
        raise RuntimeError(
            "Tesseract failed to process the image."
        ) from None

    except RuntimeError:
        logger.exception(
            "OCR timed out or could not complete."
        )
        raise

    return {
        "text": best["text"],
        "average_confidence": best["average_confidence"],
        "word_count": best["word_count"],
        "psm_used": best["psm"],
        "languages_used": languages_used,
        "review_recommended": (
            not best["text"]
            or best["average_confidence"] < 65
        ),
    }


def extract_text_from_image(image: Image.Image) -> str:
    return extract_text_with_diagnostics(image)["text"]
