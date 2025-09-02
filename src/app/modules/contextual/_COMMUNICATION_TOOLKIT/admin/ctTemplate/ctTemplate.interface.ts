export interface ICtTemplate {
  title: string;
  image: string;
  tone: string[];
  message: string;

  status: "active" | "inactive" | "archived" | "pending";
  isDeleted?: boolean;
}
