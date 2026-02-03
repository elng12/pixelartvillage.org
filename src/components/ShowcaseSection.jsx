import { useTranslation } from 'react-i18next';
import showcaseBefore480Webp from '@/assets/generated/showcase-before-w480.webp';
import showcaseBefore520Webp from '@/assets/generated/showcase-before-w520.webp';
import showcaseBefore640Webp from '@/assets/generated/showcase-before-w640.webp';
import showcaseBefore700Webp from '@/assets/generated/showcase-before-w700.webp';
import showcaseBefore736Webp from '@/assets/generated/showcase-before-w736.webp';
import showcaseBefore800Webp from '@/assets/generated/showcase-before-w800.webp';
import showcaseBefore928Webp from '@/assets/generated/showcase-before-w928.webp';
import showcaseBefore480Jpg from '@/assets/generated/showcase-before-w480.jpg';
import showcaseBefore520Jpg from '@/assets/generated/showcase-before-w520.jpg';
import showcaseBefore640Jpg from '@/assets/generated/showcase-before-w640.jpg';
import showcaseBefore700Jpg from '@/assets/generated/showcase-before-w700.jpg';
import showcaseBefore736Jpg from '@/assets/generated/showcase-before-w736.jpg';
import showcaseBefore800Jpg from '@/assets/generated/showcase-before-w800.jpg';
import showcaseBefore928Jpg from '@/assets/generated/showcase-before-w928.jpg';
import showcaseAfter480Webp from '@/assets/generated/showcase-after-w480.webp';
import showcaseAfter520Webp from '@/assets/generated/showcase-after-w520.webp';
import showcaseAfter640Webp from '@/assets/generated/showcase-after-w640.webp';
import showcaseAfter700Webp from '@/assets/generated/showcase-after-w700.webp';
import showcaseAfter736Webp from '@/assets/generated/showcase-after-w736.webp';
import showcaseAfter800Webp from '@/assets/generated/showcase-after-w800.webp';
import showcaseAfter928Webp from '@/assets/generated/showcase-after-w928.webp';
import showcaseAfter480Jpg from '@/assets/generated/showcase-after-w480.jpg';
import showcaseAfter520Jpg from '@/assets/generated/showcase-after-w520.jpg';
import showcaseAfter640Jpg from '@/assets/generated/showcase-after-w640.jpg';
import showcaseAfter700Jpg from '@/assets/generated/showcase-after-w700.jpg';
import showcaseAfter736Jpg from '@/assets/generated/showcase-after-w736.jpg';
import showcaseAfter800Jpg from '@/assets/generated/showcase-after-w800.jpg';
import showcaseAfter928Jpg from '@/assets/generated/showcase-after-w928.jpg';

function ShowcaseSection() {
  const { t } = useTranslation();
  return (
    <section id="showcase" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t('showcase.title')}</h2>
        <p className="text-base md:text-lg text-gray-600 text-center max-w-3xl mx-auto mb-8">
          {t('showcase.descFull')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6 md:gap-x-8 items-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{t('showcase.before')}</h3>
            <picture>
              <source
                type="image/webp"
                srcSet={`${showcaseBefore480Webp} 480w, ${showcaseBefore520Webp} 520w, ${showcaseBefore640Webp} 640w, ${showcaseBefore700Webp} 700w, ${showcaseBefore736Webp} 736w, ${showcaseBefore800Webp} 800w, ${showcaseBefore928Webp} 928w`}
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
              />
              <img
                src={showcaseBefore928Jpg}
                srcSet={`${showcaseBefore480Jpg} 480w, ${showcaseBefore520Jpg} 520w, ${showcaseBefore640Jpg} 640w, ${showcaseBefore700Jpg} 700w, ${showcaseBefore736Jpg} 736w, ${showcaseBefore800Jpg} 800w, ${showcaseBefore928Jpg} 928w`}
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
                alt={t('showcase.alt.before')}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full max-w-[440px] md:max-w-[480px] lg:max-w-[520px] mx-auto bg-white object-contain aspect-[928/1232]"
                width="928"
                height="1232"
              />
            </picture>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{t('showcase.after')}</h3>
            <picture>
              <source
                type="image/webp"
                srcSet={`${showcaseAfter480Webp} 480w, ${showcaseAfter520Webp} 520w, ${showcaseAfter640Webp} 640w, ${showcaseAfter700Webp} 700w, ${showcaseAfter736Webp} 736w, ${showcaseAfter800Webp} 800w, ${showcaseAfter928Webp} 928w`}
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
              />
              <img
                src={showcaseAfter928Jpg}
                srcSet={`${showcaseAfter480Jpg} 480w, ${showcaseAfter520Jpg} 520w, ${showcaseAfter640Jpg} 640w, ${showcaseAfter700Jpg} 700w, ${showcaseAfter736Jpg} 736w, ${showcaseAfter800Jpg} 800w, ${showcaseAfter928Jpg} 928w`}
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
                alt={t('showcase.alt.after')}
                loading="lazy"
                decoding="async"
                className="w-full max-w-[440px] md:max-w-[480px] lg:max-w-[520px] mx-auto bg-white object-contain aspect-[928/1232]"
                width="928"
                height="1232"
              />
            </picture>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShowcaseSection;
