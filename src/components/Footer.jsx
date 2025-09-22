import React from 'react';
import { Link } from 'react-router-dom';

function GitHubIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.18-3.37-1.18-.46-1.18-1.12-1.5-1.12-1.5-.92-.63.07-.62.07-.62 1.02.07 1.56 1.05 1.56 1.05.9 1.55 2.36 1.1 2.94.84.09-.65.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.56 9.56 0 0 1 5 0c1.9-1.3 2.74-1.03 2.74-1.03.56 1.37.21 2.39.11 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.69.93.69 1.88v2.79c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

function Footer() {
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
              <p className="text-sm text-gray-400 mt-1">Online pixel art generator • maker • converter</p>
            </div>
            <div>
              <Link to="/#tool" className="inline-block px-4 py-2 rounded-md bg-violet-500 text-gray-900 font-semibold hover:opacity-90 transition" aria-label="Start Pixel Art in Pixel Art Village">
                Start now
              </Link>
            </div>
          </div>

          {/* 链接分栏 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-gray-200 font-semibold mb-3">Tools</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/#tool" className="hover:text-white">Pixel art generator</Link></li>
                <li><Link to="/#tool" className="hover:text-white">Pixel art converter</Link></li>
                <li><Link to="/#showcase" className="hover:text-white">Image to pixel art</Link></li>
                <li><Link to="/#features" className="hover:text-white">Make / create pixel art</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-200 font-semibold mb-3">Formats</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/#showcase" className="hover:text-white">PNG to pixel art</Link></li>
                <li><Link to="/#showcase" className="hover:text-white">JPG to pixel art</Link></li>
                <li><Link to="/#showcase" className="hover:text-white">IMG to pixel art</Link></li>
                <li><Link to="/#features" className="hover:text-white">Pixel grid preview</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-200 font-semibold mb-3">Explore</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/#showcase" className="hover:text-white">Examples</Link></li>
                <li><Link to="/#features" className="hover:text-white">Features</Link></li>
                <li><Link to="/#how-it-works" className="hover:text-white">How it works</Link></li>
                <li><Link to="/#faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-gray-200 font-semibold mb-3">Community</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#tool" className="hover:text-white">Start in Pixel Art Village</a></li>
                <li><a href="#features" className="hover:text-white">Tips & palettes</a></li>
                <li><a href="#faq" className="hover:text-white">Privacy & local processing</a></li>
                <li>
                  <a href="#" className="inline-flex items-center gap-2 hover:text-white" aria-label="GitHub">
                    <GitHubIcon className="w-4 h-4" /> GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 底部信息栏 */}
          <div className="mt-10 pt-6 border-t border-gray-700/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs text-gray-400">&copy; 2025 Pixel Art Village. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <Link to="/terms" className="hover:text-white">Terms</Link>
              <span aria-hidden>•</span>
              <Link to="/privacy" className="hover:text-white">Privacy</Link>
              <span aria-hidden>•</span>
              <Link to="/about" className="hover:text-white">About</Link>
              <span aria-hidden>•</span>
              <Link to="/contact" className="hover:text-white">Contact</Link>
            </div>
          </div>
          <div className="mt-6 text-center flex flex-wrap items-center justify-center gap-6">
            <a href="https://twelve.tools" target="_blank" rel="noopener noreferrer" className="w-1/2 md:w-auto flex justify-center">
              <img
                src="/twelve-tools-badge.svg"
                alt="Featured on Twelve Tools"
                width="200"
                height="54"
                className="inline-block h-[54px] w-auto object-contain"
              />
            </a>
            <a href="https://fazier.com/launches/pixelartvillage.org" target="_blank" rel="noopener noreferrer" className="w-1/2 md:w-auto flex justify-center">
              <img
                src="/fazier-badge.svg"
                alt="Fazier badge"
                width="250"
                className="inline-block h-[54px] w-auto object-contain"
              />
            </a>
            <a href="https://startupfa.me/s/pixel-art-village?utm_source=pixelartvillage.org" target="_blank" rel="noopener noreferrer" className="w-1/2 md:w-auto flex justify-center">
              <img
                src="/startupfame-badge.webp"
                alt="Featured on Startup Fame"
                width="171"
                height="54"
                className="inline-block h-[54px] w-auto object-contain"
              />
            </a>
            <a href="https://turbo0.com/item/pixel-art-village" target="_blank" rel="noopener noreferrer" className="w-1/2 md:w-auto flex justify-center">
              <img
                src="/turbo0-badge.svg"
                alt="Listed on Turbo0"
                className="inline-block h-[54px] w-auto object-contain"
              />
            </a>
            <a href="https://indie.deals?ref=https%3A%2F%2Fpixelartvillage.org%2F" target="_blank" rel="noopener noreferrer" className="w-1/2 md:w-auto flex justify-center">
              <img
                src="/indie-deals-badge.svg"
                alt="Find us on Indie.Deals"
                width="180"
                height="54"
                className="inline-block h-[54px] w-auto object-contain"
              />
            </a>
            <a href="https://backlinkdirs.com" target="_blank" rel="noopener noreferrer" className="w-1/2 md:w-auto flex justify-center">
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
