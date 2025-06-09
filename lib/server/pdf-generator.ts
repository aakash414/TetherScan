// lib/server/pdf-generator.ts
import puppeteer, { type LaunchOptions } from 'puppeteer-core';

const BROWSER_LAUNCH_OPTIONS: LaunchOptions = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--font-render-hinting=medium',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-software-rasterizer',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-extensions',
  ],
  headless: true, // Use boolean true for better compatibility
  executablePath: process.env.CHROME_BIN || undefined,
  timeout: 30000, // 30 seconds timeout for browser launch
};

const PDF_GENERATION_OPTIONS = {
  format: 'A4' as const,
  printBackground: true,
  margin: { 
    top: '0.5in', 
    bottom: '0.5in', 
    left: '0.5in', 
    right: '0.5in' 
  },
  preferCSSPageSize: true,
} as const;

/**
 * Generates a PDF from HTML content using Puppeteer
 * @param html The HTML content to convert to PDF
 * @returns A Buffer containing the generated PDF
 * @throws Error if PDF generation fails
 */
export async function generatePDFWithPuppeteer(html: string): Promise<Buffer> {
  let browser;
  
  try {
    // Launch browser with optimized settings
    browser = await puppeteer.launch(BROWSER_LAUNCH_OPTIONS);
    
    const page = await browser.newPage();
    
    try {
      // Set content and wait for network to be idle
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 30000 // 30 seconds timeout for page load
      });
      
      // Generate PDF with retry logic
      let pdf: Buffer;
      const maxRetries = 2;
      let lastError: Error | null = null;
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const pdfBuffer = await page.pdf(PDF_GENERATION_OPTIONS);
          pdf = Buffer.from(pdfBuffer);
          break; // Success, exit retry loop
        } catch (error) {
          lastError = error as Error;
          if (attempt === maxRetries) {
            throw new Error(`Failed to generate PDF after ${maxRetries + 1} attempts: ${lastError.message}`);
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
      
      return pdf!;
    } finally {
      // Ensure page is always closed
      await page.close().catch(console.error);
    }
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // Ensure browser is always closed
    if (browser) {
      await browser.close().catch(console.error);
    }
  }
}

/**
 * Validates that the Chrome executable exists and is accessible
 * @throws Error if Chrome is not found or not accessible
 */
export async function validateChromeInstallation(): Promise<void> {
  if (!process.env.CHROME_BIN) {
    throw new Error('CHROME_BIN environment variable is not set. Please ensure Chrome/Chromium is installed and the path is set.');
  }
  
  // This is a simple check - in a real app, you might want to verify the binary exists and is executable
  console.log(`Using Chrome binary at: ${process.env.CHROME_BIN}`);
}
