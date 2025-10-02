export interface Login {
  device_fingerprint: string;
  login_identifier: string;
  password: string;
}

export interface Register {
  email: string;
  password: string;
  username: string;
}
