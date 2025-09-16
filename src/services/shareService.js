import { Alert, Platform, Linking, Share as RNShare } from 'react-native';

// Share service for cross-platform sharing functionality
export class ShareService {
  // Share post to various platforms
  static async sharePost(post) {
    try {
      const shareContent = {
        title: 'Check out this post from PeakHeight Tribe!',
        message: `${post.content}\n\nShared from PeakHeight Tribe`,
        url: `https://peakheight.app/tribe/post/${post.id}`,
      };

      const result = await RNShare.share({
        title: shareContent.title,
        message: shareContent.message,
        url: shareContent.url,
      });

      if (result.action === RNShare.sharedAction) {
        return { success: true, result };
      } else if (result.action === RNShare.dismissedAction) {
        return { success: false, error: 'User cancelled sharing' };
      }
    } catch (error) {
      console.error('Share error:', error);
      return { success: false, error: error.message };
    }
  }

  // Share to specific platform using deep links
  static async shareToPlatform(post, platform) {
    try {
      const shareContent = {
        title: 'Check out this post from PeakHeight Tribe!',
        message: `${post.content}\n\nShared from PeakHeight Tribe`,
        url: `https://peakheight.app/tribe/post/${post.id}`,
      };

      let shareUrl = '';
      let shareMessage = shareContent.message;

      // Platform-specific deep links
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareContent.url)}`;
          break;
        case 'instagram':
          // Instagram doesn't support direct text sharing via URL scheme
          // We'll use the general share and let user copy to Instagram
          return this.sharePost(post);
        case 'whatsapp':
          shareUrl = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(shareContent.url)}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareContent.url)}`;
          break;
        default:
          return this.sharePost(post);
      }

      // Check if the app is installed and open it
      const canOpen = await Linking.canOpenURL(shareUrl);
      if (canOpen) {
        await Linking.openURL(shareUrl);
        return { success: true };
      } else {
        // Fallback to general share if app not installed
        Alert.alert(
          'App Not Installed',
          `${platform} is not installed on your device. Using general share instead.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Share Anyway', onPress: () => this.sharePost(post) }
          ]
        );
        return { success: false, error: `${platform} app not installed` };
      }
    } catch (error) {
      console.error(`Share to ${platform} error:`, error);
      return { success: false, error: error.message };
    }
  }

  // Share app invite
  static async shareAppInvite() {
    try {
      const shareContent = {
        title: 'Join me on PeakHeight!',
        message: 'I\'m using PeakHeight to track my height growth journey. Join me and start your own journey!',
        url: 'https://peakheight.app/invite',
      };

      const result = await RNShare.share({
        title: shareContent.title,
        message: shareContent.message,
        url: shareContent.url,
      });

      if (result.action === RNShare.sharedAction) {
        return { success: true, result };
      } else if (result.action === RNShare.dismissedAction) {
        return { success: false, error: 'User cancelled sharing' };
      }
    } catch (error) {
      console.error('Share app invite error:', error);
      return { success: false, error: error.message };
    }
  }

  // Share achievement
  static async shareAchievement(achievement) {
    try {
      const shareContent = {
        title: 'I just achieved a milestone on PeakHeight!',
        message: `🎉 ${achievement.title}\n\n${achievement.description}\n\nJoin me on PeakHeight to start your own journey!`,
        url: 'https://peakheight.app/achievements',
      };

      const result = await RNShare.share({
        title: shareContent.title,
        message: shareContent.message,
        url: shareContent.url,
      });

      if (result.action === RNShare.sharedAction) {
        return { success: true, result };
      } else if (result.action === RNShare.dismissedAction) {
        return { success: false, error: 'User cancelled sharing' };
      }
    } catch (error) {
      console.error('Share achievement error:', error);
      return { success: false, error: error.message };
    }
  }

  // Share progress update
  static async shareProgress(progressData) {
    try {
      const shareContent = {
        title: 'My height growth progress on PeakHeight!',
        message: `📏 Height Progress Update\n\nCurrent: ${progressData.currentHeight}\nTarget: ${progressData.targetHeight}\n\nJoin me on PeakHeight to track your own journey!`,
        url: 'https://peakheight.app/progress',
      };

      const result = await RNShare.share({
        title: shareContent.title,
        message: shareContent.message,
        url: shareContent.url,
      });

      if (result.action === RNShare.sharedAction) {
        return { success: true, result };
      } else if (result.action === RNShare.dismissedAction) {
        return { success: false, error: 'User cancelled sharing' };
      }
    } catch (error) {
      console.error('Share progress error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if platform is available (simplified version)
  static async isPlatformAvailable(platform) {
    try {
      const platformUrls = {
        whatsapp: 'whatsapp://send',
        facebook: 'fb://',
        twitter: 'twitter://',
        instagram: 'instagram://',
        linkedin: 'linkedin://',
      };

      const url = platformUrls[platform];
      if (!url) return false;

      const canOpen = await Linking.canOpenURL(url);
      return canOpen;
    } catch (error) {
      console.error('Check platform availability error:', error);
      return false;
    }
  }

  // Get available platforms
  static async getAvailablePlatforms() {
    try {
      const platforms = ['whatsapp', 'facebook', 'twitter', 'instagram', 'linkedin'];
      const availablePlatforms = [];

      for (const platform of platforms) {
        const isAvailable = await this.isPlatformAvailable(platform);
        if (isAvailable) {
          availablePlatforms.push(platform);
        }
      }

      return availablePlatforms;
    } catch (error) {
      console.error('Get available platforms error:', error);
      return [];
    }
  }
}

export default ShareService;
