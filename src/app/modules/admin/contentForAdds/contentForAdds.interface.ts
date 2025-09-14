export interface IContentForAdds {
  contentType: string;
  image?: string | null;
  content: string;
  date?: string | null;
  time?: string | null;
  targetUsers: {
    allUser: boolean;
    freePlanUser: boolean;
    premiumUser: boolean;
  };
  isDeleted?: boolean;
}
