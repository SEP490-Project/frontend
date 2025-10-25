import { getItem, getRaw } from "@/libs/local-storage";

// JWT decode function to extract payload without verification
export const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Get brand ID from JWT token
export const getBrandIdFromToken = (): string | null => {
  const token = getRaw("access_token");
  if (!token) return null;

  const payload = decodeJWT(token);
  return payload?.user_id || null;
};

export const formatDate = (date: Date | string, type: "display" | "input" = "display"): string => {
  const d = new Date(date);

  if (type === "input") {
    return d.toLocaleDateString("en-CA"); // format yyyy-MM-dd
  }

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const convertNumberToCurrency = (
  amount: number,
  locale = "vn-VN",
  currency = "VND",
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

export const parseCurrencyToNumber = (currencyString: string): number => {
  const numberFormat = Number(currencyString.replace(/[^0-9,-]+/g, ""));
  return isNaN(numberFormat) ? 0 : numberFormat;
};

export const convertCurrencyForChart = (amount: number): string => {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`;
  }
  return `${amount.toString()}`;
};

export const getInitialAuthState = () => {
  const accessToken = getRaw("access_token");
  const refreshToken = getRaw("refresh_token");
  const user = getItem<{
    id: string;
    email: string;
    role: string;
    username: string;
    is_active: boolean;
    avatar: string;
  }>("user");

  return {
    loading: false,
    isAuthenticated: !!accessToken,
    role: user?.role ?? "",
    user: user ?? null,
    accessToken: accessToken ?? null,
    refreshToken: refreshToken ?? null,
    error: null as string | null,
  };
};
