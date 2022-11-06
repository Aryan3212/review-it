const { escape, normalizeEmail, stripLow, trim } = require('validator');

const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

const imageFilter = (req, file, cb) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    return cb(null, true);
};

const processUploadedImageFiles = (files) => {
    return files.map((file) => {
        return {
            url: this.sanitizeUserInput(file.path),
            filename: this.sanitizeUserInput(file.filename)
        };
    });
};
const sanitizeEmail = (email) => {
    return normalizeEmail(sanitizeUserInput(email), {
        gmail_remove_dots: false
    });
};
const sanitizeUserInput = (input) => {
    const trimmed = trim(input);
    const stripped = stripLow(trimmed);
    const escaped = escape(stripped);
    return escaped;
};
const objectMap = (obj, fn) => {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)])
    );
};

const populateFields = (fieldsArray) => {
    return fieldsArray.map((field) => {
        return { path: field };
    });
};
module.exports = {
    sanitizeEmail,
    sanitizeUserInput,
    objectMap,
    processUploadedImageFiles,
    imageFilter,
    catchAsync
};
