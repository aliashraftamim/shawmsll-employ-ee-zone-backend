export interface IBookmark {
  type: string;

  itemTitle: string;
  itemId: string;
  content?: string;

  category?: string;
  tags?: string[];
  isDeleted?: boolean;
}
