// Utility functions for image handling

/**
 * Validates and provides a safe image URL
 * @param imageUrl - The image URL to validate
 * @param fallback - Fallback URL if the image URL is invalid (default: '/logo.svg')
 * @returns A safe image URL
 */
export function getSafeImageUrl(imageUrl: string | undefined | null, fallback: string = '/logo.svg'): string {
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return fallback;
  }
  return imageUrl.trim();
}

/**
 * Processes an array of image URLs and filters out invalid ones
 * @param imageUrls - Array of image URLs to process
 * @param fallback - Fallback URL if no valid images (default: '/logo.svg')
 * @returns Array of valid image URLs with fallback if needed
 */
export function getSafeImageArray(imageUrls: string[] | undefined | null, fallback: string = '/logo.svg'): string[] {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    return [fallback];
  }
  
  const validImages = imageUrls.filter(img => img && typeof img === 'string' && img.trim() !== '');
  
  return validImages.length > 0 ? validImages : [fallback];
}

/**
 * Gets the first valid image from an array or comma-separated string
 * @param imageSource - Array of images or comma-separated string
 * @param fallback - Fallback URL if no valid image (default: '/logo.svg')
 * @returns A safe image URL
 */
export function getFirstValidImage(imageSource: string[] | string | undefined | null, fallback: string = '/logo.svg'): string {
  if (Array.isArray(imageSource)) {
    const validImages = imageSource.filter(img => img && typeof img === 'string' && img.trim() !== '');
    return validImages.length > 0 ? validImages[0] : fallback;
  }
  
  if (typeof imageSource === 'string' && imageSource.trim() !== '') {
    const images = imageSource.split(',').map(img => img.trim()).filter(img => img !== '');
    return images.length > 0 ? images[0] : fallback;
  }
  
  return fallback;
}
