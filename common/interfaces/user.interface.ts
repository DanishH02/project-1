export interface IUser {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}

export interface IUserDocument extends IUser {
  password: string;
}

