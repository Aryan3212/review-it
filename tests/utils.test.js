const { catchAsync } = require('../utils/index.js');

describe('catching async functions work as intended', () => {
  beforeEach(() => {});

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
