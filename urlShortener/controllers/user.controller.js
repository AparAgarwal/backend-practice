import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import {
    BCRYPT_SALT_ROUNDS,
    HTTP_STATUS,
    MESSAGES,
    REDIRECT_MESSAGES,
    REDIRECT_DELAY_MS
} from '../constants.js';

const capitalize = (str = '') => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');
const isApiRequest = req =>
    req.xhr ||
    req.headers.accept?.includes('application/json') ||
    req.originalUrl.startsWith('/api/');

export const userSignUp = asyncHandler(async (req, res, next) => {
    // Data is already validated and sanitized by middleware
    const { fullName, username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

        const user = await User.create({ fullName, username, email, password: hashedPassword });

        const wantsJson = isApiRequest(req);

        if (wantsJson) {
            const userResponse = {
                _id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email
            };
            return res
                .status(HTTP_STATUS.CREATED)
                .json(new ApiResponse(HTTP_STATUS.CREATED, userResponse, MESSAGES.USER_CREATED));
        }

        // Render view for browser
        return res.render('signup', {
            success: REDIRECT_MESSAGES.USER_CREATED,
            redirectTo: '/',
            delay: REDIRECT_DELAY_MS
        });
    } catch (err) {
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyPattern)[0];
            const errorMessage = `${capitalize(duplicateField)} ${MESSAGES.DUPLICATE_EXISTS}`;

            const wantsJson = isApiRequest(req);

            if (wantsJson) {
                throw new ApiError(HTTP_STATUS.CONFLICT, errorMessage);
            }

            return res.status(HTTP_STATUS.BAD_REQUEST).render('signup', {
                error: errorMessage,
                fullName,
                username,
                email
            });
        }
        throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG, err);
    }
});
export const userLogin = asyncHandler(async (req, res, next) => {
    // Data is already validated and sanitized by middleware
    const { identifier, password } = req.body;

    const identifierQuery = identifier?.includes('@')
        ? { email: identifier }
        : { username: identifier };

    // Need to select password explicitly since it's excluded by default
    const user = await User.findOne(identifierQuery).select('+password');

    if (!user) {
        const wantsJson = isApiRequest(req);

        if (wantsJson) {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);
        }

        return res.status(HTTP_STATUS.UNAUTHORIZED).render('login', {
            error: MESSAGES.INVALID_CREDENTIALS
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const wantsJson = isApiRequest(req);

        if (wantsJson) {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);
        }

        return res.status(HTTP_STATUS.UNAUTHORIZED).render('login', {
            error: MESSAGES.INVALID_CREDENTIALS
        });
    }

    const wantsJson = isApiRequest(req);

    if (wantsJson) {
        // Don't send password in response
        const userResponse = {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email
        };
        return res
            .status(HTTP_STATUS.OK)
            .json(new ApiResponse(HTTP_STATUS.OK, userResponse, MESSAGES.LOGIN_SUCCESS));
    }

    // Render view for browser
    return res.render('login', {
        success: REDIRECT_MESSAGES.LOGIN_SUCCESS,
        redirectTo: '/',
        delay: REDIRECT_DELAY_MS
    });
});
