import { useTranslation } from 'react-i18next';
import LocalizedLink from '@/components/LocalizedLink';
import aiDirsBadge from '@/assets/badges/ai-dirs-badge.svg';
import fazierBadge from '@/assets/badges/fazier-badge.svg';
import indieDealsBadge from '@/assets/badges/indie-deals-badge.svg';
import startupFameBadge from '@/assets/badges/startupfame-badge.webp';
import turbo0Badge from '@/assets/badges/turbo0-badge.svg';
import twelveToolsBadge from '@/assets/badges/twelve-tools-badge.svg';

function GitHubIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.18-3.37-1.18-.46-1.18-1.12-1.5-1.12-1.5-.92-.63.07-.62.07-.62 1.02.07 1.56 1.05 1.56 1.05.9 1.55 2.36 1.1 2.94.84.09-.65.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.56 9.56 0 0 1 5 0c1.9-1.3 2.74-1.03 2.74-1.03.56 1.37.21 2.39.11 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.69.93.69 1.88v2.79c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-gray-900 text-gray-300 footer-grid-bg">
      <div className="relative">
        {/* 像素角标 */}
        <div className="hidden md:block absolute top-2 left-2 w-2 h-2 bg-violet-400/70" aria-hidden />
        <div className="hidden md:block absolute top-2 right-2 w-2 h-2 bg-blue-500/70" aria-hidden />
        <div className="hidden md:block absolute bottom-2 left-2 w-2 h-2 bg-blue-500/70" aria-hidden />
        <div className="hidden md:block absolute bottom-2 right-2 w-2 h-2 bg-violet-400/70" aria-hidden />

        <div className="container mx-auto px-4 py-12 relative">
          {/* 顶部品牌与行动 */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <p className="font-extrabold text-2xl text-white">{t('site.name')}</p>
              <p className="text-sm text-gray-400 mt-1">{t('site.tagline')}</p>
            </div>
            <div>
              <LocalizedLink
                to="/#tool"
                className="inline-block px-4 py-2 rounded-md bg-violet-700 text-white font-semibold hover:bg-violet-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {t('cta.start')}
              </LocalizedLink>
            </div>
          </div>

          {/* 链接分栏 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-gray-200 font-semibold mb-3">{t('footer.tools')}</p>
              <ul className="space-y-2 text-sm">
                <li><LocalizedLink to="/converter/image-to-pixel-art/" className="hover:text-white">{t('footer.links.generator')}</LocalizedLink></li>
                <li><LocalizedLink to="/converter/photo-to-pixel-art/" className="hover:text-white">{t('footer.links.converter')}</LocalizedLink></li>
                <li><LocalizedLink to="/converter/pixelate-image-online/" className="hover:text-white">{t('footer.links.pixelate')}</LocalizedLink></li>
                <li><LocalizedLink to="/converter/8-bit-art-generator/" className="hover:text-white">{t('footer.links.8bit')}</LocalizedLink></li>
                <li><LocalizedLink to="/converter/retro-game-graphics-maker/" className="hover:text-white">{t('footer.links.retroMaker')}</LocalizedLink></li>
                <li><LocalizedLink to="/converter/photo-to-sprite-converter/" className="hover:text-white">{t('footer.links.photo2sprite')}</LocalizedLink></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-200 font-semibold mb-3">{t('footer.formats')}</p>
              <ul className="space-y-2 text-sm">
                <li><LocalizedLink to="/converter/png-to-pixel-art/" className="hover:text-white">{t('footer.links.png2pixel')}</LocalizedLink></li>
                <li><LocalizedLink to="/converter/jpg-to-pixel-art/" className="hover:text-white">{t('footer.links.jpg2pixel')}</LocalizedLink></li>
                <li><LocalizedLink to="/converter/gif-to-pixel-art/" className="hover:text-white">{t('footer.links.gif2pixel')}</LocalizedLink></li>
                <li><LocalizedLink to="/converter/webp-to-pixel-art/" className="hover:text-white">{t('footer.links.webp2pixel')}</LocalizedLink></li>
                <li><LocalizedLink to="/converter/bmp-to-pixel-art/" className="hover:text-white">{t('footer.links.bmp2pixel')}</LocalizedLink></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-200 font-semibold mb-3">{t('footer.explore')}</p>
              <ul className="space-y-2 text-sm">
                <li><LocalizedLink to="/#tool" className="hover:text-white">{t('nav.home')}</LocalizedLink></li>
                <li><LocalizedLink to="/#showcase" className="hover:text-white">{t('nav.examples')}</LocalizedLink></li>
                <li><LocalizedLink to="/#features" className="hover:text-white">{t('nav.features')}</LocalizedLink></li>
                <li><LocalizedLink to="/#how-it-works" className="hover:text-white">{t('nav.how')}</LocalizedLink></li>
                <li><LocalizedLink to="/#faq" className="hover:text-white">{t('nav.faq')}</LocalizedLink></li>
                <li><LocalizedLink to="/blog/" className="hover:text-white">{t('nav.blog')}</LocalizedLink></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-200 font-semibold mb-3">{t('footer.community')}</p>
              <ul className="space-y-2 text-sm">
                <li><LocalizedLink to="/#tool" className="hover:text-white">{t('footer.links.start')}</LocalizedLink></li>
                <li><LocalizedLink to="/#features" className="hover:text-white">{t('footer.links.tips')}</LocalizedLink></li>
                <li><LocalizedLink to="/#faq" className="hover:text-white">{t('footer.links.privacyLocal')}</LocalizedLink></li>
                <li>
                  <a href="https://github.com/pixelartvillage/pixelartvillage" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white" aria-label={t('footer.github')}>
                    <GitHubIcon className="w-4 h-4" /> {t('footer.github')}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 底部信息栏 */}
            <div className="mt-10 pt-6 border-t border-gray-700/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-xs text-gray-400">{t('footer.copy', { year: new Date().getFullYear() })}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <LocalizedLink to="/terms/" className="hover:text-white">{t('footer.terms')}</LocalizedLink>
                <span aria-hidden>•</span>
                <LocalizedLink to="/privacy/" className="hover:text-white">{t('footer.privacy')}</LocalizedLink>
                <span aria-hidden>•</span>
                <LocalizedLink to="/about/" className="hover:text-white">{t('nav.about')}</LocalizedLink>
                <span aria-hidden>•</span>
                <LocalizedLink to="/contact/" className="hover:text-white">{t('nav.contact')}</LocalizedLink>
              </div>
            </div>
            <div className="mt-6 text-center flex flex-wrap items-center justify-center gap-6">
              <a href="https://twelve.tools" target="_blank" rel="noopener noreferrer" className="w-1/2 md:w-auto flex justify-center">
                <img
                  src={twelveToolsBadge}
                  alt={t('footer.badges.twelveTools')}
                  width="200"
                  height="54"
                  className="inline-block h-[54px] w-auto object-contain"
                />
              </a>
              <a href="https://fazier.com/launches/pixelartvillage.org" target="_blank" rel="noopener noreferrer" className="w-1/2 md:w-auto flex justify-center">
                <img
                  src={fazierBadge}
                  alt={t('footer.badges.fazier')}
                  width="250"
                  height="54"
                  className="inline-block h-[54px] w-auto object-contain"
                />
              </a>
              <a href="https://startupfa.me/s/pixel-art-village?utm_source=pixelartvillage.org" target="_blank" rel="noopener noreferrer" className="w-1/2 md:w-auto flex justify-center">
                <img
                  src={startupFameBadge}
                  alt={t('footer.badges.startupFame')}
                  width="171"
                  height="54"
                  className="inline-block h-[54px] w-auto object-contain"
                />
              </a>
              <a href="https://turbo0.com/item/pixel-art-village" target="_blank" rel="noopener noreferrer" className="w-1/2 md:w-auto flex justify-center">
                <img
                  src={turbo0Badge}
                  alt={t('footer.badges.turbo0')}
                  width="180"
                  height="54"
                  className="inline-block h-[54px] w-auto object-contain"
                />
              </a>
              <a href="https://indie.deals?ref=https%3A%2F%2Fpixelartvillage.org%2F" target="_blank" rel="noopener noreferrer" className="w-1/2 md:w-auto flex justify-center">
                <img
                  src={indieDealsBadge}
                  alt={t('footer.badges.indieDeals')}
                  width="180"
                  height="54"
                  className="inline-block h-[54px] w-auto object-contain"
                />
              </a>
              <a href="https://backlinkdirs.com" target="_blank" rel="noopener noreferrer" className="w-1/2 md:w-auto flex justify-center">
                <img
                  src={aiDirsBadge}
                  alt={t('footer.badges.aiDirs')}
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
