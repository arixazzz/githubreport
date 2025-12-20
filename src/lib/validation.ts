import { z } from "zod";

export const UserCreateSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  name: z.string().min(2),
  email: z.string().email(),
  position: z.string().optional().nullable(),
  role: z.string(),
});

export const UserUpdateSchema = z.object({
  nama: z.string().min(2).optional(),
  email: z.string().email().optional(),
  position: z.string().optional().nullable(),
  role: z.string().optional(),
});

export const ProjectSchema = z.object({
  title: z.string().min(2),
  detail: z.string().optional(),
  deadline: z.string().min(1),
  stack: z.string().optional(),
  githubRepo: z
    .string()
    .regex(/^[\w.-]+\/[\w.-]+$/, "Format Repository harus owner/repo"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional().default("PUBLIC"),
  userIds: z.array(z.number()).optional(),
});

export const ReportSchema = z.object({
  projectId: z.number(),
  content: z.string().min(10),
});
