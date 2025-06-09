import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import { JobContext, UserProfileData } from '../supabase/services/resume-generation';
import { generateLatexResume } from '../templates/resume-latex';

const execPromise = util.promisify(exec);
const writeFilePromise = util.promisify(fs.writeFile);
const readFilePromise = util.promisify(fs.readFile);
const unlinkPromise = util.promisify(fs.unlink);

/**
 * Checks if pdflatex is installed on the system
 * 
 * @returns Promise<boolean> True if pdflatex is available
 */
async function isPdfLatexAvailable(): Promise<boolean> {
  try {
    await execPromise('which pdflatex');
    return true;
  } catch (error) {
    console.log('pdflatex is not installed on this system');
    return false;
  }
}

/**
 * Checks if required LaTeX packages are installed
 * 
 * @returns Promise<boolean> True if required packages are available
 */
import os from 'os';

async function checkRequiredPackages(): Promise<{ available: boolean, missing: string[], suggestion: string }> {
  // Check for pdflatex binary (cross-platform)
  try {
    await execPromise('pdflatex --version');
  } catch {
    const platform = os.platform();
    let suggestion = '';
    if (platform === 'linux') {
      suggestion = 'Install TeX Live. On Debian/Ubuntu: sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-fonts-extra. On Fedora: sudo dnf install texlive-scheme-basic texlive-collection-latexrecommended texlive-collection-fontsrecommended';
    } else if (platform === 'darwin') {
      suggestion = 'Install MacTeX from https://tug.org/mactex/';
    } else {
      suggestion = 'See https://tug.org/texlive/acquire.html for installation instructions for your OS.';
    }
    return { available: false, missing: ['pdflatex'], suggestion };
  }
  // Optionally, try to compile a minimal LaTeX doc to check for missing packages
  return { available: true, missing: [], suggestion: '' };
}


/**
 * Generates a PDF from resume content using LaTeX
 * 
 * @param resumeContent The generated resume content
 * @param profileData The user profile data
 * @param jobContext The job context
 * @returns Object with paths to the generated PDF and LaTeX files, and a flag indicating if PDF generation was successful
 */
export async function generateResumePDF(
  resumeContent: string,
  profileData: UserProfileData,
  jobContext: JobContext
): Promise<{ pdfPath: string; latexPath: string; pdfGenerated: boolean; logPath?: string; errorDetails?: string }> {
  try {
    // Create a temporary directory for LaTeX files
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate unique filenames
    const timestamp = Date.now();
    const userId = profileData.user_id;
    const latexFilename = `resume_${userId}_${timestamp}.tex`;
    const pdfFilename = `resume_${userId}_${timestamp}.pdf`;

    const latexPath = path.join(tempDir, latexFilename);
    const pdfPath = path.join(tempDir, pdfFilename);
    const logPath = latexPath.replace('.tex', '.log');
    let errorDetails = '';

    // Generate LaTeX content
    const latexContent = generateLatexResume(resumeContent, profileData, jobContext);

    // Write LaTeX file
    await writeFilePromise(latexPath, latexContent);

    // Check if pdflatex is available
    const pdflatexAvailable = await isPdfLatexAvailable();

    if (!pdflatexAvailable) {
      // pdflatex not available, return just the LaTeX file
      console.log('Skipping PDF generation as pdflatex is not available');
      return { pdfPath: '', latexPath, pdfGenerated: false };
    }

    // Check if required packages are available
    const { available: packagesAvailable, missing } = await checkRequiredPackages();
    if (!packagesAvailable) {
      console.log(`Skipping PDF generation due to missing LaTeX packages: ${missing.join(', ')}`);
      console.log('Suggestion: Install missing packages with: sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-fonts-extra');
      return { pdfPath: '', latexPath, pdfGenerated: false };
    }

    // Run pdflatex to generate PDF with a timeout
    try {
      console.log('Running pdflatex command...');
      let lastStdout = '', lastStderr = '';
      // Run pdflatex twice to resolve references
      for (let i = 0; i < 2; i++) {
        try {
          const { stdout, stderr } = await execPromise(`pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${latexPath}`, { timeout: 30000 });
          lastStdout = stdout;
          lastStderr = stderr;
          if (stderr) {
            console.error('LaTeX compilation warning:', stderr);
          }
          // Check for font errors in stdout
          if (stdout.includes('Font') && stdout.includes('not loadable')) {
            console.warn('Font loading error detected. This might be fixed by installing texlive-fonts-recommended and texlive-fonts-extra');
          }
        } catch (runError) {
          if (typeof runError === 'object' && runError !== null) {
            // Most Node.js exec errors are Error objects with these properties
            lastStderr = (runError as any).stderr || String(runError);
            lastStdout = (runError as any).stdout || '';
          } else {
            lastStderr = String(runError);
            lastStdout = '';
          }
          errorDetails += `Error during pdflatex run ${i + 1}: ${String(runError)}\n`;
          console.error(`Error during pdflatex run ${i + 1}:`, runError);
        }
      }
      // Always save the last stdout/stderr to the .log file for debugging
      try {
        await writeFilePromise(logPath, `STDOUT:\n${lastStdout}\n\nSTDERR:\n${lastStderr}\n${errorDetails}`);
      } catch (logWriteError) {
        console.error('Failed to write LaTeX log file:', logWriteError);
      }
      // Check if PDF was generated despite errors
      if (fs.existsSync(pdfPath)) {
        console.log('PDF generated successfully');
        return { pdfPath, latexPath, pdfGenerated: true, logPath };
      } else {
        console.warn('PDF file not found after compilation');
        errorDetails += 'PDF file not found after compilation.';
        return { pdfPath: '', latexPath, pdfGenerated: false, logPath, errorDetails };
      }
    } catch (pdfError) {
      console.error('Error running pdflatex:', pdfError);
      errorDetails += `Error running pdflatex: ${String(pdfError)}`;
      // Attempt to save error details to log
      try {
        await writeFilePromise(logPath, errorDetails);
      } catch (logWriteError) {
        console.error('Failed to write LaTeX log file on error:', logWriteError);
      }
      return { pdfPath: '', latexPath, pdfGenerated: false, logPath, errorDetails };
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Save any error details to log
    try {
      const logPath = path.join(process.cwd(), 'temp', `resume_error_${Date.now()}.log`);
      await writeFilePromise(logPath, String(error));
      return { pdfPath: '', latexPath: '', pdfGenerated: false, logPath, errorDetails: String(error) };
    } catch {
      // If log write fails, just return error
      return { pdfPath: '', latexPath: '', pdfGenerated: false, errorDetails: String(error) };
    }
  }
}

/**
 * Cleans up temporary LaTeX and PDF files
 * 
 * @param filePaths Object containing paths to files to clean up
 */
export async function cleanupLatexFiles(filePaths: { pdfPath?: string; latexPath?: string }): Promise<void> {
  try {
    // Delete temporary files
    if (filePaths.latexPath && fs.existsSync(filePaths.latexPath)) {
      await unlinkPromise(filePaths.latexPath);

      // Also delete auxiliary files
      const basePath = filePaths.latexPath.replace('.tex', '');
      const auxExtensions = ['.aux', '.log', '.out'];

      for (const ext of auxExtensions) {
        const auxPath = `${basePath}${ext}`;
        if (fs.existsSync(auxPath)) {
          await unlinkPromise(auxPath);
        }
      }
    }

    // Optionally delete PDF if needed
    if (filePaths.pdfPath && fs.existsSync(filePaths.pdfPath) && filePaths.pdfPath.includes('temp/')) {
      await unlinkPromise(filePaths.pdfPath);
    }
  } catch (error) {
    console.error('Error cleaning up LaTeX files:', error);
  }
}
