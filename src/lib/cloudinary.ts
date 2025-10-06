/**
 * Cloudinary utility functions for image uploads
 */

/**
 * Upload an image to Cloudinary
 * @param file The file to upload
 * @returns The uploaded image URL
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  try {
    // Check file size before uploading
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size exceeds 10MB limit');
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param files Array of files to upload
 * @returns Array of uploaded image URLs
 */
export async function uploadMultipleToCloudinary(files: File[]): Promise<string[]> {
  try {
    // Limit the number of concurrent uploads to prevent memory issues
    const MAX_CONCURRENT_UPLOADS = 2;
    const results: string[] = [];
    
    // Process files in batches
    for (let i = 0; i < files.length; i += MAX_CONCURRENT_UPLOADS) {
      const batch = files.slice(i, i + MAX_CONCURRENT_UPLOADS);
      const batchResults = await Promise.all(batch.map(file => uploadToCloudinary(file)));
      results.push(...batchResults);
    }
    
    return results;
  } catch (error) {
    console.error('Multiple uploads error:', error);
    throw new Error('Failed to upload multiple images to Cloudinary');
  }
}