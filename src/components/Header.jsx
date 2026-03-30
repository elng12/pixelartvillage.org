import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Avatar from './Avatar';
import { useTranslation } from 'react-i18next';
import LocalizedLink from '@/components/LocalizedLink';
import LanguageSwitcherBalanced from './LanguageSwitcherBalanced';
import { FEEDBACK_FORM_URL } from '@/utils/site-links';

function Header() {
  const { t } = useTranslation()
  const [current, setCurrent] = useState('tool');
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isBlog = location.pathname.includes('/blog');

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

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-200" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-3">
          <div className="min-w-0 flex-1 text-xl font-bold text-gray-800 sm:text-2xl">
            <LocalizedLink to="/" aria-label={t('site.homeLinkAria')} className="block truncate">
              {t('site.name')}
            </LocalizedLink>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              className="inline-flex md:hidden items-center justify-center rounded-md border border-gray-200 bg-white/90 p-2 text-gray-700 shadow-sm hover:bg-white"
              aria-label={t('header.mainNav')}
              aria-expanded={mobileOpen ? 'true' : 'false'}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
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
            <div className="flex items-center gap-2 order-2">
              <LanguageSwitcherBalanced />
            </div>
            <a
              href={FEEDBACK_FORM_URL}
              target="_blank"
              rel="noreferrer"
              data-testid="header-feedback-link"
              aria-label={t('nav.feedback')}
              title={t('nav.feedback')}
              className="hidden md:inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-100"
            >
              {t('nav.feedback')}
            </a>
            <div className="hidden lg:flex items-center order-3">
              <Avatar size={40} userId="guest" title={t('header.userAvatarTitle')} />
            </div>
          </div>
        </div>
        {mobileOpen ? (
          <div className="md:hidden border-t border-gray-200 pb-4 pt-3">
            <nav id="mobile-nav" aria-label={t('header.mainNav')} className="grid gap-1">
              {NAV_LINKS.map((link) => {
                const to = link.id ? `/#${link.id}` : `/${link.to}/`;
                const ariaCurrent = link.id
                  ? (current===link.id?'page':undefined)
                  : (isBlog ? 'page' : undefined);
                return (
                  <LocalizedLink
                    key={link.id || link.to}
                    to={to}
                    aria-current={ariaCurrent}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    {link.label}
                  </LocalizedLink>
                )
              })}
              <a
                href={FEEDBACK_FORM_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50"
              >
                {t('nav.feedback')}
              </a>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
