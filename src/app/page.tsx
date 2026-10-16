'use client';

import Link from 'next/link';
import { MinusIcon } from '@heroicons/react/24/solid';
import { useAppContext } from '@/lib/app-context';

export default function Home() {
  const { language } = useAppContext();

  // Texts in different languages
  const t = {
    en: {
      tagline: 'Understand every field. Fill with confidence.',
      description:
        'An AI-powered form understanding and assisted form completion tool for people who struggle with unfamiliar forms.',
      startButton: 'Start a Form',
      features: [
        {
          title: 'AI-Powered Understanding',
          description:
            'Upload a form and let AI explain each field in simple language.',
          icon: MinusIcon,
        },
        {
          title: 'Guided Completion',
          description:
            'Extract information from your documents and get help filling out the form correctly.',
          icon: '📄',
        },
        {
          title: 'Printable Draft',
          description:
            'Review your entries and create a clean, printable draft.',
          icon: '🖨️',
        },
      ],
      footer: '© 2026 PatraPilot AI. A hackathon project for Poona College CodeCraft 2026.',
    },
    hi: {
      tagline: 'हर फ़ील्ड समझें। भरने में भरोसा रखें।',
      description:
        'अनजान फ़ॉर्म्स को समझने और भरने में मदद करने वाला एक AI-संचालित उपकरण।',
      startButton: 'एक फ़ॉर्म शुरू करें',
      features: [
        {
          title: 'AI-संचालित समझ',
          description:
            'एक फ़ॉर्म अपलोड करें और AI को प्रत्येक फ़ील्ड को सरल भाषा में समझाने दें।',
          icon: MinusIcon,
        },
        {
          title: 'निर्देशित भरना',
          description:
            'अपने दस्तावेजों से जानकारी निकालें और फ़ॉर्म सही भरने में मदद प्राप्त करें।',
          icon: '📄',
        },
        {
          title: 'प्रिंट करने योग्य ड्राफ्ट',
          description:
            'अपकी एंट्रीज़ की समीक्षा करें और एक स्वच्छ, प्रिंट करने योग्य ड्राफ्ट बनाएं।',
          icon: '🖨️',
        },
      ],
      footer: '© 2026 PatraPilot AI. पून कॉलेज कोडक्राफ्ट 2026 के हैकाथॉन प्रोजेक्ट।',
    },
    mr: {
      tagline: 'प्रत्येक क्षेत्र समजून घ्या. भरपूर विश्वासाने भरा.',
      description:
        'अप komponente form समजून घेणे आणि भरणे करण्यास मदत करतो artificial intelligence-powered साधन.',
      startButton: 'एक फॉर्म सुरू करा',
      features: [
        {
          title: 'AI-powered समज',
          description:
            'एक फॉर्म अपलोड करा आणि AI लABEL प्रत्येक field ला सोप्या भाषेत स्पष्ट करायला द्या.',
          icon: MinusIcon,
        },
        {
          title: 'मार्गदर्शित भरने',
          description:
            'तुमच्या दस्तऐवजांमधील माहिती काढा आणि फॉर्म खरेFill करण्यास मदत मिळवा.',
          icon: '📄',
        },
        {
          title: 'प्रिंट करण्यायोग्य ड्राफ्ट',
          description:
            'तुमच्या एंट्रीज pregat करा आणि स्वच्छ, प्रिंट करण्यायोग्य ड्राफ्ट तयार करा.',
          icon: '🖨️',
        },
      ],
      footer: '© 2026 PatraPilot AI. पुणे कॉलेज कोडक्राफ्ट 2026 चा हक्काथॉन प्रकल्प.',
    },
  };

  const lang = language === 'hi' ? t.hi : language === 'mr' ? t.mr : t.en;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-indigo-600">
                PatraPilot AI
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/lang" className="text-sm text-gray-600 hover:text-gray-900">
                Language
              </Link>
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy
              </Link>
              <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                About
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-700 mb-4">
            {lang.tagline}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {lang.description}
          </p>
          <Link href="/form-upload" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors">
            {lang.startButton}
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {lang.features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  {typeof feature.icon === 'string' ? (
                    <span className="text-indigo-600">{feature.icon}</span>
                  ) : (
                    <feature.icon className="h-6 w-6 text-indigo-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-sm text-gray-500">
            {lang.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}