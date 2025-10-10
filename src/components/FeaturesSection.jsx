import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <section id="features" className="py-16 md:py-20 bg-white">
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
        <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
          {/* Palette control */}
          <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0 text-2xl md:text-3xl">🎨</div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Palette control</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  Our image to pixel art converter gives precise palette control. Choose built-in retro palettes or auto-extract tones from your image, then lock, reorder, and fine-tune hues to match your style. With consistent palettes, your image to pixel art conversions keep sprites readable, game-ready, and easy to reuse across projects.
                </p>
              </div>
            </div>
          </div>

          {/* Live adjustments */}
          <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0 text-2xl md:text-3xl">⚙️</div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Live adjustments</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  Tweak pixel size, dithering, contrast, and brightness while your image to pixel art results update instantly. Side-by-side changes appear with no lag, so you can compare options and settle on the perfect look faster. Live preview reduces guesswork and keeps your image to pixel art conversions predictable on every export.
                </p>
              </div>
            </div>
          </div>

          {/* 100% client‑side */}
          <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0 text-2xl md:text-3xl">🔒</div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">100% client‑side</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">
                  All conversion runs 100% client-side in your browser. Images never leave your device, and offline builds are possible, keeping assets private and safe. Pixel Art Village protects your work while delivering fast, secure processing across desktop and mobile. With Pixel Art Village you retain control from first preview to final export.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
