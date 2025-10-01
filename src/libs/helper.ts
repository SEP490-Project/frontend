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
