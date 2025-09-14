export default function DemoSection() {
  const demos = [
    {
      title: "Art",
      description: "Turn pictures into beautiful pixel art.",
      details: "(Image: Sunrise | Pixel Size: 22)",
      beforeImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&pixelate=22"
    },
    {
      title: "Texture", 
      description: "Turn real world images into textures for games or pixel art.",
      details: "(Image: Cobblestone | Pixel Size: 8 | Palette: Lost Century)",
      beforeImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop&pixelate=8"
    },
    {
      title: "Setting",
      description: "Convert real places into settings for games or pixel art.",
      details: "(Image: Mt. Fuji | Pixel Size: 8 | Palette: Pico-8)",
      beforeImage: "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=300&h=200&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=300&h=200&fit=crop&pixelate=8"
    }
  ]

  return (
    <section className="py-16 bg-white" data-name="demo-section" data-file="components/DemoSection.js">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-[var(--text-primary)] mb-12">Demos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demos.map((demo, index) => (
            <div key={index} className="demo-card">
              <div className="flex">
                <div className="w-1/2">
                  <img 
                    src={demo.beforeImage}
                    alt={`${demo.title} - Original`}
                    className="w-full h-48 object-cover border-r border-gray-200"
                  />
                </div>
                <div className="w-1/2">
                  <img 
                    src={demo.afterImage}
                    alt={`${demo.title} - Pixel Art`}
                    className="w-full h-48 object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">{demo.title}</h3>
                <p className="text-[var(--text-secondary)] mb-2">{demo.description}</p>
                <p className="text-sm text-[var(--text-secondary)] italic">{demo.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

