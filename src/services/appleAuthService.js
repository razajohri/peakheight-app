import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { supabase } from '../config/supabase';

export class AppleAuthService {
  // Apple Sign-In configuration
  static getAppleAuthConfig() {
    return {
      clientId: 'com.peakheight.app', // Your bundle identifier
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'peakheight',
        path: 'auth',
      }),
      responseType: AuthSession.ResponseType.Code,
      scopes: ['name', 'email'],
      additionalParameters: {},
      customParameters: {
        response_mode: 'form_post',
      },
    };
  }

  // Generate code verifier for PKCE
  static async generateCodeVerifier() {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      { encoding: Crypto.CryptoEncoding.BASE64URL }
    );
  }

  // Generate code challenge
  static async generateCodeChallenge(codeVerifier) {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      codeVerifier,
      { encoding: Crypto.CryptoEncoding.BASE64URL }
    );
  }

  // Sign in with Apple
  static async signInWithApple() {
    try {
      const config = this.getAppleAuthConfig();
      const codeVerifier = await this.generateCodeVerifier();
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);

      // Create the authorization request
      const request = new AuthSession.AuthRequest({
        clientId: config.clientId,
        scopes: config.scopes,
        redirectUri: config.redirectUri,
        responseType: config.responseType,
        codeChallenge,
        codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
        additionalParameters: config.additionalParameters,
        extraParams: config.customParameters,
      });

      // Start the authentication flow
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
      });

      if (result.type === 'success') {
        // Exchange authorization code for tokens
        const tokenResult = await this.exchangeCodeForTokens(
          result.params.code,
          codeVerifier,
          config.redirectUri
        );

        if (tokenResult.accessToken) {
          // Sign in to Supabase with Apple token
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: tokenResult.idToken,
            nonce: result.params.nonce,
          });

          if (error) throw error;

          return {
            success: true,
            user: data.user,
            session: data.session,
            appleUser: tokenResult.user,
          };
        }
      }

      return {
        success: false,
        error: 'Authentication was cancelled or failed',
      };
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      return {
        success: false,
        error: error.message || 'Apple Sign-In failed',
      };
    }
  }

  // Exchange authorization code for access token
  static async exchangeCodeForTokens(code, codeVerifier, redirectUri) {
    try {
      const response = await fetch('https://appleid.apple.com/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: 'com.peakheight.app',
          client_secret: await this.generateClientSecret(),
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || 'Token exchange failed');
      }

      return data;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  }

  // Generate client secret (you'll need to implement this with your Apple Developer credentials)
  static async generateClientSecret() {
    // For now, use Supabase's built-in Apple OAuth
    // In production, you should generate JWT with your Apple Developer credentials
    // This is handled by Supabase's OAuth flow
    return null;
  }

  // Check if Apple Sign-In is available
  static async isAvailable() {
    try {
      // Check if running on iOS and if Apple Sign-In is available
      const { Platform } = require('react-native');
      if (Platform.OS !== 'ios') {
        return false;
      }

      // Additional checks can be added here
      return true;
    } catch (error) {
      return false;
    }
  }
}
