export interface UserData {
  id: string;
  avatar: string;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: Date | null;
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
