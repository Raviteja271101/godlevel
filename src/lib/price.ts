/** "€64,95", as the reference writes prices. */
export const formatPrice = (n: number) => `€${n.toFixed(2).replace(".", ",")}`;
