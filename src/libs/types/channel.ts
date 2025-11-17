export interface Channel {
  id: string;
  name: string;
  description: string;
  home_page_url: string;
  is_active: boolean;
  token_info: TokenInfo;
}

export interface TokenInfo {
  access_token_expires_at: string;
  account_name: string;
  external_id: string;
  last_synced_at: string;
  refresh_token_expires_at: string;
}
