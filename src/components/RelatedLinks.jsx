import React from 'react';
import { Link } from 'react-router-dom';

const RELATED_CONVERTERS = [
  {
    title: 'Image to Pixel Art',
    href: '/converter/image-to-pixel-art/',
    description: 'Universal converter for all image formats',
    icon: '🎨'
  },
  {
    title: 'PNG to Pixel Art',
    href: '/converter/png-to-pixel-art/',
    description: 'Convert PNG images with transparency',
    icon: '🖼️'
  },
  {
    title: 'JPG to Pixel Art',
    href: '/converter/jpg-to-pixel-art/',
    description: 'Transform photos into retro graphics',
    icon: '📷'
  },
  {
    title: 'Photo to Sprite',
    href: '/converter/photo-to-sprite-converter/',
    description: 'Create game-ready sprites from photos',
    icon: '🎮'
  },
  {
    title: '8-bit Art Generator',
    href: '/converter/8-bit-art-generator/',
    description: 'Generate authentic 8-bit style artwork',
    icon: '👾'
  },
  {
    title: 'Pixelate Image Online',
    href: '/converter/pixelate-image-online/',
    description: 'Fast and free image pixelation',
    icon: '⚡'
  }
];

const RELATED_GUIDES = [
  {
    title: 'How to Pixelate an Image',
    href: '/blog/how-to-pixelate-an-image/',
    description: 'Beginner-friendly guide to pixel art',
    icon: '📖'
  },
  {
    title: 'Export from Illustrator',
    href: '/blog/export-from-illustrator-image-to-pixel-art/',
    description: 'Avoid pixelation issues when exporting',
    icon: '💡'
  },
  {
    title: 'Make Image More Like Pixel',
    href: '/blog/make-image-more-like-pixel/',
    description: 'Basic editing techniques for better results',
    icon: '✨'
  },
  {
    title: 'Get Pixel Art Version of Image',
    href: '/blog/how-to-get-pixel-art-version-of-image/',
    description: 'Complete converter guide with SNES tips',
    icon: '🎯'
  }
];

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
  // 过滤掉当前页面
  const converters = RELATED_CONVERTERS
    .filter(item => item.href !== currentPath)
    .slice(0, maxConverters);
  
  const guides = RELATED_GUIDES
    .filter(item => item.href !== currentPath)
    .slice(0, maxGuides);

  const showConverters = type === 'all' || type === 'converters';
  const showGuides = type === 'all' || type === 'guides';

  // 如果没有要显示的内容，不渲染
  if ((showConverters && converters.length === 0) && (showGuides && guides.length === 0)) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-12 mt-16" aria-label="Related tools and guides">
      <div className="container mx-auto px-4">
        {showConverters && converters.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Related Pixel Art Converters
            </h2>
            <p className="text-gray-600 mb-6">
              Explore more free tools to convert images to pixel art
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {converters.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group block p-5 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {showGuides && guides.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Pixel Art Tutorials & Guides
            </h2>
            <p className="text-gray-600 mb-6">
              Learn how to create better pixel art with our step-by-step tutorials
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guides.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group block p-5 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-snug">
                        {item.description}
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

