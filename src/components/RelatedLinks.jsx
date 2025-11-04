import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ICONS = {
  'Image to Pixel Art': '🎨',
  'PNG to Pixel Art': '🖼️',
  'JPG to Pixel Art': '📷',
  'Photo to Sprite': '🎮',
  '8-bit Art Generator': '👾',
  'Pixelate Image Online': '⚡',
  'How to Pixelate an Image': '📖',
  'Export from Illustrator': '💡',
  'Make Image More Like Pixel': '✨',
  'Get Pixel Art Version of Image': '🎯'
};

/**
 * RelatedLinks组件 - 内部链接优化
 * 
 * @param {string} currentPath - 当前页面路径，用于过滤掉当前页面
 * @param {string} type - 显示类型: 'all' | 'converters' | 'guides'
 * @param {number} maxConverters - 最多显示多少个converter链接
 * @param {number} maxGuides - 最多显示多少个guide链接
 */
export default function RelatedLinks({ 
  currentPath = '', 
  type = 'all',
  maxConverters = 6,
  maxGuides = 4
}) {
  const { t } = useTranslation();
  const converters = t('related.converters.items', { returnObjects: true }) || [];
  const guides = t('related.guides.items', { returnObjects: true }) || [];
  
  // 过滤掉当前页面
  const filteredConverters = (Array.isArray(converters) ? converters : [])
    .filter(item => item.href !== currentPath)
    .slice(0, maxConverters);
  
  const filteredGuides = (Array.isArray(guides) ? guides : [])
    .filter(item => item.href !== currentPath)
    .slice(0, maxGuides);

  const showConverters = type === 'all' || type === 'converters';
  const showGuides = type === 'all' || type === 'guides';

  // 如果没有要显示的内容，不渲染
  if ((showConverters && filteredConverters.length === 0) && (showGuides && filteredGuides.length === 0)) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-12 mt-16" aria-label="Related tools and guides">
      <div className="container mx-auto px-4">
        {showConverters && filteredConverters.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {t('related.converters.title')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('related.converters.desc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConverters.map((item, index) => (
                <Link
                  key={item.href || index}
                  to={item.href}
                  className="group block p-5 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
                      {ICONS[item.title] || '🎨'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {showGuides && filteredGuides.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {t('related.guides.title')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('related.guides.desc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGuides.map((item, index) => (
                <Link
                  key={item.href || index}
                  to={item.href}
                  className="group block p-5 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
                      {ICONS[item.title] || '📖'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

