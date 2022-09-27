interface Review {
  ID: number;
  Avatar: string;
  Email: string;
  Html: string;
  Nickname: string;
  Parent_id: number;
  Post_id: string;
  Status: string;
  UpdatedAt: string;
}

export interface IReview extends Review {
  openReply?: boolean;
}

export interface InitState {
  msg: string;
  reviews: IReview[];
}

export interface Response {
  msg: string;
  data: Review | Review[];
  sucesss: boolean;
}
