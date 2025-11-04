import { useTranslation } from 'react-i18next';

function FaqSection() {
  const { t } = useTranslation();
  const faqs = t('faq.items', { returnObjects: true }) || [];
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('faq.title')}</h2>
        <div className="space-y-4">
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
