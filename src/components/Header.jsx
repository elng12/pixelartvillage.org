import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { useTranslation } from 'react-i18next';

function Header({ rightSlot }) {
  const { t } = useTranslation()
  const [current, setCurrent] = useState('tool');
  // 支持锚点型（id）与路由型（to）链接；直接在渲染期取文案，避免首次渲染时资源未就绪导致标签停留在 key
  const NAV_LINKS = [
    { id: 'tool', label: t('nav.home') },
    { id: 'showcase', label: t('nav.examples') },
    { id: 'features', label: t('nav.features') },
    { id: 'how-it-works', label: t('nav.how') },
    { id: 'faq', label: t('nav.faq') },
    { to: 'blog', label: t('nav.blog') },
  ]

  useEffect(() => {
    const observeIds = ['tool', 'showcase', 'features', 'how-it-works', 'faq'];
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
  }, []);

  const params = useParams();
  const rawLang = params.lang || 'en';
  // 默认语言不使用 /en/ 前缀，直接根路径
  const prefix = rawLang === 'en' ? '' : `/${rawLang}`;
  const location = useLocation();
  const isBlog = location.pathname.includes('/blog');
  const navigate = useNavigate();

  function scrollToSection(id) {
    const homePath = `${prefix}/`;
    const onHome = location.pathname === homePath;
    if (onHome) {
      // 下一帧滚动，确保节点已渲染
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } else {
      // 跨页：导航到首页并携带 hash，ScrollManager 负责滚动
      navigate(`${prefix}/#${id}`);
    }
  }

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="text-2xl font-bold text-gray-800">
            <Link to={`${prefix}/`} aria-label="Pixel Art Village home" title="Pixel Art Village Home">
              Pixel Art Village
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
              {NAV_LINKS.map((link) => {
                const NAV_TITLES = {
                  tool: t('navTitle.hero'),
                  showcase: t('navTitle.examples'),
                  features: t('navTitle.features'),
                  'how-it-works': t('navTitle.how'),
                  faq: t('navTitle.faq'),
                  blog: t('navTitle.blog'),
                };
                const to = link.id ? undefined : `${prefix}/${link.to}`
                const key = link.id || link.to;
                const titleText = NAV_TITLES[key] || (typeof link.label === 'string' ? link.label : undefined);
                // 锚点型：button + 平滑滚动；路由型：保留 Link
                return link.id ? (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    aria-controls={link.id}
                    aria-current={current === link.id ? 'page' : undefined}
                    aria-label={titleText}
                    title={titleText}
                    className="text-gray-600 hover:text-blue-600 transition-colors bg-transparent cursor-pointer"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.to}
                    to={to}
                    aria-current={isBlog ? 'page' : undefined}
                    aria-label={titleText}
                    title={titleText}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              })}
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
