import { z } from 'zod';

export const QuestionSchema = z.object({
  type: z.enum(['mcq', 'msq', 'long', 'integer', 'numerical']),
  question: z.string().min(1, 'Question is required'),
  options: z.array(z.string()).optional(), // only for mcq/msq
  correctAnswer: z.any(),
  marks: z.number().positive('Marks must be positive'),
  negativeMarks: z.number().nonnegative().optional(),
  perQuestionTimer: z.number().positive('Timer must be positive (seconds)'), // 👈
});

export const AssessmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  durationInMinutes: z.number().positive('Duration required'),
  questions: z.array(QuestionSchema).min(1, 'At least one question required'),
});
