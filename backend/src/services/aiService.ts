import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { IGeneratedPaper, IDifficulty } from '../types/types';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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

  const easyCount = Math.round((difficulty.easy / 100) * numberOfQuestions);
  const hardCount = Math.round((difficulty.hard / 100) * numberOfQuestions);
  const mediumCount = numberOfQuestions - easyCount - hardCount;
  const marksPerQuestion = Math.round(totalMarks / numberOfQuestions);

  const systemPrompt = `You are an expert educational assessment creator. You create well-structured examination papers with high-quality questions.
IMPORTANT RULES:
1. You MUST return valid JSON only — no markdown, no explanations, no code fences.
2. Follow the exact JSON schema provided.
3. Questions must be age-appropriate for the specified grade level.
4. For MCQ questions, provide exactly 4 options labeled "A", "B", "C", "D".
5. For True/False questions, the answer should be either "True" or "False".
6. Group questions by type into sections.`;

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

Return ONLY this exact JSON format, no other text:
{
  "title": "${title}",
  "subject": "${subject}",
  "grade": "${grade}",
  "duration": "2 Hours",
  "totalMarks": ${totalMarks},
  "institution": "VedaAI Assessment",
  "sections": [
    {
      "title": "Section A - MCQ",
      "instruction": "Choose the correct answer",
      "questions": [
        {
          "question": "Question text here",
          "type": "MCQ",
          "difficulty": "Easy",
          "marks": 2,
          "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
          "correctAnswer": "A. option1"
        }
      ]
    }
  ]
}`;

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    let content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from AI');
    }

    // Clean response
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse JSON
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
