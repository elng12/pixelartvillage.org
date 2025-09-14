function Footer() {
  try {
    return (
      <footer className="bg-white border-t border-[var(--border-color)] py-8" data-name="footer" data-file="components/Footer.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-[var(--text-secondary)] mb-4 md:mb-0">
              © 2025 PixelArtVillage
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/blog/benefit-of-image-to-pixel-art"
                className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
              >
                Blog
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}