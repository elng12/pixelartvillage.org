import { useTranslation } from 'react-i18next';

function IconBase({ className, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  )
}

function IconUpload({ className }) {
  return (
    <IconBase className={className}>
      <path d="M20 16.5a4.5 4.5 0 0 0-1.7-8.67 6 6 0 0 0-11.6 1.64A4 4 0 0 0 6 16" />
      <path d="M12 16V8" />
      <path d="M9 11l3-3 3 3" />
    </IconBase>
  )
}

function IconAdjust({ className }) {
  return (
    <IconBase className={className}>
      <path d="M4 7h10" />
      <circle cx="18" cy="7" r="2" />
      <path d="M20 17H10" />
      <circle cx="6" cy="17" r="2" />
      <path d="M4 12h16" />
    </IconBase>
  )
}

function IconDownload({ className }) {
  return (
    <IconBase className={className}>
      <path d="M12 3v10" />
      <path d="M9 10l3 3 3-3" />
      <path d="M4 17h16" />
      <path d="M6 21h12" />
    </IconBase>
  )
}

function PixelStep({ n, title, children, icon }) {
  return (
    <div className="relative bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center overflow-hidden">
      {/* Faint grid for large screens */}
      <div className="hidden md:block absolute inset-0 pointer-events-none pixel-grid-bg" aria-hidden />
      {/* Pixel corners (lg screens) */}
      <div className="hidden md:block absolute top-2 left-2 w-2 h-2 bg-violet-400/70" aria-hidden />
      <div className="hidden md:block absolute top-2 right-2 w-2 h-2 bg-blue-500/70" aria-hidden />
      <div className="hidden md:block absolute bottom-2 left-2 w-2 h-2 bg-blue-500/70" aria-hidden />
      <div className="hidden md:block absolute bottom-2 right-2 w-2 h-2 bg-violet-400/70" aria-hidden />

      {/* 图标区（小尺寸简洁，≥md 展示完整） */}
      <div className="relative inline-flex items-center justify-center mb-3">
        {icon}
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-semibold bg-violet-500 text-white shadow-sm">
          {n}
        </span>
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm md:text-base">{children}</p>
    </div>
  )
}

function HowItWorksSection() {
  const { t } = useTranslation();
  return (
    <section id="how-it-works" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t('how.title')}</h2>
        <p className="text-base md:text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8">
          {t('how.desc')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          <PixelStep n={1} title={t('how.steps.upload')} icon={<IconUpload className="w-14 h-14 text-blue-600 md:w-16 md:h-16" /> }>
            {t('how.steps.upload.desc')}
          </PixelStep>
          <PixelStep n={2} title={t('how.steps.adjust')} icon={<IconAdjust className="w-14 h-14 text-blue-600 md:w-16 md:h-16" /> }>
            {t('how.steps.adjust.desc')}
          </PixelStep>
          <PixelStep n={3} title={t('how.steps.download')} icon={<IconDownload className="w-14 h-14 text-blue-600 md:w-16 md:h-16" /> }>
            {t('how.steps.download.desc')}
          </PixelStep>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
