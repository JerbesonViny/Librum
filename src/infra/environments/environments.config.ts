type Jwt = {
  secretKey: string;
};

type AppConfig = {
  jwt: Jwt;
};

export default (): AppConfig => ({
  jwt: {
    secretKey: process.env.JWT_SECRET || 'supersecretjwtkey',
  },
});
