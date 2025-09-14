# Pixel Art Village - Next.js Version

A professional Next.js implementation of the Image to Pixel Art converter tool, replicating the functionality and design of pixelartvillage.com.

## Features

- **Image Upload**: Support for PNG, JPG, and SVG files via drag-and-drop or file selection
- **Example Images**: Quick access to demo images (Sunrise, Cobblestone, Mt. Fuji)  
- **Pixel Art Controls**: Adjustable pixel size, brightness, contrast, and saturation
- **Individual Reset Buttons**: Separate reset buttons for each control (PS, BR, CT, SN)
- **Color Palettes**: Built-in palettes and import from Lospec.com
- **Download Options**: Small (pixel ratio) and Large (original size) download formats
- **Responsive Design**: Works on desktop and mobile devices
- **Professional UI**: Collapsible control panels and image dimension display

## Technology Stack

- **Next.js 14** - React framework with App Router
- **React 18** - User interface library
- **Tailwind CSS 3** - Utility-first CSS framework
- **TypeScript** - Type safety (configured)

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build and Export

To build the project for production:

\`\`\`bash
npm run build
\`\`\`

This will create an optimized build in the \`out\` directory that can be deployed to any static hosting service.

## Project Structure

- \`src/app/\` - Next.js pages and layouts
- \`src/components/\` - React components
- \`src/utils/\` - Utility functions and image processing
- \`public/\` - Static assets

## License

Users are free to use generated images for any purpose including commercial use. The tool does not claim ownership over generated images.

