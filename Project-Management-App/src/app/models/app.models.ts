export interface User {
  name?: string;
  login: string;
  password: string;
}

export interface Board {
  title: string;
  owner: string;
  users: string[];
}

export interface UserResponse {
  token: string;
  _id: string;
  name: string;
  login: string;
}
