import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded"></div>
          <span className="font-semibold">PixelArtVillage</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Image To Pixel Art</h1>
          <p className="text-gray-600 mb-8">
            Easily transform any image into stunning pixel art
          </p>
          
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-8 hover:border-blue-400 transition-colors">
            <div className="text-center">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-lg text-gray-600 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
              <Link 
                href="/converter" 
                className="inline-block mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start Converting
              </Link>
            </div>
          </div>
        </div>

        {/* Demos Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Demos</h2>
          
          {/* Art Category */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Art</h3>
            <p className="text-gray-600 mb-4">
              Turn ordinary art beautiful pixel art images. Perfect for pixel art
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Original</span>
              </div>
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Pixel Art</span>
              </div>
            </div>
          </div>

          {/* Texture Category */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Texture</h3>
            <p className="text-gray-600 mb-4">
              Turn real world images into texture for pixel art or images. Textures are perfect for pixel art
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Original</span>
              </div>
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Pixel Art</span>
              </div>
            </div>
          </div>

          {/* Setting Category */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Setting</h3>
            <p className="text-gray-600 mb-4">
              Convert any setting to pixel art. Great for pixel art backgrounds and settings. Perfect for pixel art
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Original</span>
              </div>
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Pixel Art</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">What is a Image To Pixel Art Converter?</h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              Image to pixel art converter is a free online tool that allows users to convert regular images into pixel art style. The tool takes an uploaded image and applies pixelation effects to create a retro, 8-bit style artwork that resembles classic video game graphics.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">How to Apply a Palette to Pixel Art Image?</h3>
            <p>
              To apply a palette you can use the palette dropdown menu. Simply click on the dropdown and select from the available palettes. Each palette contains a specific set of colors that will be used to recreate your image. This is very useful for creating pixel art that matches a specific theme or style.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">How to Download Pixel Art Image?</h3>
            <p>
              To download your pixel art image, simply click the download button after you&apos;re satisfied with the result. The image will be saved to your device in PNG format, which preserves the pixel-perfect quality of your artwork.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Suggestions and Feedback</h3>
            <p>
              If you have any suggestions for improving this tool or feedback about your experience, please feel free to contact us. We&apos;re always looking to improve and add new features to make pixel art creation easier and more enjoyable.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 mb-4">© PixelArtVillage.Club</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Discord</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.017 0C8.396 0 7.929.01 7.102.048 6.273.088 5.718.222 5.238.42a7.592 7.592 0 00-2.743 1.785A7.592 7.592 0 00.71 4.948C.512 5.428.378 5.983.338 6.812.298 7.639.288 8.106.288 11.727c0 3.621.01 4.088.05 4.915.04.829.174 1.384.372 1.864.204.476.478.88.923 1.325.444.445.849.719 1.325.923.48.198 1.035.332 1.864.372.827.04 1.294.05 4.915.05 3.621 0 4.088-.01 4.915-.05.829-.04 1.384-.174 1.864-.372a7.592 7.592 0 001.325-.923c.445-.444.719-.849.923-1.325.198-.48.332-1.035.372-1.864.04-.827.05-1.294.05-4.915 0-3.621-.01-4.088-.05-4.915-.04-.829-.174-1.384-.372-1.864a7.592 7.592 0 00-.923-1.325A7.592 7.592 0 0019.052.71c-.48-.198-1.035-.332-1.864-.372C16.361.298 15.894.288 12.273.288h-.256zm-.017 1.837c3.568 0 3.99.014 5.402.053.76.035 1.173.162 1.448.269.364.141.624.31.897.583.273.273.442.533.583.897.107.275.234.688.269 1.448.039 1.412.053 1.834.053 5.402 0 3.568-.014 3.99-.053 5.402-.035.76-.162 1.173-.269 1.448-.141.364-.31.624-.583.897-.273.273-.533.442-.897.583-.275.107-.688.234-1.448.269-1.412.039-1.834.053-5.402.053-3.568 0-3.99-.014-5.402-.053-.76-.035-1.173-.162-1.448-.269a2.41 2.41 0 01-.897-.583 2.41 2.41 0 01-.583-.897c-.107-.275-.234-.688-.269-1.448-.039-1.412-.053-1.834-.053-5.402 0-3.568.014-3.99.053-5.402.035-.76.162-1.173.269-1.448.141-.364.31-.624.583-.897.273-.273.533-.442.897-.583.275-.107.688-.234 1.448-.269 1.412-.039 1.834-.053 5.402-.053z" clipRule="evenodd"/>
                <path fillRule="evenodd" d="M12.017 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12.017 15.838a3.676 3.676 0 110-7.352 3.676 3.676 0 010 7.352z" clipRule="evenodd"/>
                <circle cx="18.406" cy="5.594" r="1.44"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
