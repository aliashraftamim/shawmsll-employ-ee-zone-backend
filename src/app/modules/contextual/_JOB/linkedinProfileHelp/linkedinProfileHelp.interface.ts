export interface ILinkedinProfileHelp {
  title: string;
  image: string;
  content: string;

  status: "active" | "inactive" | "archived" | "pending";
  isDeleted?: boolean;
}
