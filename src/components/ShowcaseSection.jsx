import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const showcaseBeforeWebpSrcSet = '/showcase-before-w480.webp 480w, /showcase-before-w520.webp 520w, /showcase-before-w640.webp 640w, /showcase-before-w700.webp 700w, /showcase-before-w736.webp 736w, /showcase-before-w800.webp 800w, /showcase-before-w928.webp 928w';
const showcaseBeforeJpgSrcSet = '/showcase-before-w480.jpg 480w, /showcase-before-w520.jpg 520w, /showcase-before-w640.jpg 640w, /showcase-before-w700.jpg 700w, /showcase-before-w736.jpg 736w, /showcase-before-w800.jpg 800w, /showcase-before-w928.jpg 928w';
const showcaseAfterWebpSrcSet = '/showcase-after-w480.webp 480w, /showcase-after-w520.webp 520w, /showcase-after-w640.webp 640w, /showcase-after-w700.webp 700w, /showcase-after-w736.webp 736w, /showcase-after-w800.webp 800w, /showcase-after-w928.webp 928w';
const showcaseAfterJpgSrcSet = '/showcase-after-w480.jpg 480w, /showcase-after-w520.jpg 520w, /showcase-after-w640.jpg 640w, /showcase-after-w700.jpg 700w, /showcase-after-w736.jpg 736w, /showcase-after-w800.jpg 800w, /showcase-after-w928.jpg 928w';
const showcaseImageClassName = 'w-full max-w-[440px] md:max-w-[480px] lg:max-w-[520px] mx-auto bg-white object-contain aspect-[928/1232]';

function DeferredShowcaseImage({ alt, jpgSrcSet, webpSrcSet, src }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const placeholderRef = useRef(null);

  useEffect(() => {
    if (!placeholderRef.current || shouldLoad) return;

    let fallbackTimerId = 0;

    const loadImage = () => {
      setShouldLoad(true);
    };
    const maybeLoadWhenNearViewport = () => {
      const rect = placeholderRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (rect.bottom <= 0) return;
      if (rect.top <= window.innerHeight * 0.9) {
        loadImage();
      }
    };

    window.addEventListener('scroll', maybeLoadWhenNearViewport, { passive: true });
    window.addEventListener('resize', maybeLoadWhenNearViewport);
    window.addEventListener('pointerdown', loadImage, { passive: true });
    window.addEventListener('keydown', loadImage);
    fallbackTimerId = window.setTimeout(loadImage, 2500);

    return () => {
      window.clearTimeout(fallbackTimerId);
      window.removeEventListener('scroll', maybeLoadWhenNearViewport);
      window.removeEventListener('resize', maybeLoadWhenNearViewport);
      window.removeEventListener('pointerdown', loadImage);
      window.removeEventListener('keydown', loadImage);
    };
  }, [shouldLoad]);

  return (
    <div
      ref={placeholderRef}
      data-showcase-placeholder={shouldLoad ? undefined : 'true'}
      className={`${showcaseImageClassName} relative overflow-hidden rounded-xl border border-gray-200`}
    >
      {shouldLoad ? (
        <picture>
          <source
            type="image/webp"
            srcSet={webpSrcSet}
            sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
          />
          <img
            src={src}
            srcSet={jpgSrcSet}
            sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
            alt={alt}
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            className={showcaseImageClassName}
            width="928"
            height="1232"
          />
        </picture>
      ) : (
        <div
          aria-hidden
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 via-white to-blue-50"
        >
          <div className="h-[68%] w-[52%] rounded-xl border border-gray-200/80 bg-white shadow-sm" />
        </div>
      )}
    </div>
  );
}

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
            <DeferredShowcaseImage
              alt={t('showcase.alt.before')}
              jpgSrcSet={showcaseBeforeJpgSrcSet}
              webpSrcSet={showcaseBeforeWebpSrcSet}
              src="/showcase-before-w928.jpg"
            />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">{t('showcase.after')}</h3>
            <DeferredShowcaseImage
              alt={t('showcase.alt.after')}
              jpgSrcSet={showcaseAfterJpgSrcSet}
              webpSrcSet={showcaseAfterWebpSrcSet}
              src="/showcase-after-w928.jpg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShowcaseSection;
