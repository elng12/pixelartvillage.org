import React from 'react';

const faqs = [
  {
    question: 'Is this pixel art maker free?',
    answer: 'Yes. Pixel Art Village is a completely free online tool for all users. Enjoy unlimited conversions, palette controls, and high-resolution downloads without any cost.'
  },
  {
    question: 'Is my image private? Do you upload files?',
    answer: 'Your privacy is guaranteed. Your images never leave your device as all processing is done locally in your browser. Pixel Art Village cannot access your files, making it a secure pixel art creator from your images.'
  },
  {
    question: 'How do I turn a picture into a game sprite?',
    answer: 'Our pixel art maker is perfect for creating game sprites. Upload your character\'s picture, adjust the pixel size to match your game\'s art style, and use the palette controls to fit your engine\'s color limits. You can then download the resulting sprite as a transparent PNG.'
  },
  {
    question: 'Can I adjust the pixel grid on my image?',
    answer: 'Absolutely. The live editor includes a "Show grid" option. This pixel grid overlay helps you see the individual pixels clearly, which is useful for fine-tuning your art or for learning how the pixelation effect works on your image.'
  },
  {
    question: 'What is the best way to convert a photo to pixel art?',
    answer: 'For best results when you convert a photo to pixel art, start with a high-contrast image. Use the pixel size slider to find a level of detail you like. A larger pixel size creates a more abstract, 8-bit look, while a smaller size retains more detail from the original photo.'
  },
  {
    question: 'Can I use the generated pixel art commercially?',
    answer: 'Yes. You own the rights to your original uploads and to the generated results. You can use art made with Pixel Art Village for any purpose, including commercial projects.'
  },
  {
    question: 'Which formats can I use with this image pixelator?',
    answer: 'This image pixelator supports all common browser formats like PNG, JPG, GIF, and WEBP. You can convert a PNG to pixel art or a JPG to pixel art with ease.'
  },
  {
    question: 'Why is this tool called Pixel Art Village?',
    answer: 'We believe that creating art is a community activity, even when using a tool online. Pixel Art Village is a place where anyone, from beginner to pro, can gather to easily make pixel art. We aim to build a welcoming village for all pixel art enthusiasts.'
  }
];

function FaqSection() {
  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Pixel Art Generator - Frequently Asked Questions</h2>
        <div className="space-y-8">
          {faqs.map((faq) => (
            <div key={faq.question} className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg text-gray-800">{faq.question}</h3>
              <p className="mt-2 text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
