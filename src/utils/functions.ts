// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatCurrency = (amount: number | any) => {
  if (typeof amount !== "number") {
    return amount;
  }
  return Math.round(amount).toLocaleString();
};
