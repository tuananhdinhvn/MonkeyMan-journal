import { useTranslations } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default async function ContactPage() {
  const locale = (await getLocale()) as 'vi' | 'en' | 'ko';
  return <ContactContent locale={locale} />;
}

function ContactContent({ locale }: { locale: 'vi' | 'en' | 'ko' }) {
  const t = useTranslations('contact');

  const socials = [
    { icon: <Mail size={20} />, label: 'Email', value: 'tuananhdinh.vn@gmail.com', href: 'mailto:tuananhdinh.vn@gmail.com', color: 'bg-red-50 text-red-600 border-red-100' },
    { icon: <Phone size={20} />, label: t('phone_label'), value: '+84 xxx xxx xxx', href: 'tel:+84xxxxxxxxx', color: 'bg-orange-50 text-orange-600 border-orange-100' },
    { icon: <MessageCircle size={20} />, label: 'WhatsApp', value: '+84 xxx xxx xxx', href: '#', color: 'bg-green-50 text-green-600 border-green-100' },
    { icon: <span className="text-lg">📸</span>, label: 'Instagram', value: '@monkeyman.vn', href: '#', color: 'bg-pink-50 text-pink-600 border-pink-100' },
    { icon: <span className="text-lg">👍</span>, label: 'Facebook', value: 'MonkeyMan Vietnam', href: '#', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { icon: <span className="text-lg">▶️</span>, label: 'YouTube', value: 'MonkeyMan Channel', href: '#', color: 'bg-red-50 text-red-600 border-red-100' },
  ];

  return (
    <>
      {/* Header */}
      <div className="bg-slate-900 text-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-orange-400 font-medium uppercase tracking-widest text-sm mb-3">
            📬 Contact
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={18} className="text-orange-500" />
              <span className="text-slate-600">
                {locale === 'vi' ? 'Việt Nam 🇻🇳' : locale === 'en' ? 'Vietnam 🇻🇳' : '베트남 🇻🇳'}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {locale === 'vi' ? 'Kết nối với tôi' : locale === 'en' ? 'Connect with me' : '저와 연결하세요'}
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              {locale === 'vi'
                ? 'Tôi luôn sẵn sàng giúp bạn lên kế hoạch cho chuyến du lịch Việt Nam. Liên hệ bất cứ lúc nào!'
                : locale === 'en'
                ? "I'm always ready to help you plan your Vietnam trip. Contact me anytime!"
                : '베트남 여행 계획을 세우는 데 항상 도움을 드릴 준비가 되어 있습니다. 언제든지 연락해 주세요!'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={`flex items-center gap-3 border rounded-xl p-4 hover:shadow-md transition-all ${s.color}`}
                >
                  <span className="shrink-0">{s.icon}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{s.label}</p>
                    <p className="text-xs opacity-70 truncate">{s.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-slate-50 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {locale === 'vi' ? 'Gửi tin nhắn cho tôi' : locale === 'en' ? 'Send me a message' : '메시지 보내기'}
            </h2>
            <ContactForm locale={locale} />
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-14 bg-slate-100 rounded-3xl h-64 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <MapPin size={40} className="mx-auto mb-2 text-orange-400" />
            <p className="font-medium">Vietnam 🇻🇳</p>
            <p className="text-sm">
              {locale === 'vi' ? 'Tôi có thể đón bạn ở mọi tỉnh thành' : locale === 'en' ? 'Available across all provinces' : '모든 지역에서 이용 가능'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
