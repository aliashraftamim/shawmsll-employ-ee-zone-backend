export interface IContentForAdds {
  _id?: string;
  contentType: string;
  image?: string | null;
  content: string;
  date?: string | null;
  time?: string | null;
  isSent: boolean;
  targetUsers: {
    allUser: boolean;
    freePlanUser: boolean;
    premiumUser: boolean;
  };

  status: "active" | "inactive" | "archived" | "pending";

  isDeleted?: boolean;
}
