export type Project = {
  name: string;
  industry: string;
  targetAudience: string;
  marketingGoals: string;
  budget: string;
  availableChannels: string;
  competitors: string;
  usp: string;
  additionalInfo: string;
  startDate: Date;
  endDate: Date;
  year: string;
};

export type NodeData = {
  prompt: string;
  isIndependent: boolean;
};
