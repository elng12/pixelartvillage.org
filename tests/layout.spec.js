import { test, expect } from '@playwright/test';

// Create a simple 10x10 red PNG image buffer
function createRedPixelImage() {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x0a, 0x08, 0x02, 0x00, 0x00, 0x00, 0x02, 0x50, 0x58, 0xea]);
  const data = Buffer.from('x\xda\x63\x60\x18\x05\xa3\x60\x14\x8c\x80\x01\x00\x00\x0c\x00\x01', 'binary');
  const trailer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);
  const idatHeader = Buffer.alloc(4);
  idatHeader.writeUInt32BE(data.length, 0);
  return Buffer.concat([header, idatHeader, Buffer.from('IDAT'), data, trailer]);
}

test('preview container should not change size during processing', async ({ page }) => {
  await page.goto('/');

  // Find the upload zone and upload an image
  const uploadZone = page.getByTestId('upload-zone');
  const fileChooserPromise = page.waitForEvent('filechooser');
  await uploadZone.click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles({
    name: 'test.png',
    mimeType: 'image/png',
    buffer: createRedPixelImage(),
  });

  // Wait for editor heading to appear
  await expect(page.locator('h2:has-text("Online Pixel Art Maker")')).toBeVisible();

  // Locate preview container element
  const previewContainer = page.getByTestId('preview-container');

  // Get initial size
  const initialBoundingBox = await previewContainer.boundingBox();
  expect(initialBoundingBox).not.toBeNull();

  // Drag the brightness slider
  const brightnessSlider = page.locator('#brightness-slider');
  const sliderBoundingBox = await brightnessSlider.boundingBox();
  await page.mouse.move(sliderBoundingBox.x, sliderBoundingBox.y);
  await page.mouse.down();
  await page.mouse.move(sliderBoundingBox.x + 20, sliderBoundingBox.y);
  await page.mouse.up();

  // Wait for processing indicator to appear
  const processingIndicator = page.getByTestId('processing-indicator');
  await expect(processingIndicator).toBeVisible();

  // Ensure container size does not change while processing
  const processingBoundingBox = await previewContainer.boundingBox();
  expect(processingBoundingBox.width).toBe(initialBoundingBox.width);
  expect(processingBoundingBox.height).toBe(initialBoundingBox.height);

  // Wait for processing to finish
  await expect(processingIndicator).not.toBeVisible();

  // Verify size again after processing completes
  const finalBoundingBox = await previewContainer.boundingBox();
  expect(finalBoundingBox.width).toBe(initialBoundingBox.width);
  expect(finalBoundingBox.height).toBe(initialBoundingBox.height);
});

test('reselecting the same file should trigger processing again', async ({ page }) => {
  await page.goto('/');

  const uploadZone = page.getByTestId('upload-zone');

  // First selection
  let chooser = page.waitForEvent('filechooser');
  await uploadZone.click();
  let fc = await chooser;
  const payload = { name: 'test.png', mimeType: 'image/png', buffer: createRedPixelImage() };
  await fc.setFiles(payload);
  await expect(page.getByTestId('processing-indicator')).toBeVisible();
  await expect(page.getByTestId('processing-indicator')).not.toBeVisible();

  // Reselect the same file again
  chooser = page.waitForEvent('filechooser');
  await uploadZone.click();
  fc = await chooser;
  await fc.setFiles(payload);
  await expect(page.getByTestId('processing-indicator')).toBeVisible();
  await expect(page.getByTestId('processing-indicator')).not.toBeVisible();
});

test('clicking the inner choose-file button opens file chooser and processes once', async ({ page }) => {
  await page.goto('/');
  const btn = page.getByTestId('choose-file-btn');
  const chooser = page.waitForEvent('filechooser');
  await btn.click();
  const fc = await chooser;
  await fc.setFiles({ name: 'test.png', mimeType: 'image/png', buffer: createRedPixelImage() });
  await expect(page.getByTestId('processing-indicator')).toBeVisible();
  await expect(page.getByTestId('processing-indicator')).not.toBeVisible();
});
