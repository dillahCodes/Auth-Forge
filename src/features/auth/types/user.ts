export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  verifiedAt: Date | null;
}
