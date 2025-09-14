export default function HeroSection() {
  return (
    <section className="bg-white py-16" data-name="hero-section" data-file="components/HeroSection.js">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Image to Pixel Art
        </h1>
        <p className="text-xl text-[var(--text-secondary)] mb-8">
          Easily transform any image into stunning pixel art!
        </p>
        <div className="max-w-2xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=300&fit=crop&crop=center"
            alt="Pixel Art Demo"
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
