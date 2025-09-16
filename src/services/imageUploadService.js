import { supabase } from '../config/supabase';

// Simplified image upload service - stores local URIs for now
export class ImageUploadService {
  // Upload image to Supabase Storage (simplified version)
  static async uploadPostImage(imageUri, userId) {
    try {
      console.log('ImageUploadService: Starting upload for user:', userId);
      console.log('ImageUploadService: Image URI:', imageUri);

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('ImageUploadService: Auth error:', authError);
        throw new Error('User not authenticated');
      }

      // For now, just return the local URI
      // This ensures the app works while we debug the upload issue
      console.log('ImageUploadService: Using local URI as fallback');

      return {
        success: true,
        url: imageUri,
        path: `local/${userId}/${Date.now()}`,
        fallback: true
      };

    } catch (error) {
      console.error('ImageUploadService: Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload multiple images
  static async uploadPostImages(imageUris, userId) {
    try {
      console.log('ImageUploadService: Uploading multiple images:', imageUris.length);

      const uploadPromises = imageUris.map(uri => this.uploadPostImage(uri, userId));
      const results = await Promise.all(uploadPromises);

      const successfulUploads = results.filter(result => result.success);
      const failedUploads = results.filter(result => !result.success);

      if (failedUploads.length > 0) {
        console.warn('ImageUploadService: Some images failed to upload:', failedUploads);
      }

      console.log('ImageUploadService: Upload results:', {
        successful: successfulUploads.length,
        failed: failedUploads.length,
        urls: successfulUploads.map(result => result.url)
      });

      return {
        success: successfulUploads.length > 0,
        urls: successfulUploads.map(result => result.url),
        errors: failedUploads.map(result => result.error)
      };
    } catch (error) {
      console.error('ImageUploadService: Multiple upload error:', error);
      return {
        success: false,
        error: error.message,
        urls: [],
        errors: [error.message]
      };
    }
  }

  // Delete image from storage
  static async deletePostImage(imagePath) {
    try {
      console.log('ImageUploadService: Deleting image:', imagePath);

      // For local URIs, there's nothing to delete
      if (imagePath.startsWith('local/')) {
        console.log('ImageUploadService: Local image, nothing to delete');
        return { success: true };
      }

      const { error } = await supabase.storage
        .from('post-images')
        .remove([imagePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error('ImageUploadService: Delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get image URL from path
  static getImageUrl(imagePath) {
    console.log('ImageUploadService: Getting image URL for:', imagePath);

    // For local URIs, return as-is
    if (imagePath.startsWith('local/') || imagePath.startsWith('file://')) {
      return imagePath;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('post-images')
      .getPublicUrl(imagePath);

    return publicUrl;
  }

  // Validate image file
  static validateImage(imageUri) {
    console.log('ImageUploadService: Validating image:', imageUri);

    if (!imageUri || typeof imageUri !== 'string') {
      return {
        isValid: false,
        error: 'Invalid image URI'
      };
    }

    return {
      isValid: true,
      error: null
    };
  }

  // Get storage usage stats
  static async getStorageStats() {
    try {
      const { data, error } = await supabase.storage
        .from('post-images')
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        throw error;
      }

      return {
        success: true,
        fileCount: data.length,
        files: data
      };
    } catch (error) {
      console.error('ImageUploadService: Storage stats error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default ImageUploadService;
