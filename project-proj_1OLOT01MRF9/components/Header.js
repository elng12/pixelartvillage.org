function Header() {
  try {
    return (
      <header className="bg-white border-b border-[var(--border-color)]" data-name="header" data-file="components/Header.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[var(--primary-color)] rounded flex items-center justify-center">
                    <div className="icon-image text-lg text-white"></div>
                  </div>
                  <span className="text-xl font-semibold text-[var(--text-primary)]">Pixel Art Village</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <a 
                href="/examples.html"
                className="btn-secondary"
              >
                Examples
              </a>
              <a 
                href="https://discord.gg/v2zgvbcnFs" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Feedback
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}