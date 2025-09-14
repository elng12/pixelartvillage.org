function InfoSection() {
  try {
    const sections = [
      {
        title: "What is a Image To Pixel Art Converter?",
        content: `Image to pixel art converter is a free website tool that allows people to convert any image or picture to stunning pixel art. The website modifies the pixel size and allows people to apply custom palettes to the image. This is done without any AI, so the pixel sizes are accurate.

All image and picture types are supported such as png, jpg and svg. Simply upload the image to get started.

You are free to use the generated images for any purpose including commercial. Pixel Art Village does not claim any ownership over the generated images. However, it is up to users to ensure that the license on the input image allows for such use.`
      },
      {
        title: "How to Apply a Palette to Pixel Art Image?",
        content: `To apply a palette you can use the palette dropdown menu. Simply click one of the available options and the palette will apply to the image. Make sure that the palette checkbox is checked. Otherwise, the palette will not be applied.

Likewise, you can also add custom palettes using the palette import input. Currently palettes can only be imported from lospec.com. To search for a palette simply go to https://lospec.com/palette-list. Then click on a palette that you want, copy the url and paste the url into the input and click import.`
      },
      {
        title: "How to Download Pixel Art Image?",
        content: `To download your pixel art image, simply use the download buttons directly above the image. The two options are small and large. The small option downloads the image in the new pixel ratio. However, the large option scales the pixel ratio to the original size of the input image.`
      }
    ];

    return (
      <section className="py-16 bg-[var(--bg-dark)]" data-name="info-section" data-file="components/InfoSection.js">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
                  {section.title}
                </h2>
                <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Suggestions and Feedback
            </h3>
            <p className="text-[var(--text-secondary)]">
              I am always looking to improve Pixel Art Village. If there are any features you would like to see, 
              feel free to send me feedback. Any feedback is greatly appreciated.
            </p>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('InfoSection component error:', error);
    return null;
  }
}