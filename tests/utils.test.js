const { imageFilter, objectMap } = require('../utils/index.js');

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
describe('mapping object keys util', () => {
    test('object maps correctly', () => {
        const myObject = { a: 1, b: 2, c: 3 };
        const mappedObject = objectMap(myObject, (v) => v * 2);
        const expectedObject = { a: 2, b: 4, c: 6 };
        expect(mappedObject).toMatchObject(expectedObject);
    });
});
