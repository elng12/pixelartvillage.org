import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Avatar from './Avatar';
import { useTranslation } from 'react-i18next';
import LocalizedLink from '@/components/LocalizedLink';

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

  const location = useLocation();
  const isBlog = location.pathname.includes('/blog');

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-200" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="text-2xl font-bold text-gray-800">
            <LocalizedLink to="/" aria-label={t('site.homeLinkAria')}>
              {t('site.name')}
            </LocalizedLink>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-8 order-1" aria-label={t('header.mainNav')}>
              {NAV_LINKS.map((link) => {
                const to = link.id ? `/#${link.id}` : `/${link.to}/`;
                return (
                  <LocalizedLink
                    key={link.id || link.to}
                    to={to}
                    aria-current={link.id ? (current===link.id?'page':undefined) : (isBlog ? 'page' : undefined)}
                    className="text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap"
                  >
                    {link.label}
                  </LocalizedLink>
                )
              })}
            </nav>
            {rightSlot ? <div className="flex items-center gap-2 order-2">{rightSlot}</div> : null}
            <div className="flex items-center order-3">
              <Avatar size={40} userId="guest" title={t('header.userAvatarTitle')} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
