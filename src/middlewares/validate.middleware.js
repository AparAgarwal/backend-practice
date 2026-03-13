import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        });
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            const zodIssues = Array.isArray(err.issues)
                ? err.issues
                : Array.isArray(err.errors)
                    ? err.errors
                    : [];

            const errors = zodIssues.map((e) => ({
                field: Array.isArray(e.path)
                    ? e.path.filter((p) => p !== 'body').join('.')
                    : '',
                message: e.message,
            }));

            return next(new ApiError(400, errors[0]?.message || 'Validation error', errors));
        }
        next(err);
    }
};

export { validate };
