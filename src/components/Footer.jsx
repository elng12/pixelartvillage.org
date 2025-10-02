import React from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function GitHubIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.18-3.37-1.18-.46-1.18-1.12-1.5-1.12-1.5-.92-.63.07-.62.07-.62 1.02.07 1.56 1.05 1.56 1.05.9 1.55 2.36 1.1 2.94.84.09-.65.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.56 9.56 0 0 1 5 0c1.9-1.3 2.74-1.03 2.74-1.03.56 1.37.21 2.39.11 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.69.93.69 1.88v2.79c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

function Footer() {
  const { t } = useTranslation()
  const params = useParams()
  const currentLang = params.lang || 'en'
  const prefix = currentLang === 'en' ? '' : `/${currentLang}`
  const location = useLocation()
  const navigate = useNavigate()
  const homePath = `${prefix}/`
  const onHome = location.pathname === homePath

  function scrollToSection(id) {
    if (onHome) {
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    } else {
      navigate(`${prefix}/#${id}`)
    }
  }
  const NAV_TITLES = {
    tool: t('navTitle.hero'),
    showcase: t('navTitle.examples'),
    features: t('navTitle.features'),
    'how-it-works': t('navTitle.how'),
    faq: t('navTitle.faq'),
    blog: t('navTitle.blog'),
  }
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="relative">
        {/* 淡像素网格装饰 */}
        <div className="hidden md:block absolute inset-0 pointer-events-none pixel-grid-bg" aria-hidden />
        {/* 像素角标 */}
        <div className="hidden md:block absolute top-2 left-2 w-2 h-2 bg-violet-400/70" aria-hidden />
        <div className="hidden md:block absolute top-2 right-2 w-2 h-2 bg-blue-500/70" aria-hidden />
        <div className="hidden md:block absolute bottom-2 left-2 w-2 h-2 bg-blue-500/70" aria-hidden />
        <div className="hidden md:block absolute bottom-2 right-2 w-2 h-2 bg-violet-400/70" aria-hidden />

        <div className="container mx-auto px-4 py-12 relative">
          {/* 顶部品牌与行动 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <p className="font-extrabold text-2xl text-white">Pixel Art Village</p>
              <p className="text-sm text-gray-400 mt-1">{t('site.tagline')}</p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => scrollToSection('tool')}
                aria-controls="tool"
                className="inline-block px-4 py-2 rounded-md bg-violet-700 text-white font-semibold hover:bg-violet-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                title={t('footer.links.start')}
              >
                {t('cta.start')}
              </button>
            </div>
          </div>

          {/* 链接分栏 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-gray-200 font-semibold mb-3">{t('footer.tools')}</p>
              <ul className="space-y-2 text-sm">
                <li><button type="button" onClick={() => scrollToSection('tool')} aria-controls="tool" title={t('footer.links.generator')} className="hover:text-white text-left">{t('footer.links.generator')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('tool')} aria-controls="tool" title={t('footer.links.converter')} className="hover:text-white text-left">{t('footer.links.converter')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('showcase')} aria-controls="showcase" title={t('footer.links.imageToPixel')} className="hover:text-white text-left">{t('footer.links.imageToPixel')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('features')} aria-controls="features" title={t('footer.links.makePixelArt')} className="hover:text-white text-left">{t('footer.links.makePixelArt')}</button></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-200 font-semibold mb-3">{t('footer.formats')}</p>
              <ul className="space-y-2 text-sm">
                <li><button type="button" onClick={() => scrollToSection('showcase')} aria-controls="showcase" title={t('footer.links.png2pixel')} className="hover:text-white text-left">{t('footer.links.png2pixel')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('showcase')} aria-controls="showcase" title={t('footer.links.jpg2pixel')} className="hover:text-white text-left">{t('footer.links.jpg2pixel')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('showcase')} aria-controls="showcase" title={t('footer.links.img2pixel')} className="hover:text-white text-left">{t('footer.links.img2pixel')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('features')} aria-controls="features" title={t('footer.links.gridPreview')} className="hover:text-white text-left">{t('footer.links.gridPreview')}</button></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-200 font-semibold mb-3">{t('footer.explore')}</p>
              <ul className="space-y-2 text-sm">
                <li><button type="button" onClick={() => scrollToSection('tool')} aria-controls="tool" title={NAV_TITLES.tool} aria-label={NAV_TITLES.tool} className="hover:text-white text-left">{t('nav.home')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('showcase')} aria-controls="showcase" title={NAV_TITLES.showcase} aria-label={NAV_TITLES.showcase} className="hover:text-white text-left">{t('nav.examples')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('features')} aria-controls="features" title={NAV_TITLES.features} aria-label={NAV_TITLES.features} className="hover:text-white text-left">{t('nav.features')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('how-it-works')} aria-controls="how-it-works" title={NAV_TITLES['how-it-works']} aria-label={NAV_TITLES['how-it-works']} className="hover:text-white text-left">{t('nav.how')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('faq')} aria-controls="faq" title={NAV_TITLES.faq} aria-label={NAV_TITLES.faq} className="hover:text-white text-left">{t('nav.faq')}</button></li>
                <li><Link to={`${prefix}/blog`} title={NAV_TITLES.blog} aria-label={NAV_TITLES.blog} className="hover:text-white">{t('nav.blog')}</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-200 font-semibold mb-3">{t('footer.community')}</p>
              <ul className="space-y-2 text-sm">
                <li><button type="button" onClick={() => scrollToSection('tool')} aria-controls="tool" title={t('footer.links.start')} className="hover:text-white text-left">{t('footer.links.start')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('features')} aria-controls="features" title={t('footer.links.tips')} className="hover:text-white text-left">{t('footer.links.tips')}</button></li>
                <li><button type="button" onClick={() => scrollToSection('faq')} aria-controls="faq" title={t('footer.links.privacyLocal')} className="hover:text-white text-left">{t('footer.links.privacyLocal')}</button></li>
                <li>
                  <button type="button" className="inline-flex items-center gap-2 hover:text-white" aria-label={t('footer.github')} title={t('footer.github')}>
                    <GitHubIcon className="w-4 h-4" /> {t('footer.github')}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* 底部信息栏 */}
          <div className="mt-10 pt-6 border-t border-gray-700/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs text-gray-400">{t('footer.copy', { year: new Date().getFullYear() })}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <Link to={`${prefix}/terms/`} className="hover:text-white">{t('footer.terms')}</Link>
              <span aria-hidden>•</span>
              <Link to={`${prefix}/privacy/`} className="hover:text-white">{t('footer.privacy')}</Link>
              <span aria-hidden>•</span>
              <Link to={`${prefix}/about/`} className="hover:text-white">{t('nav.about')}</Link>
              <span aria-hidden>•</span>
              <Link to={`${prefix}/contact/`} className="hover:text-white">{t('nav.contact')}</Link>
            </div>
          </div>
          <div className="mt-6 text-center flex flex-wrap items-center justify-center gap-6">
            <a href="https://twelve.tools" target="_blank" rel="noopener noreferrer nofollow" title="Featured on Twelve Tools" className="w-1/2 md:w-auto flex justify-center">
              <img
                src="/twelve-tools-badge.svg"
                alt="Featured on Twelve Tools"
                width="200"
                height="54"
                className="inline-block h-[54px] w-auto object-contain"
              />
            </a>
            <a href="https://fazier.com/launches/pixelartvillage.org" target="_blank" rel="noopener noreferrer nofollow" title="Fazier launch page" className="w-1/2 md:w-auto flex justify-center">
              <img
                src="/fazier-badge.svg"
                alt="Fazier badge"
                width="250"
                height="54"
                className="inline-block h-[54px] w-auto object-contain"
              />
            </a>
            <a href="https://startupfa.me/s/pixel-art-village?utm_source=pixelartvillage.org" target="_blank" rel="noopener noreferrer nofollow" title="Featured on Startup Fame" className="w-1/2 md:w-auto flex justify-center">
              <img
                src="/startupfame-badge.webp"
                alt="Featured on Startup Fame"
                width="171"
                height="54"
                className="inline-block h-[54px] w-auto object-contain"
              />
            </a>
            <a href="https://turbo0.com/item/pixel-art-village" target="_blank" rel="noopener noreferrer nofollow" title="Listed on Turbo0" className="w-1/2 md:w-auto flex justify-center">
              <img
                src="/turbo0-badge.svg"
                alt="Listed on Turbo0"
                width="180"
                height="54"
                className="inline-block h-[54px] w-auto object-contain"
              />
            </a>
            <a href="https://indie.deals?ref=https%3A%2F%2Fpixelartvillage.org%2F" target="_blank" rel="noopener noreferrer nofollow" title="Find us on Indie.Deals" className="w-1/2 md:w-auto flex justify-center">
              <img
                src="/indie-deals-badge.svg"
                alt="Find us on Indie.Deals"
                width="180"
                height="54"
                className="inline-block h-[54px] w-auto object-contain"
              />
            </a>
            <a href="https://backlinkdirs.com" target="_blank" rel="noopener noreferrer nofollow" title="Listed on AI Dirs" className="w-1/2 md:w-auto flex justify-center">
              <img
                src="/ai-dirs-badge.svg"
                alt="Listed on AI Dirs"
                width="180"
                height="54"
                className="inline-block h-[54px] w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
