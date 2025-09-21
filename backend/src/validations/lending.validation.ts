import Joi from 'joi';

export const createLendingRequestSchema = Joi.object({
    bookId: Joi.string().required(),
});

export const updateLendingRequestSchema = Joi.object({
    status: Joi.string().valid('approved', 'rejected').required(),
});
