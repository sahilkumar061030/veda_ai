import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  createAssignment,
  getAssignments,
  getAssignment,
  regenerateAssignment,
  deleteAssignment,
  getStats,
} from '../controllers/assignmentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Configure multer for file uploads
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, TXT, and DOCX files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) },
});

// All routes require authentication
router.use(authMiddleware);

router.get('/stats', getStats);
router.get('/', getAssignments);
router.get('/:id', getAssignment);
router.post('/', upload.single('file'), createAssignment);
router.post('/:id/regenerate', regenerateAssignment);
router.delete('/:id', deleteAssignment);

export default router;
