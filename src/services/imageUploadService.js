import { supabase } from '../config/supabase';
import * as FileSystem from 'expo-file-system';

// Image upload service for Supabase Storage
export class ImageUploadService {
  // Upload image to Supabase Storage
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

      // Skip if already a web URL (already uploaded)
      if (imageUri && (imageUri.startsWith('http://') || imageUri.startsWith('https://'))) {
        console.log('ImageUploadService: Already a web URL, skipping upload');
        return {
          success: true,
          url: imageUri,
          path: imageUri,
          fallback: false
        };
      }

      // Determine MIME type from URI
      // Note: HEIC files from iOS should be converted to JPEG by ImagePicker
      // If we still get HEIC, we'll treat it as JPEG since ImagePicker handles conversion
      let mimeType = 'image/jpeg';
      let fileExtension = 'jpg';
      
      const uriLower = imageUri.toLowerCase();
      if (uriLower.endsWith('.png')) {
        mimeType = 'image/png';
        fileExtension = 'png';
      } else if (uriLower.endsWith('.heic') || uriLower.endsWith('.heif')) {
        // HEIC files should be converted to JPEG, but if we get one, treat as JPEG
        // The actual conversion happens in ImagePicker, so the file is likely JPEG already
        mimeType = 'image/jpeg';
        fileExtension = 'jpg';
        console.log('ImageUploadService: HEIC file detected, treating as JPEG (ImagePicker should have converted it)');
      } else if (uriLower.endsWith('.webp')) {
        mimeType = 'image/webp';
        fileExtension = 'webp';
      }

      // Generate unique file path
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const filePath = `${userId}/${timestamp}-${randomId}.${fileExtension}`;

      console.log('ImageUploadService: Uploading to path:', filePath, 'MIME type:', mimeType);

      // Read file as base64 and convert to blob for upload
      let fileData;
      try {
        fileData = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log('ImageUploadService: File read successfully, size:', fileData.length, 'characters');
      } catch (readError) {
        console.error('ImageUploadService: Error reading file:', readError);
        throw new Error(`Failed to read image file: ${readError.message}`);
      }

      // Convert base64 to binary data
      const byteCharacters = atob(fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Upload to Supabase Storage
      // Supabase accepts ArrayBuffer/Uint8Array in React Native
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, byteArray, {
          contentType: mimeType,
          upsert: false,
        });

      if (uploadError) {
        console.error('ImageUploadService: Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('ImageUploadService: Upload successful:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      console.log('ImageUploadService: Public URL:', publicUrl);

      return {
        success: true,
        url: publicUrl,
        path: filePath,
        fallback: false
      };

    } catch (error) {
      console.error('ImageUploadService: Error:', error);
      return {
        success: false,
        error: error.message,
        url: null,
        path: null
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

      // For local URIs or invalid paths, there's nothing to delete
      if (!imagePath || imagePath.startsWith('local/') || imagePath.startsWith('file://')) {
        console.log('ImageUploadService: Local/invalid image path, nothing to delete');
        return { success: true };
      }

      // Extract path from full URL if needed
      let storagePath = imagePath;
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        // Extract path from Supabase Storage URL
        // URL format: https://[project].supabase.co/storage/v1/object/public/post-images/[path]
        const urlParts = imagePath.split('/post-images/');
        if (urlParts.length > 1) {
          storagePath = urlParts[1];
        } else {
          console.warn('ImageUploadService: Could not extract path from URL:', imagePath);
          return { success: false, error: 'Invalid URL format' };
        }
      }

      const { error } = await supabase.storage
        .from('post-images')
        .remove([storagePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }

      console.log('ImageUploadService: Image deleted successfully:', storagePath);
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

    // If already a full URL, return as-is
    if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
      return imagePath;
    }

    // For local URIs or invalid paths, return null (will be filtered out)
    if (!imagePath || imagePath.startsWith('local/') || imagePath.startsWith('file://')) {
      // Only log warning if it's not a known iOS cache path (these are expected to be filtered)
      if (!imagePath.includes('/Library/Caches/')) {
        console.warn('ImageUploadService: Invalid image path:', imagePath);
      }
      return null;
    }

    // Get public URL from Supabase Storage
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
