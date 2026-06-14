type BaseSignUp = {
  email: string;
  password: string;
  name: string;
  lastName: string;
};

export type SignUpLibrarian = BaseSignUp & {};

export type SignUpTenant = BaseSignUp & {
  birthDate: string;
};
