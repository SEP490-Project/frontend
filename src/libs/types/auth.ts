export interface Login {
  login_identifier: string;
  password: string;
}

export interface Register {
  email: string;
  password: string;
  username: string;
  fullname: string;
}
