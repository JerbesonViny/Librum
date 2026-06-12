jest.setTimeout(6e4);

beforeAll(() => {
  process.env.JWT_SECRET = 'notSoSecretAfterAll';
});

afterAll(() => {
  delete process.env.JWT_SECRET;
});
