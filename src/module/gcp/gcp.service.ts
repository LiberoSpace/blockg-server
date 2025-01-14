import { OAuth2Client } from 'google-auth-library';

export class GcpService {
  private client: OAuth2Client;
  constructor() {
    this.client = new OAuth2Client();
  }

  async verifyOAuth2IdToken(token: string) {
    return await this.client.verifyIdToken({
      idToken: token,
    });
  }
}
