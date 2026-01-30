import { PlanType } from '@prisma/client';

export interface PlanLimits {
  maxProjects: number;
  maxCollaborators: number;
  canExport: boolean;
  canRealTimeEdit: boolean;
  canGenerateAI: boolean;
  canRemoveBranding: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  [PlanType.FREE]: {
    maxProjects: 1,
    maxCollaborators: 0,
    canExport: false,
    canRealTimeEdit: false,
    canGenerateAI: false,
    canRemoveBranding: false,
  },
  [PlanType.PRO]: {
    maxProjects: Infinity,
    maxCollaborators: 5,
    canExport: true,
    canRealTimeEdit: false,
    canGenerateAI: true,
    canRemoveBranding: true,
  },
  [PlanType.TEAM]: {
    maxProjects: Infinity,
    maxCollaborators: Infinity,
    canExport: true,
    canRealTimeEdit: true,
    canGenerateAI: true,
    canRemoveBranding: true,
  },
  [PlanType.ENTERPRISE]: {
    maxProjects: Infinity,
    maxCollaborators: Infinity,
    canExport: true,
    canRealTimeEdit: true,
    canGenerateAI: true,
    canRemoveBranding: true,
  },
};

export function getPlanLimits(plan: PlanType | undefined | null): PlanLimits {
  return PLAN_LIMITS[plan || PlanType.FREE];
}
