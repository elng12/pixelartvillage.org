import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { useTranslation } from 'react-i18next';

function Header({ rightSlot }) {
  const { t, i18n } = useTranslation()
  const [current, setCurrent] = useState('tool');
  // 依赖语言变化，避免翻译值被缓存
  // 同时支持锚点型（id）与路由型（to）链接
  const NAV_LINKS = useMemo(() => ([
    { id: 'tool', label: t('nav.home') },
    { id: 'showcase', label: t('nav.examples') },
    { id: 'features', label: t('nav.features') },
    { id: 'how-it-works', label: t('nav.how') },
    { id: 'faq', label: t('nav.faq') },
    { to: 'blog', label: t('nav.blog') },
  ]), [i18n.language]);

  useEffect(() => {
    const observeIds = ['tool', ...NAV_LINKS.map((l) => l.id).filter(Boolean)];
    const sections = observeIds
      .map((id) => document.querySelector(`#${id}`))
      .filter(Boolean);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setCurrent(`#${visible[0].target.id}`.replace('#', ''));
      },
      { root: null, threshold: [0.3, 0.6] }
    );
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [NAV_LINKS]);

  const params = useParams();
  const lang = params.lang || 'en';
  const location = useLocation();
  const isBlog = location.pathname.includes('/blog');

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="text-2xl font-bold text-gray-800">
            <Link to={`/${lang}/`} aria-label="Pixel Art Village home">
              Pixel Art Village
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.id || link.to}
                  to={link.id ? `/${lang}/#${link.id}` : `/${lang}/${link.to}`}
                  aria-current={link.id ? (current===link.id?'page':undefined) : (isBlog ? 'page' : undefined)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {rightSlot ? <div className="flex items-center gap-2">{rightSlot}</div> : null}
            <div className="flex items-center">
              <Avatar size={40} userId="guest" title="User avatar" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
