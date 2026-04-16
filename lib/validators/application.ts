import { z } from 'zod';

export const applicationSchema = z.object({
  company: z.string().min(2),
  role: z.string().min(2),
  status: z.enum(['applied', 'interview', 'rejected']),
});