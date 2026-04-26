const inrFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export function formatCurrencyFromCents(value: number) {
  return `₹${inrFormatter.format(value)}`;
}

export function formatDisplayId(prefix: string, value: string, length = 6) {
  return `${prefix}-${value.slice(-length).toUpperCase()}`;
}
