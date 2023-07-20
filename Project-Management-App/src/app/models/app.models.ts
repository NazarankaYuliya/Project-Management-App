export interface User {
  name?: string;
  login: string;
  password: string;
}

export interface Board {
  _id?: string;
  title: string | null;
  owner: string | null;
  users: string[];
}

export interface UserResponse {
  token: string;
  _id: string;
  name: string;
  login: string;
}
