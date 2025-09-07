export interface ISubscription {
  title: string;
  description: string;
  amount: number;
  features: [
    {
      title: string;
      active: boolean;
    },
  ];
  duration: number;
  isOneTime: boolean;
  durationType: "monthly" | "free" | "oneTime";
  services: string[];
  type: "basic" | "premium" | "advanced";
  status: "active" | "closed";
  isDeleted: boolean;
}
