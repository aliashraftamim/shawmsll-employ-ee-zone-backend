export interface IJobSearchTracker {
  jobTitle: string;
  companyName: string;
  date: string;

  status: "applied" | "rejected" | "interviewed";
  isDeleted?: boolean;
}
