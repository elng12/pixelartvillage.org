import './globals.css'

export const metadata = {
  title: 'Image To Pixel Art',
  description: 'Free online tool to easily convert images, pictures, or photos into pixel art.',
  keywords: 'pixel art, image converter, pixel art generator, image to pixel art',
  metadataBase: new URL('https://pixelartvillage.com'),
  openGraph: {
    title: 'Image To Pixel Art',
    description: 'Free online tool to easily convert images, pictures, or photos into pixel art.',
    url: '/',
    siteName: 'Image To Pixel Art',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/display.png',
        width: 1280,
        height: 720,
        alt: 'Image To Pixel Art',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image To Pixel Art',
    description: 'Free online tool to easily convert images, pictures, or photos into pixel art.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}