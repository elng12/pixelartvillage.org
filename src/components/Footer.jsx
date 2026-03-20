import { useTranslation } from 'react-i18next';
import LocalizedLink from '@/components/LocalizedLink';

const aiDirsBadge = '/badges/ai-dirs-badge.svg';
const acidToolsBadge = '/badges/acidtools-badge.png';
const deepLaunchBadge = '/badges/deeplaunch-badge-light.svg';
const fazierBadge = '/badges/fazier-badge.svg';
const findlyToolsBadge = '/badges/findly-tools-badge-light.svg';
const indieDealsBadge = '/badges/indie-deals-badge.svg';
const justSimpleToolsBadge = '/badges/justsimpletools-badge.svg';
const microSaasExamplesBadge = '/badges/microsaasexamples-badge.svg';
const mossAiBadge = '/badges/mossai-badge.svg';
const productHuntBadge = '/badges/product-hunt-badge.svg';
const projectHuntBadge = '/badges/projecthunt-badge.svg';
const saasFameBadge = '/badges/saasfame-badge-light.svg';
const saasToolsDirBadge = '/badges/saastoolsdir-badge.png';
const submitAiToolsBadge = '/badges/submitaitools-badge.png';
const submitoBadge = '/badges/submito-badge-light.svg';
const startupFameBadge = '/badges/startupfame-badge.webp';
const toolFameBadge = '/badges/toolfame-badge-light.svg';
const turbo0Badge = '/badges/turbo0-badge.svg';
const twelveToolsBadge = '/badges/twelve-tools-badge.svg';
const yoDirectoryBadge = '/badges/yodirectory-badge.png';
const buildYear = typeof __BUILD_YEAR__ !== 'undefined' ? __BUILD_YEAR__ : new Date().getFullYear();

const footerBadges = [
  {
    key: 'twelveTools',
    href: 'https://twelve.tools',
    src: twelveToolsBadge,
    width: 200,
    height: 54,
  },
  {
    key: 'fazier',
    href: 'https://fazier.com/launches/pixelartvillage.org',
    src: fazierBadge,
    width: 250,
    height: 54,
  },
  {
    key: 'acidTools',
    href: 'https://acidtools.com',
    src: acidToolsBadge,
    width: 175,
    height: 54,
  },
  {
    key: 'startupFame',
    href: 'https://startupfa.me/s/pixel-art-village?utm_source=pixelartvillage.org',
    src: startupFameBadge,
    width: 171,
    height: 54,
  },
  {
    key: 'projectHunt',
    href: 'https://projecthunt.me',
    src: projectHuntBadge,
    width: 180,
    height: 48,
  },
  {
    key: 'toolFame',
    href: 'https://toolfame.com/item/pixel-art-village',
    src: toolFameBadge,
    width: 220,
    height: 54,
  },
  {
    key: 'submito',
    href: 'https://submito.net',
    src: submitoBadge,
    width: 210,
    height: 60,
  },
  {
    key: 'saasFame',
    href: 'https://saasfame.com/item/pixel-art-village',
    src: saasFameBadge,
    width: 220,
    height: 54,
  },
  {
    key: 'saasToolsDir',
    href: 'https://saastoolsdir.com',
    src: saasToolsDirBadge,
    width: 213,
    height: 54,
  },
  {
    key: 'deepLaunch',
    href: 'https://deeplaunch.io',
    src: deepLaunchBadge,
    width: 200,
    height: 54,
  },
  {
    key: 'submitAiTools',
    href: 'https://submitaitools.org',
    src: submitAiToolsBadge,
    width: 200,
    height: 60,
  },
  {
    key: 'findlyTools',
    href: 'https://findly.tools/pixel-art-village?utm_source=pixel-art-village',
    src: findlyToolsBadge,
    width: 175,
    height: 55,
  },
  {
    key: 'yoDirectory',
    href: 'https://yo.directory/',
    src: yoDirectoryBadge,
    width: 150,
    height: 54,
  },
  {
    key: 'microSaasExamples',
    href: 'https://www.microsaasexamples.com/',
    src: microSaasExamplesBadge,
    width: 220,
    height: 54,
  },
  {
    key: 'mossAi',
    href: 'https://mossai.org',
    src: mossAiBadge,
    width: 200,
    height: 54,
  },
  {
    key: 'productHunt',
    href: 'https://www.producthunt.com/products/pixel-art-village?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-pixel-art-village',
    src: productHuntBadge,
    width: 250,
    height: 54,
  },
  {
    key: 'justSimpleTools',
    href: 'https://www.justsimple.tools',
    src: justSimpleToolsBadge,
    width: 150,
    height: 44,
  },
  {
    key: 'turbo0',
    href: 'https://turbo0.com/item/pixel-art-village',
    src: turbo0Badge,
    width: 180,
    height: 54,
  },
  {
    key: 'indieDeals',
    href: 'https://indie.deals?ref=https%3A%2F%2Fpixelartvillage.org%2F',
    src: indieDealsBadge,
    width: 180,
    height: 54,
  },
  {
    key: 'aiDirs',
    href: 'https://backlinkdirs.com',
    src: aiDirsBadge,
    width: 180,
    height: 54,
  },
];

const footerBadgeLookup = Object.fromEntries(footerBadges.map((badge) => [badge.key, badge]));
const footerBadgeGroups = [
  {
    key: 'featured',
    badges: [
      'productHunt',
      'projectHunt',
      'deepLaunch',
      'toolFame',
      'saasFame',
      'twelveTools',
      'fazier',
      'startupFame',
      'microSaasExamples',
      'mossAi',
    ].map((key) => footerBadgeLookup[key]),
  },
  {
    key: 'directory',
    badges: [
      'acidTools',
      'saasToolsDir',
      'submitAiTools',
      'findlyTools',
      'submito',
      'justSimpleTools',
      'yoDirectory',
      'turbo0',
      'indieDeals',
      'aiDirs',
    ].map((key) => footerBadgeLookup[key]),
  },
];

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

          <section aria-label={t('footer.mediaFeaturedIn')} className="mt-10 border-t border-gray-700/60 pt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-400">
              {t('footer.mediaFeaturedIn')}
            </p>
            <p className="mt-2 text-[11px] text-gray-500 sm:hidden">
              {t('footer.badgeSwipeHint')}
            </p>
            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(0,0.92fr)]">
              {footerBadgeGroups.map((group) => (
                <div key={group.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                      {t(`footer.badgeGroups.${group.key}`)}
                    </p>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                      {group.badges.length}
                    </span>
                  </div>
                  <div className="relative">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-6 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/92 to-transparent sm:block xl:hidden"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-6 bg-gradient-to-l from-[#0f172a] via-[#0f172a]/92 to-transparent sm:block xl:hidden"
                    />
                    <div className="footer-badge-scroller -mx-1 overflow-x-auto px-1 pb-3 xl:mx-0 xl:overflow-visible xl:px-0 xl:pb-0">
                      <ul className="flex snap-x snap-mandatory gap-3 xl:flex-wrap xl:gap-3.5">
                        {group.badges.map((badge) => (
                          <li key={badge.key} className="shrink-0 snap-start">
                            <a
                              href={badge.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={t(`footer.badges.${badge.key}`)}
                              className="group flex min-h-[62px] items-center justify-center rounded-xl px-1.5 py-2 transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.04]"
                            >
                              <img
                                src={badge.src}
                                alt={t(`footer.badges.${badge.key}`)}
                                width={badge.width}
                                height={badge.height}
                                loading="lazy"
                                fetchPriority="low"
                                decoding="async"
                                className="h-auto w-auto max-h-[54px] max-w-none object-contain opacity-95 transition duration-200 group-hover:opacity-100"
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 底部信息栏 */}
          <div className="mt-10 pt-6 border-t border-gray-700/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs text-gray-400">{t('footer.copy', { year: buildYear })}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <LocalizedLink to="/terms/" className="hover:text-white">{t('footer.terms')}</LocalizedLink>
              <span aria-hidden>•</span>
              <LocalizedLink to="/privacy/" className="hover:text-white">{t('footer.privacy')}</LocalizedLink>
              <span aria-hidden>•</span>
              <LocalizedLink to="/about/" className="hover:text-white">{t('nav.about')}</LocalizedLink>
              <span aria-hidden>•</span>
              <LocalizedLink to="/contact/" className="hover:text-white">{t('nav.contact')}</LocalizedLink>
              <span aria-hidden>•</span>
              <a
                href="https://pinpointanswertoday.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Pinpoint Answer Today
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
