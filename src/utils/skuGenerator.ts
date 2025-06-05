// utils/skuGenerator.ts
export function generateRandomSKU(): string {
  const prefix = 'SKU';
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${randomPart}`;
}