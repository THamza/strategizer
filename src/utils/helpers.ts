import { Project } from "./types";
import { projectSchema } from "./tsStyles";
import { Project as PrismaProject } from "@prisma/client";
import { z } from "zod";

export const abbreviateText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "…";
  }
  return text;
};

export const formatDateValue = (value: any): string | null => {
  if (value instanceof Date) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return value.toLocaleDateString("en-US", options);
  }
  return null;
};

export const getFormatedProject = (project: PrismaProject): Project => {
  const formattedProject = {
    name: project.name,
    industry: project.industry,
    targetAudience: project.targetAudience,
    marketingGoals: project.marketingGoals,
    budget: project.budget,
    availableChannels: project.availableChannels,
    competitors: project.competitors,
    usp: project.usp,
    additionalInfo: project.additionalInfo,
    startDate: z.date().parse(project.startDate), // Convert to ZodDate
    endDate: z.date().parse(project.endDate), // Convert to ZodDate
  };

  const validatedProject: Project = projectSchema.parse(
    formattedProject
  ) as Project;

  return validatedProject;
};
