import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}

type Headers = {
  headers: {
    'X-API-Auth': string;
    'X-API-Timestamp': string;
  };
};

@Injectable()
export class WattsenseApiAuthenticator {
  private method: HttpMethods;
  private domain = 'https://api.wattsense.com';
  private relativePath: string;
  private timestamp: number;
  private apiSecret: string;
  private apiKey: string;
  private hmacHash: string;
  public url: string;

  constructor(method: HttpMethods, apiSecret: string, apiKey: string) {
    this.method = method;
    this.apiSecret = apiSecret;
    this.apiKey = apiKey;
  }
  private genereteCurrentTimestamp(): number {
    return new Date().getTime();
  }
  private messageToSign(): string[] {
    return [this.method, this.relativePath, this.timestamp.toString()];
  }

  private generateHmacHash() {
    return crypto
      .createHmac('sha512', Buffer.from(this.apiSecret))
      .update(Buffer.from(this.messageToSign().join('\n')));
  }
  private convertHmacToString() {
    const hmacHashBuffer = this.generateHmacHash().digest('base64');
    this.hmacHash = hmacHashBuffer.toString();
  }

  public getUrl(relativePath: string): string {
    
    this.relativePath = relativePath;    
    return this.domain + this.relativePath;
  }

  public generateApiConfig(): Headers {
    this.timestamp = this.genereteCurrentTimestamp();

    this.convertHmacToString();
    
    
    return {
      headers: {
        'X-API-Auth': `${this.apiKey}:${this.hmacHash}`,
        'X-API-Timestamp': this.timestamp.toString(),
      },
    };
  }
}
