import { useTranslation } from 'react-i18next';

function FaqSection({ title, items, sectionId = 'faq', backgroundClassName = 'bg-gray-50' }) {
  const { t } = useTranslation();
  const resolvedTitle = title || t('faq.title');
  const faqs = items || t('faq.items', { returnObjects: true }) || [];
  return (
    <section id={sectionId} className={`py-12 md:py-16 ${backgroundClassName}`}>
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{resolvedTitle}</h2>
        <div className="space-y-3">
          {(Array.isArray(faqs) ? faqs : []).map((faq, index) => (
            <article key={index} className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                {faq.question}
              </h3>
              <p className="mt-3 md:mt-4 text-gray-700 leading-relaxed">
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
