export enum Role {
  User = 'User',
  Admin = 'Admin',
}

export interface User {
  id: number;
  email: string;
  password?: string; // Should not be stored in client-side state long-term
  role: Role;
  name: string;
}
