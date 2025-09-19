export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ResetPasswordRequest {
  moodleUrl: string;
  email?: string;
  username?: string;
}

export interface ResetPasswordForm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalResets: number;
  pendingResets: number;
}

export interface MoodleUser {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  fullname: string;
}

export interface MoodleUrl {
  id: number;
  name: string;
  url: string;
  token: string;
  status: 'active' | 'inactive';
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  type: 'reset' | 'confirmation' | 'notification';
  status: 'active' | 'inactive';
}

export interface WebService {
  id: number;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  status: 'active' | 'inactive';
}

export interface AuditLog {
  id: number;
  userId: number;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

// Template interface updated to match VIZIOON project
export interface Template {
  id: string;
  name: string;
  description?: string;
  subject: string;
  content: string;
  type: 'html' | 'text';
  categoria?: 'valid' | 'suspended' | 'unconfirmed';
  isActive: boolean;
  isDefault?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateData {
  name: string;
  description?: string;
  subject: string;
  content: string;
  type: 'html' | 'text';
  categoria?: 'valid' | 'suspended' | 'unconfirmed';
  isActive?: boolean;
  isDefault?: boolean;
}

export interface UpdateTemplateData {
  name?: string;
  description?: string;
  subject?: string;
  content?: string;
  type?: 'html' | 'text';
  categoria?: 'valid' | 'suspended' | 'unconfirmed';
  isActive?: boolean;
  isDefault?: boolean;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: 'active' | 'inactive';
}

export interface CreateWebServiceData {
  serviceName: string;
  url: string;
  token: string;
  description?: string;
}

export interface UpdateWebServiceData {
  serviceName?: string;
  url?: string;
  token?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ChangePasswordRequest {
  token: string;
  newPassword: string;
}