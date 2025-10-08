export interface UserData {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login: Date;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: UserData;
}
