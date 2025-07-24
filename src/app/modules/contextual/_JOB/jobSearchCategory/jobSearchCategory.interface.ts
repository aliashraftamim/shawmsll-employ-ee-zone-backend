export interface IJobSearchCategory {
  title: string;
  image: string;
  content: string;
  doc: string;

  status: "active" | "inactive" | "archived" | "pending";
  isDeleted?: boolean;
}
