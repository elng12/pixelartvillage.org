import React from 'react';
import { useTranslation } from 'react-i18next';

function ShowcaseSection() {
  const { t } = useTranslation();
  return (
    <section id="showcase" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t('showcase.title')}</h2>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
          {t('showcase.desc')} See how our image to pixel art converter transforms your photos into crisp pixel art.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6 md:gap-x-8 items-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{t('showcase.before')}</h3>
            <picture>
              <source
                type="image/webp"
                srcSet="/showcase-before-w480.webp 480w, /showcase-before-w800.webp 800w, /showcase-before-w1200.webp 1200w"
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
              />
              <img
                src="/showcase-before-w1200.jpg"
                srcSet="/showcase-before-w480.jpg 480w, /showcase-before-w800.jpg 800w, /showcase-before-w1200.jpg 1200w"
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 600px"
                alt={t('showcase.alt.before')}
                loading="lazy"
                decoding="async"
                className="w-full max-w-[440px] md:max-w-[480px] lg:max-w-[520px] mx-auto bg-white object-contain"
                width="600"
                height="400"
              />
            </picture>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{t('showcase.after')}</h3>
            <picture>
              <source
                type="image/webp"
                srcSet="/showcase-after-w480.webp 480w, /showcase-after-w800.webp 800w, /showcase-after-w1200.webp 1200w"
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
              />
              <img
                src="/showcase-after-w1200.jpg"
                srcSet="/showcase-after-w480.jpg 480w, /showcase-after-w800.jpg 800w, /showcase-after-w1200.jpg 1200w"
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 600px"
                alt={t('showcase.alt.after')}
                loading="lazy"
                decoding="async"
                className="w-full max-w-[440px] md:max-w-[480px] lg:max-w-[520px] mx-auto bg-white object-contain"
                width="600"
                height="400"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShowcaseSection;
