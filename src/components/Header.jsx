import { useEffect, useRef, useState } from 'react';
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
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsMenuRef = useRef(null);
  const location = useLocation();
  const isBlog = location.pathname.includes('/blog');
  const isConverter = location.pathname.includes('/converter/');
  const isHomePage = !isBlog && !isConverter && (/^\/([a-z]{2}\/?)?$/.test(location.pathname));

  const TOOL_LINKS = [
    { to: '/converter/image-to-pixel-art/', label: t('nav.toolLinks.image') },
    { to: '/converter/photo-to-pixel-art/', label: t('nav.toolLinks.photo') },
    { to: '/converter/png-to-pixel-art/', label: t('nav.toolLinks.png') },
    { to: '/converter/jpg-to-pixel-art/', label: t('nav.toolLinks.jpg') },
    { to: '/converter/gif-to-pixel-art/', label: t('nav.toolLinks.gif') },
    { to: '/converter/8-bit-art-generator/', label: t('nav.toolLinks.eightBit') },
    { to: '/converter/photo-to-sprite-converter/', label: t('nav.toolLinks.sprite') },
  ]

  useEffect(() => {
    const observeIds = ['tool'];
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
    setToolsOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!toolsOpen) return undefined;

    const handlePointerDown = (event) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setToolsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toolsOpen]);

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
            <nav className="hidden md:flex items-center gap-4 lg:gap-6 order-1" aria-label={t('header.mainNav')}>
              <LocalizedLink
                to="/#tool"
                aria-current={isHomePage && current === 'tool' ? 'page' : undefined}
                className="text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {t('nav.home')}
              </LocalizedLink>
              <div className="relative" ref={toolsMenuRef}>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={toolsOpen ? 'true' : 'false'}
                  aria-controls="header-tools-menu"
                  onClick={() => setToolsOpen((open) => !open)}
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-gray-50 hover:text-blue-600 ${isConverter ? 'text-blue-700' : 'text-gray-600'}`}
                >
                  {t('nav.tools')}
                  <svg
                    viewBox="0 0 20 20"
                    width="16"
                    height="16"
                    aria-hidden="true"
                    className={`transition-transform ${toolsOpen ? 'rotate-180' : ''}`}
                  >
                    <path
                      d="M5 7.5l5 5 5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {toolsOpen ? (
                  <div
                    id="header-tools-menu"
                    role="menu"
                    className="absolute left-0 top-full z-50 mt-3 w-72 rounded-lg border border-gray-200 bg-white p-2 shadow-xl"
                  >
                    {TOOL_LINKS.map((link) => (
                      <LocalizedLink
                        key={link.to}
                        to={link.to}
                        role="menuitem"
                        onClick={() => setToolsOpen(false)}
                        className="block rounded-md px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        {link.label}
                      </LocalizedLink>
                    ))}
                  </div>
                ) : null}
              </div>
              <LocalizedLink
                to="/blog/"
                aria-current={isBlog ? 'page' : undefined}
                className="text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {t('nav.blog')}
              </LocalizedLink>
              <a
                href={FEEDBACK_FORM_URL}
                target="_blank"
                rel="noreferrer"
                data-testid="header-feedback-link"
                aria-label={t('nav.feedback')}
                title={t('nav.feedback')}
                className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-100 whitespace-nowrap"
              >
                {t('nav.feedback')}
              </a>
            </nav>
            <div className="flex items-center gap-2 order-2">
              <LanguageSwitcherBalanced />
            </div>
            <div className="hidden lg:flex items-center order-3">
              <Avatar size={40} userId="guest" title={t('header.userAvatarTitle')} />
            </div>
          </div>
        </div>
        {mobileOpen ? (
          <div className="md:hidden border-t border-gray-200 pb-4 pt-3">
            <nav id="mobile-nav" aria-label={t('header.mainNav')} className="grid gap-1">
              <LocalizedLink
                to="/#tool"
                aria-current={isHomePage && current === 'tool' ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50"
              >
                {t('nav.home')}
              </LocalizedLink>
              <div className="border-t border-gray-100 pt-2">
                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-normal text-gray-500">
                  {t('nav.tools')}
                </p>
                <div className="grid gap-1">
                  {TOOL_LINKS.map((link) => (
                    <LocalizedLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-md px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {link.label}
                    </LocalizedLink>
                  ))}
                </div>
              </div>
              <LocalizedLink
                to="/blog/"
                aria-current={isBlog ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-50"
              >
                {t('nav.blog')}
              </LocalizedLink>
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
