import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { resumeText } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Parse this resume text and return a JSON object with the following structure:
      {
        "name": "Full Name",
        "email": "email@example.com",
        "github": "github profile URL",
        "linkedin": "linkedin profile URL",
        "portfolio": "portfolio URL",
        "bio": "professional summary",
        "experiences": [{
          "title": "job title",
          "company": "company name",
          "startDate": "YYYY-MM",
          "endDate": "YYYY-MM",
          "description": "job description"
        }],
        "education": [{
          "school": "institution name",
          "degree": "degree type",
          "field": "field of study",
          "startDate": "YYYY-MM",
          "endDate": "YYYY-MM",
          "grade": "grade/GPA",
          "description": "additional details"
        }],
        "skills": [{
          "name": "skill name",
          "proficiency": "intermediate"
        }],
        "projects": [{
          "name": "project name",
          "description": "project description",
          "githubUrl": "github URL",
          "liveUrl": "live demo URL"
        }],
        "certifications": [{
          "name": "certification name",
          "issuer": "issuing organization",
          "issueDate": "YYYY-MM",
          "expiryDate": "YYYY-MM",
          "certificationId": "cert ID",
          "certificationUrl": "verification URL"
        }],
        "languages": ["language1", "language2"]
      }
      
      Resume text:
      ${resumeText}

      Important:
      1. Ensure the output is valid JSON
      2. Use empty strings for missing values
      3. Use arrays even if there's only one item
      4. Format dates as YYYY-MM
      5. For skills, set proficiency as "beginner", "intermediate", or "advanced" based on context
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const parsedData = response.text();

    return NextResponse.json({ parsedData });
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
}
