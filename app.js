/* ============================================================
   AasaanForm AI — Frontend (Member 1) · KYC Sample build
   Form: "KYC Application Form (Resident Individual)" — SAMPLE
   Documents required (voice-managed, one at a time):
     1. Aadhaar card  → Name, DOB, Address, Aadhaar number
     2. PAN card      → PAN number
     3. Bank Passbook → Customer number
   Personal details (occupation, qualification, marital status)
   are asked BY VOICE with tappable option chips.
   Flow: choose form & mode → voice-guided upload → editable
   verify → print / download PDF. Self-fill mode: step-by-step
   voice guide for users who want to write the form by hand.
   No verification against any official/bank database is done.
   API contract (inform Member 2):
     GET  /api/forms
     POST /api/extract        FormData: formId, documents[], docTypes[]
     POST /api/generate-pdf   { formId, confirmedValues }
   ============================================================ */
"use strict";

const API_BASE = ""; // e.g. "http://localhost:8000"

/* ---------- i18n ---------- */
const I18N = {
  en: {
    appName: "AasaanForm AI",
    tagline: "Understand every field. Fill with confidence.",
    voiceHint: "Read instructions aloud",
    step1: "Choose Form", step2: "Upload Documents", step3: "Verify & Edit", step4: "Print / Download",
    chooseForm: "Select a supported form",
    chooseFormHint: "We currently support one sample form. More templates are coming soon.",
    modeTitle: "How would you like to fill this form?",
    modeAiTitle: "AI fills it for me",
    modeAiDesc: "Upload your documents — AI reads them, asks you a few questions by voice, and fills the form.",
    modeSelfTitle: "I will fill it myself",
    modeSelfDesc: "Voice-guided walkthrough — the app explains each section of the form step by step.",
    requiredDocs: "Documents you will need",
    continue: "Continue",
    uploadDoc: "Upload your documents",
    uploadHint: "Our voice assistant will guide you one document at a time. Fictional demo data is used in this preview.",
    noVerifyNote: "Documents are only read to help fill this form. They are not verified against any bank or government database.",
    dropTitle: "Tap to choose files, or drag & drop",
    dropSub: "Images (JPG/PNG) or PDFs · Max 10 MB each · Your files stay on this device in demo mode",
    takePhoto: "Take a photo",
    useDemo: "Use demo documents instead",
    analyzing: "Reading your documents with AI…",
    back: "Back",
    analyze: "Extract & fill form",
    reviewTitle: "Verify & edit each field",
    reviewHint: "Check every value before printing. For personal details, listen to the question and tap an option. Nothing is printed without your confirmation.",
    generateDraft: "Create printable form",
    readyTitle: "Your form is ready",
    readyHint: "Below is the final data using only the values you confirmed. Please verify everything before official use.",
    printBtn: "🖨️ Print",
    downloadPdf: "Download PDF ⬇",
    startOver: "Start over",
    fineprint: "Demo build — data is fictional and this is not an official bank form. Always double-check official forms before submission.",
    footerNote: "Built with open-weight AI (Gemma)",
    docNeeded: "Needed", docProvided: "Uploaded ✓",
    chooseType: "Document type…",
    st_needs_confirmation: "Suggestion", st_missing: "Missing", st_conflict: "Conflict",
    st_accepted: "Confirmed", st_rejected: "Skipped", st_edited: "Edited",
    st_ask: "Voice question", st_answered: "Answered",
    missingValue: "Not found in your documents — leave blank or type it yourself",
    accept: "✓ Confirm", reject: "✕ Skip", edit: "✎ Edit", save: "Save", cancel: "Cancel",
    evidence: "Extracted from",
    conflictNotice: "Conflicting values found in sources:",
    summaryWarn: "Some fields still need your confirmation before the printable form can be created.",
    summaryInfo: "All fields are confirmed. You can still go back and change anything.",
    voiceUnsupported: "Voice is not supported on this device/browser.",
    fileTooBig: "File is too large (max 10 MB).",
    fileBadType: "Please upload images (JPG/PNG) or PDFs only.",
    demoLoaded: "Demo documents loaded (fictional data).",
    analyzeFail: "Could not reach the analysis service. Showing demo results instead.",
    pdfFail: "PDF service unavailable in this demo — use Print instead.",
    pickFormFirst: "Please choose a form and a mode first.",
    confirmAllFirst: "Please confirm every field first (options, confirm, edit, or skip).",
    fieldsProgress: (done, total) => `${done} / ${total} confirmed`,
    supported: "Supported",
    sampleOnly: "Sample only — not an official bank form",
    guideTitle: "Step-by-step form guide",
    guideHint: "Listen to each instruction, fill that part of the physical form yourself, then mark it done.",
    prev: "Previous", next: "Next", listenSection: "🔊 Listen",
    markDone: "Mark done & next", exitGuide: "← Back to form selection",
    guideDoneAll: "🎉 You have gone through the whole form! Review your physical form once, then sign the declaration.",
    stepOf: (n, total) => `Step ${n} of ${total}`,
    p_title: "KYC Application Form — Draft (Sample)",
    p_sub: "Generated by AasaanForm AI · Fictional demo data · Not an official document",
    p_note: "This is a draft produced for demonstration purposes only. Verify all details against your original documents before any official use.",
    p_field: "Field", p_value: "Value",
    // Voice assistant lines
    v_intro: "Welcome to AasaanForm Ai. I will help you fill the K Y C form. First,Choose Fill with Ai or Fill Myself then Uplod your form And Document.",
    v_upload: (doc) => `Please upload your ${doc}.`,
    v_allDocs: "All documents received. Now extracting your information.",
    v_nextQ: "Confirm All the Questions.",
    v_selected: (opt) => `You selected ${opt}.`,
    v_allAnswered: "All questions answered. Please verify each field, then create your printable form.",
    v_guideIntro: "You chose to fill the form yourself. I will guide you section by section. Let's begin.",
  },
  hi: {
    appName: "आसानफॉर्म AI",
    tagline: "हर फ़ील्ड समझें। भरोसे के साथ भरें।",
    voiceHint: "निर्देश सुनें",
    step1: "फ़ॉर्म चुनें", step2: "दस्तावेज़ अFलोड", step3: "जाँचें व बदलें", step4: "प्रिंट / डाउनलोड",
    chooseForm: "समर्थित फ़ॉर्म चुनें",
    chooseFormHint: "फ़िलहाल एक सैंपल फ़ॉर्म उपलब्ध है। जल्द ही और टेम्पलेट आएँगे।",
    modeTitle: "आप इस फ़ॉर्म को कैसे भरना चाहेंगे?",
    modeAiTitle: "AI मेरे लिए भरे",
    modeAiDesc: "अपने दस्तावेज़ अपलोड करें — AI उन्हें पढ़ेगा, आवाज़ से कुछ सवाल पूछेगा और फ़ॉर्म भर देगा।",
    modeSelfTitle: "मैं खुद भरूँगा / भरूँगी",
    modeSelfDesc: "आवाज़-मार्गदर्शन — ऐप फ़ॉर्म के हर भाग को कदम-दर-कदम समझाएगा।",
    requiredDocs: "आपको किन दस्तावेज़ों की ज़रूरत होगी",
    continue: "आगे बढ़ें",
    uploadDoc: "अपने दस्तावेज़ अपलोड करें",
    uploadHint: "हमारा वॉइस असिस्टेंट आपको एक-एक दस्तावेज़ के लिए मार्गदर्शन करेगा। इस झलक में काल्पनिक डेमो डेटा उपयोग होता है।",
    noVerifyNote: "दस्तावेज़ केवल फ़ॉर्म भरने में मदद के लिए पढ़े जाते हैं। इन्हें किसी बैंक या सरकारी डेटाबेस में सत्यापित नहीं किया जाता।",
    dropTitle: "फ़ाइलें चुनने के लिए टैप करें, या खींचकर छोड़ें",
    dropSub: "तस्वीरें (JPG/PNG) या PDF · प्रत्येक अधिकतम 10 MB · डेमो में फ़ाइलें इसी डिवाइस पर रहती हैं",
    takePhoto: "फ़ोटो खींचें",
    useDemo: "डेमो दस्तावेज़ इस्तेमाल करें",
    analyzing: "AI आपके दस्तावेज़ पढ़ रहा है…",
    back: "वापस",
    analyze: "जानकारी निकालें और फ़ॉर्म भरें",
    reviewTitle: "हर फ़ील्ड जाँचें व बदलें",
    reviewHint: "प्रिंट करने से पहले हर मान जाँच लें। निजी विवरण के लिए सवाल सुनकर विकल्प चुनें। आपकी पुष्टि के बिना कुछ भी प्रिंट नहीं होगा।",
    generateDraft: "प्रिंट करने योग्य फ़ॉर्म बनाएँ",
    readyTitle: "आपका फ़ॉर्म तैयार है",
    readyHint: "नीचे केवल वही मान हैं जिनकी आपने पुष्टि की है। कृपया आधिकारिक उपयोग से पहले सब जाँच लें।",
    printBtn: "🖨️ प्रिंट करें",
    downloadPdf: "PDF डाउनलोड करें ⬇",
    startOver: "फिर से शुरू करें",
    fineprint: "डेमो बिल्ड — डेटा काल्पनिक है और यह कोई आधिकारिक बैंक फ़ॉर्म नहीं है। जमा करने से पहले हमेशा आधिकारिक फ़ॉर्म दोबारा जाँचें।",
    footerNote: "ओपन-वेट AI (Gemma) से बनाया गया",
    docNeeded: "ज़रूरी", docProvided: "अपलोड ✓",
    chooseType: "दस्तावेज़ का प्रकार…",
    st_needs_confirmation: "सुझाव", st_missing: "अनुपलब्ध", st_conflict: "विरोधाभास",
    st_accepted: "पुष्टि की", st_rejected: "छोड़ा गया", st_edited: "संशोधित",
    st_ask: "वॉइस सवाल", st_answered: "उत्तर दिया",
    missingValue: "आपके दस्तावेज़ों में नहीं मिला — खाली छोड़ें या खुद लिखें",
    accept: "✓ पुष्टि करें", reject: "✕ छोड़ें", edit: "✎ बदलें", save: "सहेजें", cancel: "रद्द करें",
    evidence: "स्रोत",
    conflictNotice: "स्रोतों में विरोधी मान मिले:",
    summaryWarn: "प्रिंट करने योग्य फ़ॉर्म बनाने से पहले कुछ फ़ील्ड की पुष्टि बाकी है।",
    summaryInfo: "सभी फ़ील्ड की पुष्टि हो चुकी है। आप वापस जाकर कुछ भी बदल सकते हैं।",
    voiceUnsupported: "इस डिवाइस/ब्राउज़र पर वॉइस समर्थित नहीं है।",
    fileTooBig: "फ़ाइल बहुत बड़ी है (अधिकतम 10 MB)।",
    fileBadType: "कृपया केवल तस्वीरें (JPG/PNG) या PDF अपलोड करें।",
    demoLoaded: "डेमो दस्तावेज़ लोड हो गए (काल्पनिक डेटा)।",
    analyzeFail: "विश्लेषण सेवा से संपर्क नहीं हो सका। डेमो परिणाम दिखाए जा रहे हैं।",
    pdfFail: "इस डेमो में PDF सेवा उपलब्ध नहीं — प्रिंट का उपयोग करें।",
    pickFormFirst: "कृपया पहले फ़ॉर्म और तरीका चुनें।",
    confirmAllFirst: "कृपया पहले हर फ़ील्ड की पुष्टि करें (विकल्प चुनें, पुष्टि करें, बदलें या छोड़ें)।",
    fieldsProgress: (done, total) => `${done} / ${total} पुष्टि`,
    supported: "उपलब्ध",
    sampleOnly: "केवल नमूना — आधिकारिक बैंक फ़ॉर्म नहीं",
    guideTitle: "कदम-दर-कदम फ़ॉर्म गाइड",
    guideHint: "हर निर्देश सुनें, फ़ॉर्म का वह भाग खुद भरें, फिर उसे पूरा चिह्नित करें।",
    prev: "पिछला", next: "अगला", listenSection: "🔊 सुनें",
    markDone: "पूरा चिह्नित करें और आगे बढ़ें", exitGuide: "← फ़ॉर्म चयन पर वापस",
    guideDoneAll: "🎉 आपने पूरा फ़ॉर्म देख लिया! अपना फ़ॉर्म एक बार जाँच लें, फिर घोषणा पर हस्ताक्षर करें।",
    stepOf: (n, total) => `चरण ${n} / ${total}`,
    p_title: "KYC आवेदन फ़ॉर्म — ड्राफ़्ट (नमूना)",
    p_sub: "आसान फॉर्म. द्वारा निर्मित · काल्पनिक डेमो डेटा · आधिकारिक दस्तावेज़ नहीं",
    p_note: "यह केवल प्रदर्शन के लिए बनाया गया ड्राफ़्ट है। किसी भी आधिकारिक उपयोग से पहले सभी विवरण अपने मूल दस्तावेज़ों से जाँच लें।",
    p_field: "फ़ील्ड", p_value: "मान",
    v_intro: "आसान फॉर्म एआई. में आपका स्वागत है। मैं आपकी K Y C फ़ॉर्म भरने में मदद करूँगा। पहले AI के साथ भरें या खुद भरें  चुनें फिर अपना फॉर्म और दस्तावेज़ अपलोड करें।",
    v_upload: (doc) => `कृपया अपना ${doc} अपलोड करें।`,
    v_allDocs: "सभी दस्तावेज़ मिल गए। अब आपकी जानकारी निकाली जा रही है।",
    v_nextQ: "सभी सवालों की जांच करें।",
    v_selected: (opt) => `आपने ${opt} चुना।`,
    v_allAnswered: "सभी सवालों के उत्तर मिल गए। कृपया हर फ़ील्ड जाँचें, फिर अपना प्रिंट करने योग्य फ़ॉर्म बनाएँ।",
    v_guideIntro: "आपने खुद फ़ॉर्म भरने का विकल्प चुना है। मैं आपको भाग-दर-भाग मार्गदर्शन करूँगा। चलिए शुरू करते हैं।",
  }
};
let lang = "en";
const t = (key) => I18N[lang][key];

/* ---------- Voice (browser speechSynthesis) ---------- */
const VOICE_ON = { value: true };
function speak(text, opts = {}) {
  if (!VOICE_ON.value) return;
  if (!("speechSynthesis" in window)) { toast(t("voiceUnsupported")); VOICE_ON.value = false; return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = opts.lang || (lang === "hi" ? "hi-IN" : "en-IN");
  u.rate = 0.95;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
function speakKey(text) { speak(text); $("voicePromptText").textContent = text; $("voicePrompt").classList.remove("hidden"); }

/* ---------- Document types for the KYC form ---------- */
const DOC_TYPES = [
  { id: "aadhaar",  icon: "🪪", name: { en: "Aadhaar card",  hi: "आधार कार्ड" },
    sub: { en: "for Name, DOB, Address & Aadhaar number", hi: "नाम, जन्म तिथि, पता और आधार नंबर के लिए" } },
  { id: "pan",      icon: "💳", name: { en: "PAN card",      hi: "पैन कार्ड" },
    sub: { en: "for PAN number", hi: "पैन नंबर के लिए" } },
  { id: "passbook", icon: "🏦", name: { en: "Bank passbook", hi: "बैंक पासबुक" },
    sub: { en: "for Customer number", hi: "ग्राहक संख्या के लिए" } },
];

/* ---------- Form ---------- */
const MOCK_FORMS = [
  {
    id: "kyc-resident-sample",
    name: { en: "KYC Application Form (Sample)", hi: "KYC आवेदन फ़ॉर्म (नमूना)" },
    desc: {
      en: "Resident Individual KYC — sample for demonstrating document-driven form filling.",
      hi: "निवासी व्यक्ति का KYC — दस्तावेज़-आधारित फ़ॉर्म भरने का प्रदर्शन।",
    },
    icon: "🏦",
    sampleOnly: true,
    requiredDocs: DOC_TYPES.map((d) => d.id),
  },
];

/* ---------- Mock extracted fields (fictional demo data) ----------
   status "ask" = personal detail collected via voice question + option chips */
const MOCK_FIELDS = [  
  {
    ask: { en: "Confirm are your details are correct?", hi: "पुष्टि करें कि आपके विवरण सही हैं?" },
    key: "customer_name", label: { en: "Customer Name", hi: "ग्राहक का नाम" },
    status: "needs_confirmation", value: "KIRAN DEMO",
    evidence: { en: "Aadhaar card: “Name: KIRAN DEMO”", hi: "आधार कार्ड: “नाम: KIRAN DEMO”" },
    explain: {
      en: "Your full name exactly as printed on your Aadhaar card.",
      hi: "आपका पूरा नाम, जैसा आपके आधार कार्ड पर छपा है।",
    } },
  { key: "dob", label: { en: "Date of Birth", hi: "जन्म तिथि" },
    status: "needs_confirmation", value: "14 / 03 / 1995",
    evidence: { en: "Aadhaar card: “DOB: 14-03-1995”", hi: "आधार कार्ड: “जन्म तिथि: 14-03-1995”" },
    explain: {
      en: "Your date of birth in DD / MM / YYYY format, from Aadhaar.",
      hi: "आधार से मिली आपकी जन्म तिथि, DD / MM / YYYY प्रारूप में।",
    } },
  { key: "address", label: { en: "Current / Permanent Address", hi: "वर्तमान / स्थायी पता" },
    status: "needs_confirmation", value: "Demo Lane, Jaipur, Rajasthan 302001",
    evidence: { en: "Aadhaar card: “Address: Demo Lane, Jaipur”", hi: "आधार कार्ड: “पता: डेमो लेन, जयपुर”" },
    explain: {
      en: "Your address as printed on your Aadhaar card. If it is old, edit it.",
      hi: "आपके आधार कार्ड पर छपा पता। यदि पुराना हो तो बदल दें।",
    } },
  { key: "aadhaar_number", label: { en: "Aadhaar Number", hi: "आधार संख्या" },
    status: "needs_confirmation", value: "XXXX XXXX 4521",
    evidence: { en: "Aadhaar card: “XXXX XXXX 4521”", hi: "आधार कार्ड: “XXXX XXXX 4521”" },
    explain: {
      en: "Your 12-digit Aadhaar number, from your Aadhaar card.",
      hi: "आपका 12-अंकों का आधार नंबर, आधार कार्ड से।",
    } },
  { key: "pan_number", label: { en: "PAN", hi: "पैन" },
    status: "needs_confirmation", value: "AXXPD1234Z",
    evidence: { en: "PAN card: “AXXPD1234Z”", hi: "पैन कार्ड: “AXXPD1234Z”" },
    explain: {
      en: "Your 10-character PAN, from your PAN card.",
      hi: "आपका 10-अक्षरों वाला पैन, पैन कार्ड से।",
    } },
  { key: "customer_number", label: { en: "Customer Number", hi: "ग्राहक संख्या" },
    status: "needs_confirmation", value: "50100234567890",
    evidence: { en: "Bank passbook: “Customer No: 50100234567890”", hi: "बैंक पासबुक: “ग्राहक सं.: 50100234567890”" },
    explain: {
      en: "Your bank customer number, printed on the first page of your passbook.",
      hi: "आपकी बैंक ग्राहक संख्या, पासबुक के पहले पृष्ठ पर छपी।",
    } },
  { key: "email", label: { en: "Email ID", hi: "ईमेल आईडी" },
    status: "missing", value: null, evidence: null,
    explain: {
      en: "The bank sends all communication to this email. It was not found in your documents — type it yourself or skip.",
      hi: "बैंक सभी सूचनाएँ इसी ईमेल पर भेजता है। आपके दस्तावेज़ों में यह नहीं मिला — खुद लिखें या छोड़ दें।",
    } },
  /* Voice-asked personal details with option chips */
  { key: "occupation", label: { en: "Occupation", hi: "व्यवसाय" },
    status: "ask", value: null, evidence: null,
    ask: { en: "What is your occupation?", hi: "आपका व्यवसाय क्या है?" },
    options: [
      { id: "salaried",     en: "Salaried",      hi: "नौकरीपेशा" },
      { id: "self_employed",en: "Self-employed", hi: "स्वरोज़गार" },
      { id: "business",     en: "Business",      hi: "व्यापार" },
      { id: "student",      en: "Student",       hi: "छात्र/छात्रा" },
      { id: "homemaker",    en: "Homemaker",     hi: "गृहिणी/गृहस्थ" },
      { id: "retired",      en: "Retired",       hi: "सेवानिवृत्त" },
    ],
    explain: {
      en: "Your main source of work, as asked in the Customer Profile section.",
      hi: "ग्राहक प्रोफ़ाइल खंड में पूछा गया आपका मुख्य काम।",
    } },
  { key: "qualification", label: { en: "Qualification", hi: "शैक्षिक योग्यता" },
    status: "ask", value: null, evidence: null,
    ask: { en: "What is your highest educational qualification?", hi: "आपकी सबसे उच्च शैक्षिक योग्यता क्या है?" },
    options: [
      { id: "below_10", en: "10th or below", hi: "10वीं या उससे कम" },
      { id: "12th",     en: "12th",          hi: "12वीं" },
      { id: "graduate", en: "Graduate",      hi: "स्नातक" },
      { id: "postgrad", en: "Post Graduate", hi: "स्नातकोत्तर" },
      { id: "professional", en: "Professional (CA/Doctor/etc.)", hi: "व्यावसायिक (CA/डॉक्टर आदि)" },
    ],
    explain: {
      en: "Your highest completed education level.",
      hi: "आपकी उच्चतम पूर्ण शैक्षिक उपलब्धि।",
    } },
  { key: "marital_status", label: { en: "Marital Status", hi: "वैवाहिक स्थिति" },
    status: "ask", value: null, evidence: null,
    ask: { en: "What is your marital status?", hi: "आपकी वैवाहिक स्थिति क्या है?" },
    options: [
      { id: "unmarried", en: "Unmarried", hi: "अविवाहित" },
      { id: "married",   en: "Married",   hi: "विवाहित" },
      { id: "others",    en: "Others",    hi: "अन्य" },
    ],
    explain: {
      en: "Your marital status as required in the form.",
      hi: "फ़ॉर्म में आवश्यक आपकी वैवाहिक स्थिति।",
    } },
];

/* ---------- Self-fill guide sections (based on the KYC form image) ---------- */
const GUIDE_SECTIONS = [
  { title: { en: "1. Customer Details — Name", hi: "1. ग्राहक विवरण — नाम" },
    text: {
      en: "At the top of Section 1, write your full name in BLOCK LETTERS exactly as printed on your Aadhaar card: First name, Middle name (if any), then Last name.",
      hi: "खंड 1 के शीर्ष पर, अपना पूरा नाम बड़े अक्षरों (BLOCK LETTERS) में वैसे ही लिखें जैसा आधार कार्ड पर छपा है: पहले नाम, फिर मध्य नाम (यदि हो), फिर उपनाम।",
    } },
  { title: { en: "2. Customer Details — Guardian & Dates", hi: "2. ग्राहक विवरण — अभिभावक और तिथियाँ" },
    text: {
      en: "Below the name: write your Guardian's name and Customer number (from your bank passbook). Enter your Date of Birth, then your full Current / Permanent Address with City, State, PIN code and Country (India).",
      hi: "नाम के नीचे: अपने अभिभावक का नाम और ग्राहक संख्या (पासबुक से) लिखें। अपनी जन्म तिथि भरें, फिर वर्तमान/स्थायी पता — शहर, राज्य, पिन कोड और देश (India) सहित।",
    } },
  { title: { en: "3. Customer Details — PAN & Birth place", hi: "3. ग्राहक विवरण — पैन और जन्म स्थान" },
    text: {
      en: "Enter your PAN (10 characters, from your PAN card), City of Birth and Country of Birth. Nationality is pre-printed as INDIAN.",
      hi: "अपना पैन भरें (10 अक्षर, पैन कार्ड से), जन्म शहर और जन्म देश। राष्ट्रीयता पहले से INDIAN छपी होती है।",
    } },
  { title: { en: "4. Customer Profile Details", hi: "4. ग्राहक प्रोफ़ाइल विवरण" },
    text: {
      en: "Tick ONE box for Occupation (Salaried / Self-employed / Business / Student etc.), enter Years/Months if self-employed, tick your Qualification, Marital Status, and Residence type (Owned / Rented).",
      hi: "व्यवसाय के सामने एक विकल्प पर ✓ लगाएँ (नौकरीपेशा / स्वरोज़गार / व्यापार / छात्र आदि), स्वरोज़गार होने पर वर्ष/माह लिखें, फिर योग्यता, वैवाहिक स्थिति और निवास प्रकार (स्वामित्व / किराया) चुनें।",
    } },
  { title: { en: "5. Proof of Identity & Address", hi: "5. पहचान और पते का प्रमाण" },
    text: {
      en: "In section 2(A), tick the box for Aadhaar as Proof of Identity and Proof of Address, and write your Aadhaar number in the space marked 'Proof of possession of Aadhaar'. Attach a self-attested copy of your Aadhaar.",
      hi: "खंड 2(A) में, पहचान और पते के प्रमाण के रूप में आधार के सामने ✓ लगाएँ और 'Proof of possession of Aadhaar' वाली जगह अपना आधार नंबर लिखें। आधार की स्वप्रमाणित प्रति संलग्न करें।",
    } },
  { title: { en: "6. Contact Details", hi: "6. संपर्क विवरण" },
    text: {
      en: "In section 3, write your Mobile Number, Email ID and Telephone (if any). All bank communication will be sent to these, so double-check every digit.",
      hi: "खंड 3 में अपना मोबाइल नंबर, ईमेल आईडी और टेलीफ़ोन (यदि हो) लिखें। बैंक की सभी सूचनाएँ यहीं आएँगी, इसलिए हर अंक जाँच लें।",
    } },
  { title: { en: "7. Declaration — Sign last", hi: "7. घोषणा — अंत में हस्ताक्षर" },
    text: {
      en: "Read the declaration, tick Yes/No for tax deduction (submit Form 15G/15H if you want no TDS and are eligible), then sign inside the box, write Place and Date. Your form is now complete!",
      hi: "घोषणा पढ़ें, कर कटौती के लिए हाँ/ना पर ✓ लगाएँ (TDS नहीं चाहने और पात्र होने पर फ़ॉर्म 15G/15H जमा करें), फिर बॉक्स में हस्ताक्षर करें, स्थान और तिथि लिखें। आपका फ़ॉर्म पूरा हुआ!",
    } },
];

/* ---------- State ---------- */
const state = {
  step: 1,
  mode: null, // 'ai' | 'self'
  formId: null,
  files: [],
  fields: [],
  guideIndex: 0,
};
let fileSeq = 0;
const $ = (id) => document.getElementById(id);
const currentForm = () => MOCK_FORMS.find((f) => f.id === state.formId);

/* ---------- Steps ---------- */
function goToStep(n) {
  state.step = n;
  $("guide-panel").classList.add("hidden");
  document.querySelectorAll(".step-panel").forEach((p) => p.classList.add("hidden"));
  $("step-" + n).classList.remove("hidden");
  document.querySelectorAll("#stepperList .step").forEach((s) => {
    const sn = Number(s.dataset.step);
    s.classList.toggle("active", sn === n);
    s.classList.toggle("done", sn < n);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- i18n ---------- */
function applyLang() {
  document.documentElement.lang = lang === "hi" ? "hi" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = I18N[lang][el.dataset.i18n];
    if (typeof v === "string") el.textContent = v;
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const v = I18N[lang][el.dataset.i18nTitle];
    if (typeof v === "string") el.title = v;
  });
  $("langEn").classList.toggle("active", lang === "en");
  $("langHi").classList.toggle("active", lang === "hi");
  renderForms();
  renderChecklist($("docChecklist"));
  renderChecklist($("docChecklistLive"));
  renderFileList();
  if (state.fields.length) renderFields();
  if (state.step === 4) renderConfirmedSummary();
  if (state.mode === "self") renderGuide();
}
$("langEn").addEventListener("click", () => { lang = "en"; applyLang(); });
$("langHi").addEventListener("click", () => { lang = "hi"; applyLang(); });

/* ---------- Step 1: form + mode ---------- */
function renderForms() {
  const wrap = $("formCards");
  wrap.innerHTML = "";
  MOCK_FORMS.forEach((f) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "form-card" + (state.formId === f.id ? " selected" : "");
    card.innerHTML = `
      <span class="fc-icon" aria-hidden="true">${f.icon}</span>
      <div class="fc-name">${f.name[lang]}</div>
      <div class="fc-desc">${f.desc[lang]}</div>
      <span class="fc-badge">${t("supported")}</span>
      ${f.sampleOnly ? `<span class="sir-badge">⚠️ ${t("sampleOnly")}</span>` : ""}`;
    card.addEventListener("click", () => {
      state.formId = f.id;
      renderForms();
      $("modeWrap").classList.remove("hidden");
      $("docChecklistWrap").classList.remove("hidden");
      renderChecklist($("docChecklist"));
    });
    wrap.appendChild(card);
  });
  if (state.formId) {
    $("modeWrap").classList.remove("hidden");
    $("docChecklistWrap").classList.remove("hidden");
  }
  $("modeAi").classList.toggle("selected", state.mode === "ai");
  $("modeSelf").classList.toggle("selected", state.mode === "self");
  $("toStep2").classList.toggle("hidden", state.mode !== "ai");
}

$("modeAi").addEventListener("click", () => { state.mode = "ai"; renderForms(); });
$("modeSelf").addEventListener("click", () => { state.mode = "self"; renderForms(); });

function renderChecklist(ul) {
  const form = currentForm();
  if (!form || !ul) return;
  const provided = new Set(state.files.filter((f) => f.docType).map((f) => f.docType));
  ul.innerHTML = "";
  form.requiredDocs.forEach((dtId) => {
    const dt = DOC_TYPES.find((d) => d.id === dtId);
    if (!dt) return;
    const li = document.createElement("li");
    li.className = provided.has(dtId) ? "provided" : "";
    li.innerHTML = `
      <span class="doc-icon" aria-hidden="true">${dt.icon}</span>
      <span class="doc-text">${dt.name[lang]}<span class="doc-sub">${dt.sub[lang]}</span></span>
      <span class="doc-state">${provided.has(dtId) ? t("docProvided") : t("docNeeded")}</span>`;
    ul.appendChild(li);
  });
}

$("toStep2").addEventListener("click", () => {
  if (!state.formId || state.mode !== "ai") { toast(t("pickFormFirst")); return; }
  renderChecklist($("docChecklistLive"));
  goToStep(2);
  speak(t("v_intro"));
  setTimeout(announceNextDoc, 2500);
});

/* Voice assistant: ask for the first missing document */
function announceNextDoc() {
  const provided = new Set(state.files.filter((f) => f.docType).map((f) => f.docType));
  const next = DOC_TYPES.find((d) => !provided.has(d.id));
  if (next) speakKey(t("v_upload")(next.name[lang]));
}

/* ---------- Step 2: upload ---------- */
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "application/pdf"];

function showUploadError(msg) { $("uploadError").textContent = msg; $("uploadError").classList.remove("hidden"); }
function clearUploadError() { $("uploadError").classList.add("hidden"); }

function addFiles(fileList) {
  clearUploadError();
  let added = false;
  for (const file of fileList) {
    if (file.size > MAX_BYTES) { showUploadError(t("fileTooBig")); continue; }
    if (!ACCEPTED.includes(file.type)) { showUploadError(t("fileBadType")); continue; }
    const provided = new Set(state.files.map((f) => f.docType));
    const nextNeeded = DOC_TYPES.find((d) => !provided.has(d.id));
    state.files.push({
      id: ++fileSeq, file, name: file.name, size: file.size, type: file.type,
      docType: nextNeeded ? nextNeeded.id : null,
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null, demo: false,
    });
    added = true;
  }
  if (added) { renderFileList(); refreshUploadState(); setTimeout(announceNextDoc, 700); }
}

function removeFile(id) {
  const i = state.files.findIndex((f) => f.id === id);
  if (i >= 0) { if (state.files[i].url) URL.revokeObjectURL(state.files[i].url); state.files.splice(i, 1); }
  renderFileList(); refreshUploadState();
}

function renderFileList() {
  const wrap = $("fileList");
  wrap.innerHTML = "";
  state.files.forEach((f) => {
    const row = document.createElement("div");
    row.className = "file-item";
    const options = [`<option value="">${t("chooseType")}</option>`]
      .concat(DOC_TYPES.map((d) =>
        `<option value="${d.id}" ${f.docType === d.id ? "selected" : ""}>${d.icon} ${d.name[lang]} — ${d.sub[lang]}</option>`))
      .join("");
    row.innerHTML = `
      ${f.url ? `<img src="${f.url}" alt="" />` : `<span class="doc-icon" aria-hidden="true">📑</span>`}
      <div class="fi-body">
        <div class="fi-name">${escapeHtml(f.name)}</div>
        <div class="fi-meta">${f.demo ? (lang === "hi" ? "डेमो" : "demo") : (f.size / 1024).toFixed(0) + " KB"}</div>
      </div>
      <select aria-label="Document type">${options}</select>
      <button class="icon-btn" aria-label="Remove">✕</button>`;
    row.querySelector("select").addEventListener("change", (e) => {
      const f2 = state.files.find((x) => x.id === f.id);
      if (f2) f2.docType = e.target.value || null;
      renderFileList();
    });
    row.querySelector(".icon-btn").addEventListener("click", () => removeFile(f.id));
    wrap.appendChild(row);
  });
  renderChecklist($("docChecklistLive"));
}

function refreshUploadState() { $("analyzeBtn").disabled = state.files.length === 0; }

$("dropZone").addEventListener("click", () => $("fileInput").click());
$("dropZone").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); $("fileInput").click(); }
});
$("fileInput").addEventListener("change", (e) => { if (e.target.files.length) addFiles(e.target.files); e.target.value = ""; });
document.querySelector(".btn-camera").addEventListener("click", () => $("cameraInput").click());
$("cameraInput").addEventListener("change", (e) => { if (e.target.files.length) addFiles(e.target.files); e.target.value = ""; });
["dragover", "dragleave", "drop"].forEach((evt) =>
  $("dropZone").addEventListener(evt, (e) => {
    e.preventDefault();
    $("dropZone").classList.toggle("dragover", evt === "dragover");
    if (evt === "drop" && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  })
);

$("useDemoBtn").addEventListener("click", () => {
  state.files = [
    { id: ++fileSeq, file: null, name: "demo-aadhaar.png", size: 0, type: "image/png", docType: "aadhaar", url: null, demo: true },
    { id: ++fileSeq, file: null, name: "demo-pan.png", size: 0, type: "image/png", docType: "pan", url: null, demo: true },
    { id: ++fileSeq, file: null, name: "demo-passbook.png", size: 0, type: "image/png", docType: "passbook", url: null, demo: true },
  ];
  renderFileList(); refreshUploadState();
  toast(t("demoLoaded"));
  speakKey(t("v_allDocs"));
});

$("backTo1").addEventListener("click", () => goToStep(1));
$("replayPrompt").addEventListener("click", () => {
  const txt = $("voicePromptText").textContent;
  if (txt) speak(txt);
});

/* POST /api/extract — falls back to mock data if backend unreachable */
$("analyzeBtn").addEventListener("click", async () => {
  $("analyzeState").classList.remove("hidden");
  clearUploadError();
  $("analyzeBtn").disabled = true;
  speak(t("v_allDocs"));
  let fields;
  try {
    if (state.files.some((f) => !f.demo)) {
      const fd = new FormData();
      fd.append("formId", state.formId);
      state.files.forEach((f) => fd.append("documents", f.file));
      fd.append("docTypes", JSON.stringify(state.files.map((f) => f.docType)));
      const res = await fetch(API_BASE + "/api/extract", { method: "POST", body: fd });
      if (!res.ok) throw new Error("bad status");
      const data = await res.json();
      fields = data.fields;
      if (!Array.isArray(fields) || !fields.length) throw new Error("empty");
    } else { throw new Error("demo mode"); }
  } catch {
    fields = structuredClone(MOCK_FIELDS);
    if (state.files.some((f) => !f.demo)) toast(t("analyzeFail"));
  }
  state.fields = fields.map((f) => ({ ...f, userStatus: null, finalValue: f.value }));
  $("analyzeState").classList.add("hidden");
  refreshUploadState();
  renderFields();
  goToStep(3);
  setTimeout(askNextQuestion, 1200);
});

/* ---------- Step 3: editable verify + voice questions ---------- */
const reviewedCount = () => state.fields.filter((f) => f.userStatus !== null).length;

function askNextQuestion() {
  const q = state.fields.find((f) => f.status === "ask" && !f.userStatus);
  if (q) {
    const opts = q.options.map((o) => o[lang]).join(", ");
    speak(`${q.ask[lang]} ${opts}`);
    const el = document.querySelector(`.field-card[data-key="${q.key}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  } else if (state.fields.length && state.fields.every((f) => f.userStatus)) {
    speak(t("v_allAnswered"));
  }
}

function renderFields() {
  const list = $("fieldsList");
  list.innerHTML = "";
  state.fields.forEach((f) => {
    const card = document.createElement("article");
    card.dataset.key = f.key;
    const isAsk = f.status === "ask";
    const effective = f.userStatus || (isAsk ? "ask" : f.status);
    card.className = "field-card status-" + effective;

    const chipLabel = f.userStatus ? t("st_" + f.userStatus) : t("st_" + (isAsk ? "ask" : f.status));

    let bodyHtml = "";
    if (isAsk && !f.userStatus) {
      const chips = f.options.map((o) =>
        `<button type="button" class="chip" data-opt="${o.id}">${o[lang]}</button>`).join("");
      bodyHtml = `
        <div class="voice-question">
          <button class="speak-mini" data-act="speakq" aria-label="Listen">🔊</button>
          <span class="q-text">${f.ask[lang]}</span>
        </div>
        <div class="option-chips">${chips}</div>`;
    } else if (f.value === null) {
      bodyHtml = `<p class="field-value empty">${t("missingValue")}</p>`;
    } else {
      bodyHtml = `<p class="field-value">${escapeHtml(f.value)}</p>`;
    }

    const evidenceHtml = f.evidence
      ? `<div class="field-source"><span class="src-label">${t("evidence")}:</span> ${f.evidence[lang] || f.evidence}</div>`
      : "";

    const actionsHtml = isAsk && !f.userStatus ? "" : `
      <div class="field-actions">
        <button class="action-btn accept" data-act="accept">${t("accept")}</button>
        <button class="action-btn edit" data-act="edit">${t("edit")}</button>
        <button class="action-btn reject" data-act="reject">${t("reject")}</button>
      </div>`;

    card.innerHTML = `
      <div class="field-top">
        <div class="field-label">${f.label[lang]}<span class="field-key">${f.key}</span></div>
        <span class="status-chip ${effective}">${chipLabel}</span>
      </div>
      ${bodyHtml}
      ${evidenceHtml}
      <p class="field-explain">${f.explain[lang]}</p>
      ${actionsHtml}
      <div class="edit-row hidden">
        <input type="text" value="${escapeAttr(f.finalValue ?? "")}" aria-label="${f.label[lang]}" />
        <button class="action-btn accept" data-act="save">${t("save")}</button>
        <button class="action-btn reject" data-act="cancel">${t("cancel")}</button>
      </div>`;

    /* option chips */
    card.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const opt = f.options.find((o) => o.id === chip.dataset.opt);
        f.value = opt[lang]; f.finalValue = opt[lang]; f.userStatus = "accepted";
        speak(t("v_selected")(opt[lang]) + " " + t("v_nextQ"));
        renderFields();
        setTimeout(askNextQuestion, 1800);
      });
    });
    const speakq = card.querySelector('[data-act="speakq"]');
    if (speakq) speakq.addEventListener("click", () => {
      speak(`${f.ask[lang]} ${f.options.map((o) => o[lang]).join(", ")}`);
    });

    /* confirm / skip / edit */
    const acc = card.querySelector('[data-act="accept"]');
    if (acc) acc.addEventListener("click", () => { f.userStatus = "accepted"; f.finalValue = f.value; renderFields(); });
    const rej = card.querySelector('[data-act="reject"]');
    if (rej) rej.addEventListener("click", () => { f.userStatus = "rejected"; f.finalValue = null; renderFields(); });
    const edt = card.querySelector('[data-act="edit"]');
    const editRow = card.querySelector(".edit-row");
    const input = editRow.querySelector("input");
    if (edt) edt.addEventListener("click", () => { editRow.classList.remove("hidden"); input.focus(); });
    const sav = card.querySelector('[data-act="save"]');
    if (sav) sav.addEventListener("click", () => {
      const v = input.value.trim();
      if (v) { f.userStatus = "edited"; f.finalValue = v; }
      else { f.userStatus = "rejected"; f.finalValue = null; }
      renderFields();
    });
    const can = card.querySelector('[data-act="cancel"]');
    if (can) can.addEventListener("click", () => { input.value = f.finalValue ?? ""; editRow.classList.add("hidden"); });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && sav) sav.click();
    });

    list.appendChild(card);
  });
  updateProgress();
}

function updateProgress() {
  const total = state.fields.length;
  const done = reviewedCount();
  $("progressText").textContent = t("fieldsProgress")(done, total);
  $("progressFill").style.width = total ? (done / total) * 100 + "%" : "0%";
  const pending = state.fields.some((f) => !f.userStatus);
  const banner = $("summaryBanner");
  banner.className = "summary-banner " + (pending ? "warn" : "info");
  banner.textContent = (pending ? "⚠️ " : "✅ ") + (pending ? t("summaryWarn") : t("summaryInfo"));
  banner.classList.remove("hidden");
  $("toStep4").disabled = pending;
}

$("backTo2").addEventListener("click", () => goToStep(2));
$("toStep4").addEventListener("click", () => {
  if (state.fields.some((f) => !f.userStatus)) { toast(t("confirmAllFirst")); return; }
  renderConfirmedSummary();
  goToStep(4);
});

/* ---------- Step 4: print + download ---------- */
function renderConfirmedSummary() {
  const wrap = $("confirmedSummary");
  wrap.innerHTML = "";
  state.fields.forEach((f) => {
    const row = document.createElement("div");
    row.className = "summary-row";
    const val = f.finalValue
      ? `<span class="v">${escapeHtml(f.finalValue)}</span>`
      : `<span class="v skipped">—</span>`;
    row.innerHTML = `<span class="k">${f.label[lang]}</span>${val}`;
    wrap.appendChild(row);
  });
}

function buildPrintArea() {
  const rows = state.fields.map((f) => `
    <tr><th>${escapeHtml(f.label[lang])}</th><td>${f.finalValue ? escapeHtml(f.finalValue) : "—"}</td></tr>`).join("");
  $("printArea").innerHTML = `
    <h1>${t("p_title")}</h1>
    <p class="p-sub">${t("p_sub")}</p>
    <table><tr><th>${t("p_field")}</th><th>${t("p_value")}</th></tr>${rows}</table>
    <p class="p-note">${t("p_note")}</p>`;
}

$("printBtn").addEventListener("click", () => { buildPrintArea(); window.print(); });
$("downloadBtn").addEventListener("click", async () => {
  const confirmedValues = {};
  state.fields.forEach((f) => {
    if (f.finalValue !== null && f.finalValue !== undefined && f.finalValue !== "") {
      confirmedValues[f.key] = f.finalValue;
    }
  });
  try {
    const res = await fetch(API_BASE + "/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formId: state.formId, confirmedValues }),
    });
    if (!res.ok) throw new Error("bad status");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "AasaanForm-kyc-draft.pdf";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  } catch { toast(t("pdfFail")); }
});

$("startOver").addEventListener("click", resetAll);

function resetAll() {
  state.fields = [];
  state.files.forEach((f) => f.url && URL.revokeObjectURL(f.url));
  state.files = [];
  state.formId = null; state.mode = null; state.guideIndex = 0;
  renderFileList(); refreshUploadState(); renderForms();
  $("modeWrap").classList.add("hidden");
  $("docChecklistWrap").classList.add("hidden");
  $("toStep2").classList.add("hidden");
  goToStep(1);
}

/* ---------- Self-fill voice guide ---------- */
function openGuide() {
  state.guideIndex = 0;
  document.querySelectorAll(".step-panel").forEach((p) => p.classList.add("hidden"));
  $("guide-panel").classList.remove("hidden");
  document.querySelectorAll("#stepperList .step").forEach((s) => {
    s.classList.toggle("active", s.dataset.step === "1");
    s.classList.remove("done");
  });
  renderGuide();
  speak(t("v_guideIntro"));
  setTimeout(speakGuideStep, 2500);
}

function renderGuide() {
  const total = GUIDE_SECTIONS.length;
  const i = Math.min(state.guideIndex, total - 1);
  const sec = GUIDE_SECTIONS[i];
  $("guideProgress").textContent = t("stepOf")(i + 1, total);
  $("guideStepTitle").textContent = sec.title[lang];
  $("guideStepText").textContent = i >= total ? t("guideDoneAll") : sec.text[lang];
  $("guidePrev").disabled = i === 0;
  $("guideDone").textContent = i === total - 1 ? "✅ " + (lang === "hi" ? "समाप्त" : "Finish") : t("markDone");
}

function speakGuideStep() {
  if ($("guide-panel").classList.contains("hidden")) return;
  const i = Math.min(state.guideIndex, GUIDE_SECTIONS.length - 1);
  const sec = GUIDE_SECTIONS[i];
  speak(`${sec.title[lang]}. ${sec.text[lang]}`);
}

$("modeSelf").addEventListener("click", () => {
  if (!state.formId) { toast(t("pickFormFirst")); return; }
  state.mode = "self";
  renderForms();
  openGuide();
});
$("guideSpeak").addEventListener("click", speakGuideStep);
$("guidePrev").addEventListener("click", () => {
  if (state.guideIndex > 0) { state.guideIndex--; renderGuide(); speakGuideStep(); }
});
$("guideDone").addEventListener("click", () => {
  if (state.guideIndex < GUIDE_SECTIONS.length - 1) {
    state.guideIndex++; renderGuide(); speakGuideStep();
  } else {
    speak(t("guideDoneAll"));
    toast(t("guideDoneAll"));
  }
});
$("guideExit").addEventListener("click", resetAll);

/* ---------- Header voice button ---------- */
$("voiceBtn").addEventListener("click", () => {
  if (state.mode === "self" && !$("guide-panel").classList.contains("hidden")) { speakGuideStep(); return; }
  speak(t("v_intro"));
});

/* ---------- Helpers ---------- */
function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add("hidden"), 3200);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeAttr(s) { return escapeHtml(s).replace(/"/g, "&quot;"); }

/* ---------- Init ---------- */
renderForms();
applyLang();
goToStep(1);