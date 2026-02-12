import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CancelTokenSource,
} from "axios";
import Cookies from "js-cookie";
import formDataAxiosTransformer from "./formDataAxiosTransformer";
import { getSession } from "next-auth/react";

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

/**
 * based on https://medium.com/@aditya.sawant122/creating-a-modular-http-service-in-react-step-by-step-guide-9b8d88747678
 */
class HttpService {
  private baseUrl: string;
  public instance: AxiosInstance;
  private sessionCache: { token: string | null; timestamp: number } | null =
    null;
  private readonly SESSION_CACHE_DURATION = 5 * 60 * 1000;
  private sessionPromise: Promise<string | null> | null = null;

  /**
   * Initializes a new instance of the HttpService class.
   */
  constructor() {
    if (process.env.baseUrl === undefined) {
      console.error("baseUrl is not defined in .env file", process.env.baseUrl);
      throw new Error("baseUrl is not defined in .env file");
    }
    this.baseUrl = process.env.baseUrl;
    this.instance = axios.create({
      baseURL: this.baseUrl,
      transformRequest: [formDataAxiosTransformer].concat(
        axios.defaults.transformRequest ? axios.defaults.transformRequest : [],
      ),
    });

    this.instance.interceptors.request.use(async (request) => {
      const token = await this.getCachedSessionToken();
      if (token && request) {
        request.headers.Authorization = `Bearer ${token}`;
      }
      return request;
    });
  }

  /**
   * Get cached session token with expiration check
   */
  private async getCachedSessionToken(): Promise<string | null> {
    const now = Date.now();

    if (
      this.sessionCache &&
      now - this.sessionCache.timestamp < this.SESSION_CACHE_DURATION
    ) {
      return this.sessionCache.token;
    }

    if (this.sessionPromise) {
      return this.sessionPromise;
    }

    this.sessionPromise = this.fetchSessionToken();

    try {
      const token = await this.sessionPromise;
      return token;
    } finally {
      this.sessionPromise = null;
    }
  }

  /**
   * Clears the in-memory cached session token to ensure next request
   * fetches a fresh token from NextAuth after login/logout.
   */
  public clearSessionCache(): void {
    this.sessionCache = null;
    this.sessionPromise = null;
  }

  private async fetchSessionToken(): Promise<string | null> {
    try {
      const session = await getSession();
      const token = session?.user?.token || null;
      
      this.sessionCache = {
        token,
        timestamp: Date.now(),
      };

      return token;
    } catch (error) {
      return null;
    }
  }

  /**
   * Gets the default headers for HTTP requests.
   * @returns {Record<string, string>} An object containing the default headers.
   */
  get defaultHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${Cookies.get("token")}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Makes an HTTP request.
   * @param {string} method - The HTTP method (e.g., 'get', 'post', 'put', 'delete').
   * @param {string} url - The URL to which the request is sent.
   * @param {any} [data] - The data to be sent as the request body.
   * @param {Record<string, string>} [customHeaders={}] - Custom headers to be sent with the request.
   * @returns {object} An object containing the request promise and a function to cancel the request.
   */
  request(
    method: string,
    url: string,
    data: any = null,
    customHeaders: Record<string, string> = {},
  ): { request: Promise<any>; cancel: () => void } {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const source: CancelTokenSource = axios.CancelToken.source();

    const config: AxiosRequestConfig = {
      method,
      url,
      headers,
      cancelToken: source.token,
    };

    if (data) {
      config.data = data;
    }

    return {
      request: this.instance(config),
      cancel: source.cancel,
    };
  }

  /**
   * Makes a GET request.
   * @param {string} url - The URL to which the request is sent.
   * @param {Record<string, string>} [customHeaders={}] - Custom headers to be sent with the request.
   * @returns {object} An object containing the request promise and a function to cancel the request.
   */
  get<T = any>(
    url: string,
    customHeaders: Record<string, string> = {},
  ): { request: Promise<T>; cancel: () => void } {
    return this.request("get", url, null, customHeaders);
  }

  /**
   * Makes a POST request.
   * @param {string} url - The URL to which the request is sent.
   * @param {any} data - The data to be sent as the request body.
   * @param {Record<string, string>} [customHeaders={}] - Custom headers to be sent with the request.
   * @returns {object} An object containing the request promise and a function to cancel the request.
   */
  post<T = any>(
    url: string,
    data: any,
    customHeaders: Record<string, string> = {},
  ): { request: Promise<T>; cancel: () => void } {
    return this.request("post", url, data, customHeaders);
  }

  /**
   * Makes a PUT request.
   * @param {string} url - The URL to which the request is sent.
   * @param {any} data - The data to be sent as the request body.
   * @param {Record<string, string>} [customHeaders={}] - Custom headers to be sent with the request.
   * @returns {object} An object containing the request promise and a function to cancel the request.
   */
  put<T = any>(
    url: string,
    data: any,
    customHeaders: Record<string, string> = {},
  ): { request: Promise<T>; cancel: () => void } {
    return this.request("put", url, data, customHeaders);
  }

  /**
   * Makes a PATCH request.
   * @param {string} url - The URL to which the request is sent.
   * @param {any} data - The data to be sent as the request body.
   * @param {Record<string, string>} [customHeaders={}] - Custom headers to be sent with the request.
   * @returns {object} An object containing the request promise and a function to cancel the request.
   */
  patch<T = any>(
    url: string,
    data?: any,
    customHeaders: Record<string, string> = {},
  ): { request: Promise<T>; cancel: () => void } {
    return this.request("patch", url, data, customHeaders);
  }

  /**
   * Makes a DELETE request.
   * @param {string} url - The URL to which the request is sent.
   * @param {Record<string, string>} [customHeaders={}] - Custom headers to be sent with the request.
   * @returns {object} An object containing the request promise and a function to cancel the request.
   */
  delete(
    url: string,
    customHeaders: Record<string, string> = {},
  ): { request: Promise<any>; cancel: () => void } {
    return this.request("delete", url, null, customHeaders);
  }
}

let apiInstance: HttpService | null = null;

export const api = (() => {
  if (!apiInstance) {
    apiInstance = new HttpService();
  }
  return apiInstance;
})();
