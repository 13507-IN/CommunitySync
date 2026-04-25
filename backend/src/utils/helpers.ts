export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Role = 'ngo' | 'volunteer' | 'govt' | 'admin';

export type ReportStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'verified' | 'closed' | 'reopened';

export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'verified' | 'closed';

export type Urgency = 'low' | 'medium' | 'high';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export function formatPagination(page: number = 1, limit: number = 10): PaginationParams {
  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
  };
}

export function paginate<T>(data: T[], total: number, page: number, limit: number): PaginatedResponse<T> {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}