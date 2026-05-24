import OpenAI from 'openai';
import dotenv from 'dotenv';
import { IGeneratedPaper, IDifficulty } from '../types/types';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerationParams {
  title: string;
  subject: string;
  grade: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  difficulty: IDifficulty;
  instructions?: string;
  fileContent?: string;
}

export const generateQuestions = async (
  params: GenerationParams
): Promise<IGeneratedPaper> => {
  const {
    title,
    subject,
    grade,
    questionTypes,
    numberOfQuestions,
    totalMarks,
    difficulty,
    instructions,
    fileContent,
  } = params;

  // Calculate question distribution by difficulty
  const easyCount = Math.round((difficulty.easy / 100) * numberOfQuestions);
  const hardCount = Math.round((difficulty.hard / 100) * numberOfQuestions);
  const mediumCount = numberOfQuestions - easyCount - hardCount;

  // Calculate marks per question (approximate)
  const marksPerQuestion = Math.round(totalMarks / numberOfQuestions);

  const systemPrompt = `You are an expert educational assessment creator. You create well-structured examination papers with high-quality questions.

IMPORTANT RULES:
1. You MUST return valid JSON only — no markdown, no explanations, no code fences.
2. Follow the exact JSON schema provided.
3. Questions must be age-appropriate for the specified grade level.
4. Each question must be clear, unambiguous, and educationally sound.
5. For MCQ questions, provide exactly 4 options labeled "A", "B", "C", "D".
6. For True/False questions, the answer should be either "True" or "False".
7. Distribute marks appropriately based on difficulty.
8. Group questions by type into sections.`;

  const userPrompt = `Create an examination paper with the following specifications:

SUBJECT: ${subject}
GRADE/CLASS: ${grade}
TITLE: ${title}
TOTAL QUESTIONS: ${numberOfQuestions}
TOTAL MARKS: ${totalMarks}
QUESTION TYPES: ${questionTypes.join(', ')}

DIFFICULTY DISTRIBUTION:
- Easy: ${easyCount} questions (${difficulty.easy}%)
- Medium: ${mediumCount} questions (${difficulty.medium}%)
- Hard: ${hardCount} questions (${difficulty.hard}%)

APPROXIMATE MARKS PER QUESTION: ${marksPerQuestion}
${instructions ? `\nADDITIONAL INSTRUCTIONS: ${instructions}` : ''}
${fileContent ? `\nREFERENCE MATERIAL:\n${fileContent.substring(0, 3000)}` : ''}

Return the response in this EXACT JSON format:
{
  "title": "${title}",
  "subject": "${subject}",
  "grade": "${grade}",
  "duration": "estimated duration string like '2 Hours'",
  "totalMarks": ${totalMarks},
  "institution": "VedaAI Assessment",
  "sections": [
    {
      "title": "Section A - [Question Type]",
      "instruction": "Clear instruction for this section",
      "questions": [
        {
          "question": "The question text",
          "type": "MCQ|Short Answer|Long Answer|True/False",
          "difficulty": "Easy|Medium|Hard",
          "marks": number,
          "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
          "correctAnswer": "The correct answer"
        }
      ]
    }
  ]
}

IMPORTANT: Return ONLY the JSON object. No additional text, markdown formatting, or code blocks.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from AI');
    }

    // Parse and validate JSON
    const paper = JSON.parse(content) as IGeneratedPaper;

    // Validate structure
    if (!paper.sections || !Array.isArray(paper.sections) || paper.sections.length === 0) {
      throw new Error('Invalid paper structure: no sections found');
    }

    // Ensure required fields
    paper.title = paper.title || title;
    paper.subject = paper.subject || subject;
    paper.grade = paper.grade || grade;
    paper.totalMarks = paper.totalMarks || totalMarks;
    paper.institution = paper.institution || 'VedaAI Assessment';
    paper.generatedAt = new Date();

    // Validate each section has questions
    for (const section of paper.sections) {
      if (!section.questions || !Array.isArray(section.questions) || section.questions.length === 0) {
        throw new Error(`Section "${section.title}" has no questions`);
      }
    }

    return paper;
  } catch (error: any) {
    if (error.message?.includes('JSON')) {
      throw new Error('AI returned invalid JSON. Retrying may help.');
    }
    throw error;
  }
};

export default { generateQuestions };
