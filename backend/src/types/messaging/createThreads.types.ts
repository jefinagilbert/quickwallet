export interface CreateThreadInput {
  user_ids: number[];
}

export interface IThreadReturnSuccessType {
  threadId: number;
}

export type IThreadReturntype = Promise<IThreadReturnSuccessType>;
