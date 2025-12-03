import axios, { AxiosInstance, AxiosResponse } from 'axios';
import PQueue from 'p-queue';

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private queue: PQueue;

  constructor(rateLimit: number = 500, timeout: number = 10000) {
    this.axiosInstance = axios.create({
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    this.queue = new PQueue({
      interval: rateLimit,
      intervalCap: 1,
    });
  }

  async get(url: string, retries: number = 3): Promise<string> {
    return this.queue.add(async () => {
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response: AxiosResponse<string> = await this.axiosInstance.get(url);
          return response.data;
        } catch (error) {
          lastError = error as Error;
          if (attempt < retries) {
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      throw new Error(`Failed to fetch ${url} after ${retries} attempts: ${lastError?.message}`);
    }) as Promise<string>;
  }
}
