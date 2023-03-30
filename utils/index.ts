import { NextFunction, Request, Response } from 'express';
import validator  from 'validator';

const catchAsync = (fn: Function) => {
    return (req:Request, res:Response, next:NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

const imageFilter = (file: Express.Multer.File , cb: Function) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    return cb(null, true);
};

const processUploadedImageFiles = (files: Array<Express.Multer.File>) => {
    return files.map((file) => {
        return {
            url: file.path,
            filename: sanitizeUserInput(file.filename)
        };
    });
};
const sanitizeEmail = (email: string) => {
    return validator.normalizeEmail(sanitizeUserInput(email), {
        gmail_remove_dots: false
    });
};
const sanitizeUserInput = (input: string) => {
    const trimmed = validator.trim(input);
    const stripped = validator.stripLow(trimmed);
    return stripped;
};
const objectMap = (obj: Object, fn: Function) => {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)])
    );
};

const populateFields = (fieldsArray: Array<String>) => {
    return fieldsArray.map((field) => {
        return { path: field };
    });
};

class CustomError extends Error{
    statusCode: Number;
    constructor(statusCode: Number, message: string){
        super(message);
        this.statusCode = statusCode;
    }
}
module.exports = {
    sanitizeEmail,
    sanitizeUserInput,
    objectMap,
    processUploadedImageFiles,
    imageFilter,
    catchAsync,
    CustomError
};
