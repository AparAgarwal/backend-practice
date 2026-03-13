import { z } from 'zod';

const passwordSchema = z.string({
    required_error: "Password is required",
}).min(8, "Password must be at least 8 characters")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const userRegistrationSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: "Name is required",
        }).min(2, "Name must be at least 2 characters"),

        username: z.string({
            required_error: "Username is required",
        }).min(3, "Username must be at least 3 characters")
          .toLowerCase()
          .trim(),

        email: z.email({
            error: (issue) =>
                issue.input === undefined
                    ? "Email is required"
                    : "Not a valid email address",
        }),

        password: passwordSchema,

        confirmPassword: z.string({
            required_error: "Confirm password is required",
        }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
});

export const userLoginSchema = z.object({
    body: z.object({
        email: z.email({
            error: (issue) =>
                issue.input === undefined
                    ? "Email is required"
                    : "Not a valid email address",
        }),

        password: z.string({
            required_error: "Password is required",
        }),
    }),
});

export const userUpdateSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters").optional(),
        email: z.email({ error: "Not a valid email address" }).optional(),
        password: passwordSchema.optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        message: "No valid fields to update",
    }),
});