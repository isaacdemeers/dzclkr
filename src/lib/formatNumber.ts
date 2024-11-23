export function formatNumber(num: number): string {
  if (num < 1000) return num.toFixed(1);
  
  const exp = Math.floor(Math.log10(num));
  const scientific = num / Math.pow(10, exp);
  
  if (exp < 6) return `${(num / Math.pow(10, Math.floor(exp / 3) * 3)).toFixed(1)}${['', 'K', 'M'][Math.floor(exp / 3)]}`;
  return `${scientific.toFixed(2)}e${exp}`;
}