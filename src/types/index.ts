export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebService {
  id: string;
  protocol: string;
  url: string;
  token: string;
  moodleUser: string;
  serviceName: string;
  route: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
  token?: string;
  webServices?: WebService[];
  urls?: { url: string }[];
  auditing?: AuditLog[];
  total?: number;
}

export interface ResetPasswordRequest {
  moodleUrl: string;
  email?: string;
  username?: string;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ChangePasswordRequest {
  token: string;
  newPassword: string;
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
}

export interface CreateWebServiceData {
  protocol: string;
  url: string;
  token: string;
  serviceName: string;
  moodleUser?: string;
  route?: string;
  isActive?: boolean;
}

export interface UpdateWebServiceData {
  protocol?: string;
  url?: string;
  token?: string;
  moodleUser?: string;
  serviceName?: string;
  route?: string;
  moodlePassword?: string;
  isActive?: boolean;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  subject: string;
  content: string;
  type: 'html' | 'text';
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
  isActive?: boolean;
  isDefault?: boolean;
}

export interface UpdateTemplateData {
  name?: string;
  description?: string;
  subject?: string;
  content?: string;
  type?: 'html' | 'text';
  isActive?: boolean;
  isDefault?: boolean;
}

export interface AuditLog {
  id: string;
  userId: number;
  username: string;
  email: string;
  webServiceId: string;
  tokenUser: string;
  useToken: boolean;
  emailSent: boolean;
  tokenExpiresAt: string;
  description: string;
  status: 'success' | 'error' | 'pending';
  created_at: string;
}
