const { catchAsync, imageFilter } = require('../utils/index.js');

describe('catching async functions work as intended', () => {
    test('request is resolved', () => {
        const next = (err) => {
            if (err) return 'error';
        };
        const req = () => {};
        const res = () => {};
        const dummyFunction = async (req, res, next) => {
            return 'resolved';
        };
        const returnedFunction = catchAsync(dummyFunction);
        returnedFunction(req, res, next).then((value) => {
            expect(value).toBe('resolved');
        });
    });

    test('error occurs and is caught', () => {
        const next = (err) => {
            if (err) {
                return 'error';
            }
        };
        const req = () => {};
        const res = () => {};
        const dummyFunction = async (req, res, next) => {
            throw Error('Test error');
        };
        const returnedFunction = catchAsync(dummyFunction);
        returnedFunction(req, res, next).then((value) => {
            expect(value).toBe('error');
        });
    });
});

describe('test image file format verifier', () => {
    test('file format is an image and is verified', () => {
        const fileNames = ['image.png', 'image.gif', 'image.jpeg', 'image.jpg'];
        fileNames.forEach((name) => {
            imageFilter({}, { originalname: name }, (err, value) => {
                expect(value).toBe(true);
            });
        });
    });

    test('file format is not an image and is unverified', () => {
        const fileNames = [
            'image.txt',
            'image.docx',
            'image.pdf',
            'image.jpsga'
        ];
        fileNames.forEach((name) => {
            imageFilter({}, { originalname: name }, (err, value) => {
                expect(value).toBe(false);
            });
        });
    });
});
