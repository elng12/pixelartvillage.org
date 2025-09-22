import React, { useEffect, useState, useMemo } from 'react';
import Avatar from './Avatar';

function Header() {
  const [current, setCurrent] = useState('tool');
  const NAV_LINKS = useMemo(() => ([
    { id: 'showcase', label: 'Examples' },
    { id: 'features', label: 'Features' },
    { id: 'faq', label: 'FAQ' },
  ]), []);

  const scrollTo = (e, selector) => {
    e.preventDefault();
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const observeIds = ['tool', ...NAV_LINKS.map((l) => l.id)];
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

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="text-2xl font-bold text-gray-800">
            <a href="#tool" onClick={(e) => scrollTo(e, '#tool')} aria-label="Pixel Art Village home">
              Pixel Art Village
            </a>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => scrollTo(e, `#${link.id}`)}
                  aria-current={current===link.id?'page':undefined}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="hidden md:block">
              <Avatar size={40} userId="guest" title="User avatar" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
