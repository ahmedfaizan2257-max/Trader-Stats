export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function parseNumericString(val: any): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  
  const str = String(val).trim();
  const isNegative = str.startsWith('-') || (str.includes('(') && str.includes(')'));
  
  // Remove spaces, currency symbols, commas, and parentheses. Keep minus and decimals.
  const cleaned = str.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;
  
  return isNegative ? -parsed : parsed;
}

export function formatCurrency(num: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'always',
    maximumFractionDigits: 0
  }).format(num);
}
