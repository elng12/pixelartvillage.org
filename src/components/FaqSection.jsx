import { useTranslation } from 'react-i18next';

function FaqSection({ title, items, sectionId = 'faq', backgroundClassName = 'bg-gray-50', compactLayout = false }) {
  const { t } = useTranslation();
  const resolvedTitle = title || t('faq.title');
  const faqs = items || t('faq.items', { returnObjects: true }) || [];
  return (
    <section id={sectionId} className={`${compactLayout ? 'py-8' : 'py-12 md:py-16'} ${backgroundClassName}`}>
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className={`${compactLayout ? 'text-2xl text-left mb-4' : 'text-3xl md:text-4xl text-center mb-8'} font-bold`}>{resolvedTitle}</h2>
        <div className="space-y-3">
          {(Array.isArray(faqs) ? faqs : []).map((faq, index) => (
            <article key={index} className={compactLayout ? 'border-b border-gray-200 py-3' : 'p-6 bg-white rounded-lg border border-gray-200 shadow-sm'}>
              <h3 className={`${compactLayout ? 'text-base' : 'text-lg md:text-xl'} font-semibold text-gray-900`}>
                {faq.question}
              </h3>
              <p className={`${compactLayout ? 'mt-2 text-sm' : 'mt-3 md:mt-4'} text-gray-700 leading-relaxed`}>
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
