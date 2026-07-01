export type StatusType = 'Qabul qilindi' | 'Ko\'rib chiqilmoqda' | 'Bajarildi' | 'Rad etildi';

export interface Complaint {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  mahalla: string;
  problemType: string;
  description: string;
  createdAt: string;
  status: StatusType;
  deadlineAt: string; // 3 days (72 hours) from createdAt
  isFree?: boolean; // Always true
  officerName: string; // Assigned MFY official
  resolutionText?: string; // Resolution updates
  supportCount: number; // Citizens can upvote/support
  hasSupported?: boolean; // Client state trackers
}

export interface MahallaConfig {
  name: string;
  slug: string;
  population?: number;
}

export interface ProblemCategory {
  title: string;
  icon: string;
  description: string;
  commonIssues: string[];
}

export interface MfyStats {
  totalSubmitted: number;
  solvedCount: number;
  underReview: number;
  averageResolutionTimeHours: number;
}
