import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import { ResumeGenerationService } from '@/lib/supabase/services/resume-generation';
import { generateResumePDF, cleanupLatexFiles } from '../../../../lib/utils/latex-pdf-generator';

export async function POST(request: NextRequest) {
  try {
    // Create a Supabase client with properly awaited cookies
    const cookieStore = await cookies(); // Await once
    const supabase = createSupabaseServerClient(cookieStore);

    // TEMPORARY: Authentication check bypassed for testing
    // console.log('Authentication check bypassed for testing');

    // Authentication code commented out for testing
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
          { success: false, error: `Authentication error: ${error.message}` },
          { status: 401 }
        );
      }

      const session = data.session;
      if (!session) {
        console.error('No session found');
        return NextResponse.json(
          { success: false, error: 'Authentication required - no session found' },
          { status: 401 }
        );
      }

      console.log('Authenticated user:', session.user.id);
    } catch (authError) {
      console.error('Auth exception:', authError);
      return NextResponse.json(
        { success: false, error: `Authentication exception: ${authError instanceof Error ? authError.message : String(authError)}` },
        { status: 401 }
      );
    }


    // Parse request body
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    const { userId, jobContext, maxProjects = 4, targetFormat = 'standard' } = body;

    // Validate required parameters
    if (!userId) {
      console.error('Missing userId parameter');
      return NextResponse.json(
        { success: false, error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    if (!jobContext) {
      console.error('Missing jobContext parameter');
      return NextResponse.json(
        { success: false, error: 'Missing jobContext parameter' },
        { status: 400 }
      );
    }

    console.log('Parameters validated successfully');

    // TEMPORARY: Authorization check bypassed for testing
    // console.log('Authorization check bypassed for testing');

    //  Authorization code commented out for testing
    // Get session again for authorization check
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    // Verify user is authorized to generate resume for this userId
    if (!session || userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to generate resume for this user' },
        { status: 403 }
      );
    }


    // Use the singleton resume service instance
    console.log('Using resume generation service');

    // Generate resume with detailed error handling
    console.log(`Starting resume generation for user ${userId} with target format ${targetFormat}`);
    let result;
    try {
      const resumeService = new ResumeGenerationService(userId, cookieStore); // Use the same resolved cookieStore
      result = await resumeService.generateResume({
        userId,
        jobContext,
        maxProjects,
        targetFormat
      });
      console.log('Resume generation completed successfully');
    } catch (genError) {
      console.error('Resume generation service error:', genError);
      return NextResponse.json({
        success: false,
        error: `Resume generation failed: ${genError instanceof Error ? genError.message : String(genError)}`
      }, { status: 500 });
    }

    // Generate PDF using LaTeX template
    console.log('Generating PDF with LaTeX template');
    let pdfPath = '';
    let latexPath = '';
    let pdfBase64 = '';
    let latexSource = '';

    let latexLog = '';
    let errorDetails = '';
    try {
      // Generate PDF from resume content
      const pdfResult = await generateResumePDF(
        result.resume,
        result.metadata.profileData || {}, // Pass profile data from result
        body.jobContext
      );

      latexPath = pdfResult.latexPath;

      // Read the LaTeX source for fallback
      if (latexPath) {
        const latexBuffer = await fs.readFile(latexPath);
        latexSource = latexBuffer.toString('utf-8');
      }

      // If PDF was generated successfully, read it and convert to base64
      if (pdfResult.pdfGenerated && pdfResult.pdfPath) {
        pdfPath = pdfResult.pdfPath;
        const pdfBuffer = await fs.readFile(pdfPath);
        pdfBase64 = pdfBuffer.toString('base64');
        console.log('PDF generated successfully');
      } else {
        console.log('PDF generation was skipped, using LaTeX source only');
        // If logPath exists, read the log file for error reporting
        if (pdfResult.logPath) {
          try {
            const logBuffer = await fs.readFile(pdfResult.logPath);
            latexLog = logBuffer.toString('utf-8');
          } catch (e) {
            latexLog = '';
          }
        }
        if (pdfResult.errorDetails) {
          errorDetails = pdfResult.errorDetails;
        }
      }
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError);
      // Continue without PDF if generation fails
    }

    // Cleanup temporary files
    if (pdfPath || latexPath) {
      cleanupLatexFiles({ pdfPath, latexPath }).catch(err => {
        console.error('Error cleaning up LaTeX files:', err);
      });
    }

    // Return successful response with PDF data and LaTeX source
    return NextResponse.json({
      success: true,
      data: {
        ...result,
        pdfBase64: pdfBase64 || undefined,
        latexSource: latexSource || undefined,
        latexLog: latexLog || undefined,
        errorDetails: errorDetails || undefined,
      }
    });

  } catch (error: any) {
    console.error('Resume generation error:', error);

    // Return error response
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, {
      status: error.status || 500
    });
  }
}
