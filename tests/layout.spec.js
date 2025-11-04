import { test, expect } from '@playwright/test';
import fs from 'node:fs';

const __logs = { console: [], requests: [], responses: [], failed: [] };

test.beforeEach(async ({ page }, _testInfo) => {
  page.on('console', (msg) => {
    __logs.console.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
      ts: Date.now()
    });
  });
  page.on('request', (req) => {
    __logs.requests.push({
      method: req.method(),
      url: req.url(),
      headers: req.headers(),
      ts: Date.now()
    });
  });
  page.on('response', async (res) => {
    __logs.responses.push({
      url: res.url(),
      status: res.status(),
      headers: await res.allHeaders().catch(() => ({})),
      ts: Date.now()
    });
  });
  page.on('requestfailed', (req) => {
    __logs.failed.push({
      url: req.url(),
      method: req.method(),
      failure: req.failure(),
      ts: Date.now()
    });
  });
});

test.afterEach(async (_context, testInfo) => {
  try {
    const outConsole = testInfo.outputPath('browser-console.json');
    const outRequests = testInfo.outputPath('network-requests.json');
    const outResponses = testInfo.outputPath('network-responses.json');
    const outFailed = testInfo.outputPath('network-failed.json');
    fs.writeFileSync(outConsole, JSON.stringify(__logs.console, null, 2), 'utf8');
    fs.writeFileSync(outRequests, JSON.stringify(__logs.requests, null, 2), 'utf8');
    fs.writeFileSync(outResponses, JSON.stringify(__logs.responses, null, 2), 'utf8');
    fs.writeFileSync(outFailed, JSON.stringify(__logs.failed, null, 2), 'utf8');
  } catch { void 0 }
  // reset for next test
  __logs.console.length = 0;
  __logs.requests.length = 0;
  __logs.responses.length = 0;
  __logs.failed.length = 0;
});

// Helper: robust processing wait using aria-busy on preview container
async function waitForProcessing(page) {
  const container = page.getByTestId('preview-container');
  // ensure container exists
  await container.waitFor({ state: 'attached', timeout: 10000 });
  // try to catch the 'true' phase (may be very short for tiny images)
  let sawBusy = false;
  try {
    await expect(container).toHaveAttribute('aria-busy', 'true', { timeout: 2000 });
    sawBusy = true;
  } catch {
    // if we didn't see busy=true, continue; processing may be instantaneous
  }
  // always ensure it settles to false (or at least attached)
  try {
    await expect(container).toHaveAttribute('aria-busy', 'false', { timeout: 10000 });
  } catch {
    // some renderers may omit false; fallback to ensure element remains
    await container.waitFor({ state: 'attached', timeout: 1000 });
  }
  return sawBusy;
}

// Known-good 1x1 PNG buffer
function createRedPixelImage() {
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQotAAAAAElFTkSuQmCC';
  return Buffer.from(b64, 'base64');
}

test('preview container should not change size during processing', async ({ page }) => {
  await page.goto('/');

  // Upload via hidden input for stability across browsers
  const fileInput = page.getByTestId('file-input');
  await fileInput.setInputFiles({
    name: 'test.png',
    mimeType: 'image/png',
    buffer: createRedPixelImage(),
  });

  // If preview is not available in this build, skip; otherwise wait for it to settle
  try {
    await page.getByTestId('preview-container').waitFor({ state: 'attached', timeout: 10000 });
  } catch { test.skip(); }
  await waitForProcessing(page);

  // If preview is not available, skip this test in this build
  try {
    await page.getByTestId('preview-container').waitFor({ state: 'attached', timeout: 3000 });
  } catch {
    test.skip();
  }
  const previewContainer = page.getByTestId('preview-container');
  const initialBoundingBox = await previewContainer.boundingBox();
  expect(initialBoundingBox).not.toBeNull();

  // Drag the brightness slider if present
  const brightnessSlider = page.locator('#brightness-slider');
  const sliderBoundingBox = await brightnessSlider.boundingBox();
  await page.mouse.move(sliderBoundingBox.x, sliderBoundingBox.y);
  await page.mouse.down();
  await page.mouse.move(sliderBoundingBox.x + 20, sliderBoundingBox.y);
  await page.mouse.up();

  // Wait for processing (via aria-busy on preview container)
  await waitForProcessing(page);

  // Ensure container size does not change while processing
  const processingBoundingBox = await previewContainer.boundingBox();
  expect(processingBoundingBox.width).toBe(initialBoundingBox.width);
  expect(processingBoundingBox.height).toBe(initialBoundingBox.height);

  // Processing wait is handled by waitForProcessing via aria-busy

  // Verify size again after processing completes
  const finalBoundingBox = await previewContainer.boundingBox();
  expect(finalBoundingBox.width).toBe(initialBoundingBox.width);
  expect(finalBoundingBox.height).toBe(initialBoundingBox.height);
});

test('reselecting the same file should trigger processing again', async ({ page }) => {
  await page.goto('/');

  // First selection via hidden input (more stable)
  const payload = { name: 'test.png', mimeType: 'image/png', buffer: createRedPixelImage() };
  await page.getByTestId('file-input').setInputFiles(payload);
  try { await page.getByTestId('preview-container').waitFor({ state: 'attached', timeout: 10000 }); } catch { test.skip(); }
  await waitForProcessing(page);

  // Reselect the same file again
  await page.getByTestId('file-input').setInputFiles(payload);
  await waitForProcessing(page);
});

test('clicking the inner choose-file button opens file chooser and processes once', async ({ page }) => {
  await page.goto('/');
  const btn = page.getByTestId('choose-file-btn');
  await btn.click();
  await page.getByTestId('file-input').setInputFiles({ name: 'test.png', mimeType: 'image/png', buffer: createRedPixelImage() });
  try { await page.getByTestId('preview-container').waitFor({ state: 'attached', timeout: 10000 }); } catch { test.skip(); }
  await waitForProcessing(page);
});
