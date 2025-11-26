export const PR_CATEGORY = {
  FEDERAL_LAW: "federal-law",
  STATE: "state",
};

export interface IPolicyRights {
  title: string;
  image: string;

  category: keyof typeof PR_CATEGORY;
  // If federal-law, then
  federalLaw?: {
    policyLaw: string;
    content: string;
  };

  // if state, then state
  state?: {
    stateName: string;
    stateTitle: string;
  };

  isDeleted?: boolean;
}
