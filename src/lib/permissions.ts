export enum PlanType {
  FREE = 'FREE',
  PRO = 'PRO',
  TEAM = 'TEAM',
  ENTERPRISE = 'ENTERPRISE',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
}

export interface PlanLimits {
  maxProjects: number;
  maxCollaborators: number;
  maxAIGenerationsPerMonth: number;
  canExport: boolean;
  canRealTimeEdit: boolean;
  canGenerateAI: boolean;
  canRemoveBranding: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  [PlanType.FREE]: {
    maxProjects: 1,
    maxCollaborators: 0,
    maxAIGenerationsPerMonth: 5,
    canExport: false,
    canRealTimeEdit: false,
    canGenerateAI: false, // Technically false, but if we enable it, it's limited
    canRemoveBranding: false,
  },
  [PlanType.PRO]: {
    maxProjects: Infinity,
    maxCollaborators: 5,
    maxAIGenerationsPerMonth: 100,
    canExport: true,
    canRealTimeEdit: false,
    canGenerateAI: true,
    canRemoveBranding: true,
  },
  [PlanType.TEAM]: {
    maxProjects: Infinity,
    maxCollaborators: Infinity,
    maxAIGenerationsPerMonth: 1000,
    canExport: true,
    canRealTimeEdit: true,
    canGenerateAI: true,
    canRemoveBranding: true,
  },
  [PlanType.ENTERPRISE]: {
    maxProjects: Infinity,
    maxCollaborators: Infinity,
    maxAIGenerationsPerMonth: Infinity,
    canExport: true,
    canRealTimeEdit: true,
    canGenerateAI: true,
    canRemoveBranding: true,
  },
};

export const OWNER_LIMITS: PlanLimits = {
  maxProjects: Infinity,
  maxCollaborators: Infinity,
  maxAIGenerationsPerMonth: Infinity,
  canExport: true,
  canRealTimeEdit: true,
  canGenerateAI: true,
  canRemoveBranding: true,
};

export function getPlanLimits(plan: PlanType | undefined | null, role?: string): PlanLimits {
  if (role === UserRole.OWNER) {
    return OWNER_LIMITS;
  }
  return PLAN_LIMITS[plan || PlanType.FREE];
}
