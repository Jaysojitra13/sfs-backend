export interface User {
  _id: string;
  email: string;
  password?: string;
  fullName: string;
  token?: string;
}
