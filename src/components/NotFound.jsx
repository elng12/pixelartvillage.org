import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/Seo';
import { useLocaleContext } from '@/contexts/LocaleContext';

function NotFound() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const { buildPath } = useLocaleContext();
  
  return (
    <>
      <Seo
        title={t('notFound.seoTitle')}
        description={t('notFound.desc')}
        noindex={true}
        lang={lang || 'en'}
      />
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('notFound.title')}</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {t('notFound.desc')}
          </p>
          <Link
            to={buildPath('/')}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            {t('notFound.backHome')}
          </Link>

          <div className="mt-12 text-sm text-gray-500">
            <p>{t('notFound.popularPages')}</p>
            <nav className="mt-4 space-y-2">
              <Link to={buildPath('/')} className="block text-blue-500 hover:text-blue-600">{t('notFound.links.home')}</Link>
              <Link to={buildPath('/converter/png-to-pixel-art/')} className="block text-blue-500 hover:text-blue-600">{t('notFound.links.pngConverter')}</Link>
              <Link to={buildPath('/converter/jpg-to-pixel-art/')} className="block text-blue-500 hover:text-blue-600">{t('notFound.links.jpgConverter')}</Link>
              <Link to={buildPath('/about/')} className="block text-blue-500 hover:text-blue-600">{t('notFound.links.about')}</Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;
