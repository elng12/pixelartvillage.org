# Pixel Art Converter - Image to Pixel Art

A free online tool that allows users to easily convert any image or picture into stunning pixel art. This is a 1:1 replica of the pixelartvillage.com website.

## Features

- **Image Upload**: Support for PNG, JPG, and SVG files via drag-and-drop or file selection
- **Example Images**: Quick access to demo images (Sunrise, Cobblestone, Mt. Fuji)  
- **Pixel Art Controls**: Adjustable pixel size, brightness, contrast, and saturation
- **Color Palettes**: Built-in palettes (Pico-8, Lost Century, Sunset 8, Twilight 5, Hollow) and import from Lospec.com
- **Download Options**: Small (pixel ratio) and Large (original size) download formats
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

- `index.html` - Main page with all components
- `app.js` - Main React application with error boundary
- `components/` - React components for different sections
  - `Header.js` - Navigation header with logo and feedback link
  - `HeroSection.js` - Main title and demo image
  - `UploadSection.js` - File upload and example selection
  - `DemoSection.js` - Three demo cards showing use cases
  - `InfoSection.js` - FAQ and information sections
  - `Footer.js` - Copyright and links
  - `ControlPanel.js` - Image editing interface modal
- `utils/imageProcessor.js` - Image processing utilities
- `trickle/assets/` - Image resources used in the project

## Technology Stack

- React 18 (production build)
- Tailwind CSS for styling
- Lucide icons
- Canvas API for image processing
- File API for image upload

## Usage

1. Upload an image or select from examples
2. Adjust pixel size and image properties using the control panel
3. Apply color palettes if desired
4. Download the converted pixel art in small or large format

## License

Users are free to use generated images for any purpose including commercial use. The tool does not claim ownership over generated images.