function ControlPanel({ image, show, onClose }) {
  try {
    const [pixelSize, setPixelSize] = React.useState(8);
    const [brightness, setBrightness] = React.useState(0);
    const [contrast, setContrast] = React.useState(0);
    const [saturation, setSaturation] = React.useState(0);
    const [selectedPalette, setSelectedPalette] = React.useState('none');
    const [processedImage, setProcessedImage] = React.useState(image);

    const palettes = [
      'Pico-8',
      'Lost Century', 
      'Sunset 8',
      'Twilight 5',
      'Hollow'
    ];

    const resetSliders = () => {
      setPixelSize(8);
      setBrightness(0);
      setContrast(0);
      setSaturation(0);
    };

    const downloadImage = (size) => {
      const link = document.createElement('a');
      link.download = `pixel-art-${size}.png`;
      link.href = processedImage;
      link.click();
    };

    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" data-name="control-panel" data-file="components/ControlPanel.js">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-screen overflow-y-auto">
          <div className="flex">
            <div className="flex-1 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Edit Pixel Art</h2>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <div className="icon-x text-xl"></div>
                </button>
              </div>
              
              <div className="text-center mb-6">
                <img 
                  src={processedImage}
                  alt="Preview"
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '400px' }}
                />
                <div className="mt-4 flex justify-center space-x-4">
                  <button 
                    onClick={() => downloadImage('small')}
                    className="btn-primary"
                  >
                    Download Small
                  </button>
                  <button 
                    onClick={() => downloadImage('large')}
                    className="btn-secondary"
                  >
                    Download Large
                  </button>
                </div>
              </div>
            </div>
            
            <div className="w-80 bg-gray-50 p-6 border-l">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">General</h3>
                  <button 
                    onClick={resetSliders}
                    className="btn-secondary w-full mb-4"
                  >
                    Reset Sliders
                  </button>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Pixel Size</label>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={pixelSize}
                        onChange={(e) => setPixelSize(e.target.value)}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600">{pixelSize}</span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Brightness</label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={brightness}
                        onChange={(e) => setBrightness(e.target.value)}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600">{brightness}</span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Contrast</label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={contrast}
                        onChange={(e) => setContrast(e.target.value)}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600">{contrast}</span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Saturation</label>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={saturation}
                        onChange={(e) => setSaturation(e.target.value)}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-600">{saturation}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Palette</h3>
                  <select 
                    value={selectedPalette}
                    onChange={(e) => setSelectedPalette(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-4"
                  >
                    <option value="none">No Palette</option>
                    {palettes.map(palette => (
                      <option key={palette} value={palette}>{palette}</option>
                    ))}
                  </select>
                  
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Import Palette (Lospec.com)"
                      className="w-full p-2 border rounded-lg mb-2"
                    />
                    <button className="btn-secondary w-full">Import</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ControlPanel component error:', error);
    return null;
  }
}