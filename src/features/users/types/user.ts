export type GetMe = User;

export interface User {
  id: string;
  email: string;
  name: string;
  verifiedAt: Date | null;
}
