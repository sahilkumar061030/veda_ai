import fs from 'fs';
import path from 'path';

export const parseFile = async (
  filePath: string,
  mimeType: string
): Promise<string> => {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  switch (mimeType) {
    case 'text/plain': {
      return fs.readFileSync(absolutePath, 'utf-8');
    }

    case 'application/pdf': {
      try {
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(absolutePath);
        const data = await pdfParse(dataBuffer);
        return data.text || '';
      } catch (error) {
        console.error('PDF parsing error:', error);
        throw new Error('Failed to parse PDF file');
      }
    }

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      // Basic DOCX parsing — extract raw text
      try {
        const dataBuffer = fs.readFileSync(absolutePath);
        // Simple text extraction from DOCX XML
        const text = dataBuffer.toString('utf-8').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        return text.substring(0, 5000); // Limit content
      } catch (error) {
        console.error('DOCX parsing error:', error);
        throw new Error('Failed to parse DOCX file');
      }
    }

    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
};

export default { parseFile };
