import { Link, useParams } from 'react-router-dom';
import Seo from '@/components/Seo';

function NotFound() {
  const params = useParams();
  const currentLang = params.lang || 'en';
  const prefix = currentLang === 'en' ? '' : `/${currentLang}`;

  return (
    <>
      <Seo
        title="Page Not Found | Pixel Art Village"
        description="The page you're looking for doesn't exist. Return to Pixel Art Village to create pixel art online."
        noindex={true}
        lang={currentLang}
      />
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            Return to Pixel Art Village to start creating amazing pixel art.
          </p>
          <Link
            to={`${prefix}/`}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            ← Back to Pixel Art Village
          </Link>

          <div className="mt-12 text-sm text-gray-500">
            <p>Or try these popular pages:</p>
            <nav className="mt-4 space-y-2">
              <Link to={`${prefix}/`} className="block text-blue-500 hover:text-blue-600">Home</Link>
              <Link to={`${prefix}/converter/png-to-pixel-art/`} className="block text-blue-500 hover:text-blue-600">PNG to Pixel Art Converter</Link>
              <Link to={`${prefix}/converter/jpg-to-pixel-art/`} className="block text-blue-500 hover:text-blue-600">JPG to Pixel Art Converter</Link>
              <Link to={`${prefix}/about/`} className="block text-blue-500 hover:text-blue-600">About Us</Link>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;