import { Queue } from 'bullmq';
import { createRedisConnection } from '../config/redis';

const connection = createRedisConnection();

export const questionQueue = new Queue('question-generation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      count: 100,
      age: 24 * 3600, // keep for 24 hours
    },
    removeOnFail: {
      count: 50,
    },
  },
});

interface JobData {
  assignmentId: string;
  userId: string;
}

export const addQuestionGenerationJob = async (data: JobData) => {
  const job = await questionQueue.add('generate-questions', data, {
    priority: 1,
  });
  console.log(`📝 Job ${job.id} added to queue for assignment ${data.assignmentId}`);
  return job;
};

export default questionQueue;
