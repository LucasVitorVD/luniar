import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpClient, InjectHttpClient } from '@nestjs/http-client';

export interface IgdbTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

@Injectable()
export class IgdbAuthService {
  private readonly logger = new Logger(IgdbAuthService.name);
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(
    @InjectHttpClient('igdb-auth') private readonly httpClient: HttpClient,
  ) {}

  private isTokenExpired(): boolean {
    return !this.accessToken || Date.now() >= this.tokenExpiresAt - 60_000;
  }

  async getValidToken(): Promise<string> {
    if (!this.isTokenExpired()) {
      return this.accessToken as string;
    }

    const clientId = process.env.IGDB_CLIENT_ID;
    const clientSecret = process.env.IGDB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new BadRequestException(
        'IGDB_CLIENT_ID and IGDB_CLIENT_SECRET must be configured',
      );
    }

    try {
      const response: any = await this.httpClient.post(
        '/oauth2/token',
        {
          body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
          }).toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const data: IgdbTokenResponse = response.data;
      const status: number = response.status;

      if (!data) {
        this.logger.error(`Twitch OAuth failed with status ${status}`);
        throw new BadRequestException('Failed to obtain IGDB access token');
      }

      this.accessToken = data.access_token;
      this.tokenExpiresAt = Date.now() + data.expires_in * 1000;

      this.logger.log(
        `IGDB token obtained, expires in ${data.expires_in} seconds`,
      );

      return this.accessToken;
    } catch (error: any) {
      this.logger.error('Error obtaining IGDB token', error.stack);
      throw new BadRequestException('Failed to authenticate with Twitch OAuth');
    }
  }

  clearToken(): void {
    this.accessToken = null;
    this.tokenExpiresAt = 0;
  }
}
