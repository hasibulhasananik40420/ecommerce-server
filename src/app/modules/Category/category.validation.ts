import { z } from 'zod';

const categoryValidationSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: 'Please sign in',
    }),
    category: z.string({
      required_error: 'Enter category',
    }),
  }),
});

const editCategoryValidationSchema = z.object({
  body: z.object({
    user: z.string({
      required_error: 'Please sign in',
    }).optional(),
    category: z.string({
      required_error: 'Enter category',
    }).optional()
  }),
});

export const categoryValidation = {
  categoryValidationSchema, editCategoryValidationSchema
};
