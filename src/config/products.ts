// Product configuration - SINGLE SOURCE OF TRUTH for pricing
// These values should match your Razorpay dashboard products

export const PRODUCT_CONFIG = {
  TECHY_PAD: {
    id: 'techypad-pro',
    name: 'Techy Pad',
    originalPrice: 10000, // INR
    salePrice: 6499, // INR
    currency: 'INR',
  }
} as const;

// Get the fixed price - NEVER trust client-side price
export const getProductPrice = (productId: string): number => {
  switch (productId) {
    case 'techypad-pro':
      return PRODUCT_CONFIG.TECHY_PAD.salePrice;
    default:
      throw new Error(`Unknown product: ${productId}`);
  }
};

// Validate that a price matches the expected price
export const validatePrice = (productId: string, claimedPrice: number): boolean => {
  try {
    const actualPrice = getProductPrice(productId);
    return actualPrice === claimedPrice;
  } catch {
    return false;
  }
};

// Get discount percentage
export const getDiscountPercent = (): number => {
  const { originalPrice, salePrice } = PRODUCT_CONFIG.TECHY_PAD;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};
