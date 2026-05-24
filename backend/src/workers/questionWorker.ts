import { Worker, Job } from 'bullmq';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createRedisConnection } from '../config/redis';
import { connectDatabase } from '../config/database';
import Assignment from '../models/Assignment';
import { generateQuestions } from '../services/aiService';
import { parseFile } from '../utils/fileParser';
import { getIO } from '../sockets/socketHandler';

dotenv.config();

const connection = createRedisConnection();

interface JobData {
  assignmentId: string;
  userId: string;
}

const processJob = async (job: Job<JobData>): Promise<void> => {
  const { assignmentId, userId } = job.data;
  console.log(`🤖 Processing job ${job.id} for assignment ${assignmentId}`);

  const redis = connection;
  let io: any;

  try {
    io = getIO();
  } catch {
    // IO might not be available if worker runs standalone
    io = null;
  }

  try {
    // Update status to processing
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });
    await redis.set(`assignment:${assignmentId}:status`, 'processing', 'EX', 3600);

    // Emit started event
    if (io) {
      io.to(`user:${userId}`).emit('generation:started', {
        assignmentId,
        message: 'AI is generating your questions...',
      });
    }

    // Fetch assignment details
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Parse uploaded file if present
    let fileContent: string | undefined;
    if (assignment.uploadedFile?.path) {
      try {
        fileContent = await parseFile(
          assignment.uploadedFile.path,
          assignment.uploadedFile.mimeType
        );
      } catch (err) {
        console.warn('File parsing failed, continuing without file content:', err);
      }
    }

    // Emit progress
    if (io) {
      io.to(`user:${userId}`).emit('generation:progress', {
        assignmentId,
        progress: 30,
        message: 'Crafting questions with AI...',
      });
    }

    // Generate questions via AI
    const paper = await generateQuestions({
      title: assignment.title,
      subject: assignment.subject,
      grade: assignment.grade,
      questionTypes: assignment.questionTypes,
      numberOfQuestions: assignment.numberOfQuestions,
      totalMarks: assignment.totalMarks,
      difficulty: assignment.difficulty,
      instructions: assignment.instructions,
      fileContent,
    });

    // Emit progress
    if (io) {
      io.to(`user:${userId}`).emit('generation:progress', {
        assignmentId,
        progress: 80,
        message: 'Finalizing question paper...',
      });
    }

    // Store result
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'completed',
      generatedPaper: paper,
      error: undefined,
    });

    await redis.set(`assignment:${assignmentId}:status`, 'completed', 'EX', 3600);

    // Emit completion
    if (io) {
      io.to(`user:${userId}`).emit('generation:completed', {
        assignmentId,
        paper,
      });
    }

    console.log(`✅ Job ${job.id} completed for assignment ${assignmentId}`);
  } catch (error: any) {
    console.error(`❌ Job ${job.id} failed:`, error.message);

    // Update status to failed
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'failed',
      error: error.message,
    });

    await redis.set(`assignment:${assignmentId}:status`, 'failed', 'EX', 3600);

    // Emit failure
    if (io) {
      io.to(`user:${userId}`).emit('generation:failed', {
        assignmentId,
        error: error.message,
      });
    }

    throw error; // Re-throw for BullMQ retry
  }
};

// Create worker
export const createWorker = (): Worker => {
  const worker = new Worker('question-generation', processJob, {
    connection,
    concurrency: 3,
    limiter: {
      max: 5,
      duration: 60000, // 5 jobs per minute
    },
  });

  worker.on('completed', (job) => {
    console.log(`✅ Worker: Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Worker: Job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error('Worker error:', err);
  });

  return worker;
};

// If run directly, start worker with database connection
if (require.main === module) {
  (async () => {
    await connectDatabase();
    const worker = createWorker();
    console.log('🚀 Question generation worker started');

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down worker...');
      await worker.close();
      await mongoose.disconnect();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  })();
}

export default createWorker;
