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

export interface Column {
  _id?: string;
  title: string;
  order: number;
  boardId?: string;
}

export interface Task {
  _id?: string;
  title: string;
  order: number;
  boardId: string;
  columnId: string;
  description: string;
  userId: number;
  users: string[];
}
