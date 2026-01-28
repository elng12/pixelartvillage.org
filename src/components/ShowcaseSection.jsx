import { useTranslation } from 'react-i18next';
import showcaseBefore480Webp from '@/assets/generated/showcase-before-w480.webp';
import showcaseBefore800Webp from '@/assets/generated/showcase-before-w800.webp';
import showcaseBefore1200Webp from '@/assets/generated/showcase-before-w1200.webp';
import showcaseBefore480Jpg from '@/assets/generated/showcase-before-w480.jpg';
import showcaseBefore800Jpg from '@/assets/generated/showcase-before-w800.jpg';
import showcaseBefore1200Jpg from '@/assets/generated/showcase-before-w1200.jpg';
import showcaseAfter480Webp from '@/assets/generated/showcase-after-w480.webp';
import showcaseAfter800Webp from '@/assets/generated/showcase-after-w800.webp';
import showcaseAfter1200Webp from '@/assets/generated/showcase-after-w1200.webp';
import showcaseAfter480Jpg from '@/assets/generated/showcase-after-w480.jpg';
import showcaseAfter800Jpg from '@/assets/generated/showcase-after-w800.jpg';
import showcaseAfter1200Jpg from '@/assets/generated/showcase-after-w1200.jpg';

function ShowcaseSection() {
  const { t } = useTranslation();
  return (
    <section id="showcase" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t('showcase.title')}</h2>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
          {t('showcase.descFull')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6 md:gap-x-8 items-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{t('showcase.before')}</h3>
            <picture>
              <source
                type="image/webp"
                srcSet={`${showcaseBefore480Webp} 480w, ${showcaseBefore800Webp} 800w, ${showcaseBefore1200Webp} 1200w`}
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
              />
              <img
                src={showcaseBefore1200Jpg}
                srcSet={`${showcaseBefore480Jpg} 480w, ${showcaseBefore800Jpg} 800w, ${showcaseBefore1200Jpg} 1200w`}
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
                alt={t('showcase.alt.before')}
                loading="lazy"
                decoding="async"
                className="w-full max-w-[440px] md:max-w-[480px] lg:max-w-[520px] mx-auto bg-white object-contain aspect-[800/1062]"
                width="800"
                height="1062"
              />
            </picture>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{t('showcase.after')}</h3>
            <picture>
              <source
                type="image/webp"
                srcSet={`${showcaseAfter480Webp} 480w, ${showcaseAfter800Webp} 800w, ${showcaseAfter1200Webp} 1200w`}
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
              />
              <img
                src={showcaseAfter1200Jpg}
                srcSet={`${showcaseAfter480Jpg} 480w, ${showcaseAfter800Jpg} 800w, ${showcaseAfter1200Jpg} 1200w`}
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
                alt={t('showcase.alt.after')}
                loading="lazy"
                decoding="async"
                className="w-full max-w-[440px] md:max-w-[480px] lg:max-w-[520px] mx-auto bg-white object-contain aspect-[800/1062]"
                width="800"
                height="1062"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShowcaseSection;
