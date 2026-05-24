import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import { addQuestionGenerationJob } from '../queues/questionQueue';
import { getRedis } from '../config/redis';

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const {
      title,
      subject,
      grade,
      dueDate,
      questionTypes,
      numberOfQuestions,
      totalMarks,
      difficulty,
      instructions,
    } = req.body;

    // Validate difficulty sums to 100
    const diffSum = difficulty.easy + difficulty.medium + difficulty.hard;
    if (diffSum !== 100) {
      res.status(400).json({ error: 'Difficulty percentages must sum to 100' });
      return;
    }

    // Handle file upload
    let uploadedFile;
    if (req.file) {
      uploadedFile = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      };
    }

    const assignment = await Assignment.create({
      userId,
      title,
      subject,
      grade,
      dueDate,
      questionTypes: JSON.parse(questionTypes),
      numberOfQuestions: parseInt(numberOfQuestions),
      totalMarks: parseInt(totalMarks),
      difficulty: JSON.parse(difficulty),
      instructions,
      uploadedFile,
      status: 'pending',
    });

    // Enqueue AI generation job
    const job = await addQuestionGenerationJob({
      assignmentId: assignment._id.toString(),
      userId,
    });

    // Update assignment with job ID
    assignment.jobId = job.id;
    await assignment.save();

    // Cache status in Redis
    const redis = getRedis();
    await redis.set(
      `assignment:${assignment._id}:status`,
      'pending',
      'EX',
      3600
    );

    res.status(201).json({
      message: 'Assignment created. AI generation started.',
      assignment: {
        id: assignment._id,
        title: assignment.title,
        status: assignment.status,
        jobId: job.id,
      },
    });
  } catch (error: any) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
};

export const getAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const {
      page = '1',
      limit = '10',
      status,
      search,
      sort = '-createdAt',
    } = req.query;

    const query: any = { userId };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [assignments, total] = await Promise.all([
      Assignment.find(query)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum)
        .select('-generatedPaper')
        .lean(),
      Assignment.countDocuments(query),
    ]);

    res.json({
      assignments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};

export const getAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const assignment = await Assignment.findOne({ _id: id, userId }).lean();
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    // Check Redis for latest status
    const redis = getRedis();
    const cachedStatus = await redis.get(`assignment:${id}:status`);
    if (cachedStatus && cachedStatus !== assignment.status) {
      // Return cached status if newer
      assignment.status = cachedStatus as any;
    }

    res.json({ assignment });
  } catch (error: any) {
    console.error('Get assignment error:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
};

export const regenerateAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const assignment = await Assignment.findOne({ _id: id, userId });
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    // Reset status
    assignment.status = 'pending';
    assignment.generatedPaper = undefined;
    assignment.error = undefined;
    await assignment.save();

    // Enqueue new job
    const job = await addQuestionGenerationJob({
      assignmentId: assignment._id.toString(),
      userId: userId!,
    });

    assignment.jobId = job.id;
    await assignment.save();

    // Update Redis
    const redis = getRedis();
    await redis.set(`assignment:${id}:status`, 'pending', 'EX', 3600);

    res.json({
      message: 'Regeneration started',
      assignment: {
        id: assignment._id,
        status: 'pending',
        jobId: job.id,
      },
    });
  } catch (error: any) {
    console.error('Regenerate error:', error);
    res.status(500).json({ error: 'Failed to regenerate assignment' });
  }
};

export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const assignment = await Assignment.findOneAndDelete({ _id: id, userId });
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    // Clear Redis cache
    const redis = getRedis();
    await redis.del(`assignment:${id}:status`);

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error: any) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const [total, completed, processing, pending, failed] = await Promise.all([
      Assignment.countDocuments({ userId }),
      Assignment.countDocuments({ userId, status: 'completed' }),
      Assignment.countDocuments({ userId, status: 'processing' }),
      Assignment.countDocuments({ userId, status: 'pending' }),
      Assignment.countDocuments({ userId, status: 'failed' }),
    ]);

    // Calculate average questions per completed assignment
    const avgResult = await Assignment.aggregate([
      { $match: { userId, status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$numberOfQuestions' } } },
    ]);

    const avgQuestions = avgResult.length > 0 ? Math.round(avgResult[0].avg) : 0;

    // Recent activity: last 7 days count by date
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await Assignment.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      stats: {
        total,
        completed,
        processing,
        pending,
        failed,
        avgQuestions,
      },
      recentActivity,
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
