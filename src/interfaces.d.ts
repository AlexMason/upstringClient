export interface ITopic {
  id: number;
  title: string;
  body: string;
  status: string;
  usedId: number;
  updatedAt: string;
  createdAt: string;
  comments?: IComment[];
  user?: IUser;
  tags?: ITag[];
  ratings?: IRating[];
}

export interface IComment {
  id: number;
  body: string;
  stickied: string;
  topicId: number;
  userId: number;
  updatedAt: string;
  createdAt: string;
  user?: IUser;
  rating?: number;
  ratings?: IRating[];
}

export interface IRating {
  id: number;
  positive: boolean;
  topicId?: number;
  commentId?: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: number;
  password?: string;
}

export interface ITag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
