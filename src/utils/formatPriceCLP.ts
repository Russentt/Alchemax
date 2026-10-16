const priceFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
});

export function formatPriceCLP(price: number): string {
  return priceFormatter.format(price);
}
