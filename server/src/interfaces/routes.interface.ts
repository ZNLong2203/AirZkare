import { z } from 'zod';
import { Router } from 'express';

export const RoutesSchema = z.object({
  path: z.string().optional(),
  router: z.any().refine((val) => val instanceof Router, {
    message: 'router must be an instance of express.Router',
  }),
});

export type Routes = z.infer<typeof RoutesSchema>;
