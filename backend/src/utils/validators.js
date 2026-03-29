import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(128),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const googleAuthSchema = z.object({
  body: z.object({
    idToken: z.string().min(20),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(20),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const profileUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80).optional(),
    avatar: z.string().url().optional().nullable(),
    preferences: z
      .object({
        dailyStudyHours: z.number().min(1).max(12).optional(),
        focusTime: z.enum(["morning", "afternoon", "evening", "night"]).optional(),
        difficultyLevel: z.enum(["easy", "medium", "hard"]).optional(),
      })
      .optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const generatePlanSchema = z.object({
  body: z.object({
    startDate: z.string().datetime().optional(),
    days: z.number().min(1).max(30).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const todayPlanSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    date: z.string().optional(),
  }),
});

export const updatePlanSchema = z.object({
  body: z.object({
    date: z.string(),
    tasks: z.array(
      z.object({
        subject: z.string().min(2),
        topic: z.string().min(2),
        duration: z.number().min(10).max(360),
        status: z.enum(["pending", "completed", "missed"]).optional(),
        priority: z.enum(["high", "medium", "low"]).optional(),
      })
    ),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const taskActionSchema = z.object({
  body: z.object({
    taskId: z.string().min(8),
    date: z.string(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const quizSubmitSchema = z.object({
  body: z.object({
    subject: z.string().min(2),
    topic: z.string().min(2),
    score: z.number().min(0).max(100),
    accuracy: z.number().min(0).max(100),
    timeTaken: z.number().min(1),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const quizHistorySchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    limit: z.coerce.number().min(1).max(100).optional(),
  }),
});
