import { useTranslation } from 'react-i18next';

export default function FeaturesSection({ paletteDescription }) {
  const { t } = useTranslation();
  return (
    <section id="features" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900">
          {t('features.title')}
        </h2>

        {/* 将大段说明拆成两段，限制行宽并提高行距，缓解拥挤感 */}
        <div className="mt-4 md:mt-6 text-center">
          <p className="mx-auto max-w-3xl text-gray-600 leading-relaxed">
            {t('features.desc')}
          </p>
        </div>

        {/* 功能卡片：更大的 gap 与 padding；卡片等高，整体更疏朗 */}
        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 xl:gap-8">
          {/* Palette control */}
          <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm p-6 md:p-7">
            <div className="flex items-start gap-4">
              <div className="shrink-0 text-2xl md:text-3xl">🎨</div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">{t('features.palette.title')}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {paletteDescription || t('features.palette.desc')}
                </p>
              </div>
            </div>
          </div>

          {/* Live adjustments */}
          <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm p-6 md:p-7">
            <div className="flex items-start gap-4">
              <div className="shrink-0 text-2xl md:text-3xl">⚙️</div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">{t('features.live.title')}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {t('features.live.desc')}
                </p>
              </div>
            </div>
          </div>

          {/* 100% client‑side */}
          <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm p-6 md:p-7">
            <div className="flex items-start gap-4">
              <div className="shrink-0 text-2xl md:text-3xl">🔒</div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">{t('features.clientSide.title')}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  {t('features.clientSide.desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
