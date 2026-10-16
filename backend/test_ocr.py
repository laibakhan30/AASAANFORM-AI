
from PIL import Image, ImageDraw
from ocr_service import extract_text_from_image

# Create a temporary test image with English text
image = Image.new("RGB", (700, 150), "white")
draw = ImageDraw.Draw(image)
draw.text((20, 30), "Name: Amani", fill="black")
draw.text((20, 75), "Application Form", fill="black")

result = extract_text_from_image(image)

print("OCR RESULT:")
print(result)
