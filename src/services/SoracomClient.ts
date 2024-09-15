import axios, { AxiosInstance } from "axios";
import { Sim } from "../types/Sim";

interface QueryParams {
  [key: string]: string;
}

export class UnauthenticatedError extends Error {}
export class UserError extends Error {}
export class ServerError extends Error {}

export class SoracomClient {
  private apiKey: string;
  private token: string;
  public coverageType: string;
  private httpClient: AxiosInstance;

  constructor() {
    this.coverageType = "";
    this.apiKey = "";
    this.token = "";
    const httpClient = axios.create();

    httpClient.interceptors.request.use(async (request: any) => {
      const authenticated = await this.checkIfAuthenticated();

      if (!authenticated) {
        throw new UnauthenticatedError("Not authenticated");
      }

      request.url = this.url(request.url);
      request.headers["X-Soracom-API-Key"] = this.apiKey;
      request.headers["X-Soracom-Token"] = this.token;
      return request;
    });

    httpClient.interceptors.response.use(async (response: any) => {
      if (response.status === 401) {
        throw new UnauthenticatedError("Not authenticated");
      }

      return response;
    });
    this.httpClient = httpClient;
  }

  private baseUrl(): string {
    return this.coverageType === "g"
      ? `https://g.api.soracom.io/v1`
      : `https://api.soracom.io/v1`;
  }

  private url(path: string): string {
    return `${this.baseUrl()}${path}`;
  }

  async authenticate(
    authKeyId: string,
    authKey: string,
    coverageType: string
  ): Promise<void> {
    if (coverageType.startsWith("g")) {
      this.coverageType = "g";
    } else {
      this.coverageType = "jp";
    }

    const response = await axios.post(this.url("/auth"), {
      authKeyId,
      authKey,
    });

    if (response.status !== 200) {
      throw new UnauthenticatedError("Failed to authenticate");
    }

    this.apiKey = response.data.apiKey;
    this.token = response.data.token;
  }

  async checkIfAuthenticated(): Promise<boolean> {
    if (!this.apiKey || !this.token) {
      return false;
    }
    return true;
  }

  public async searchSimsByName(name: string): Promise<Sim[]> {
    const params: QueryParams = {
      name,
    };
    return this.searchSims(params);
  }

  public async searchSimsByGroup(group: string): Promise<Sim[]> {
    const params: QueryParams = {
      group,
    };
    return this.searchSims(params);
  }

  public async searchSimsByTag(tag: string): Promise<Sim[]> {
    const params: QueryParams = {
      tag,
    };
    return this.searchSims(params);
  }

  public async searchBimsByStatus(status: string): Promise<Sim[]> {
    const params: QueryParams = {
      status,
    };
    return this.searchSims(params);
  }

  public async searchSimsBySessionStatus(
    sessionStatus: string
  ): Promise<Sim[]> {
    const params: QueryParams = {
      sessionStatus,
    };
    return this.searchSims(params);
  }

  public async searchSimsBySubscriptionStatus(
    subscription: string
  ): Promise<Sim[]> {
    const params: QueryParams = {
      subscription,
    };
    return this.searchSims(params);
  }

  public async searchSims(
    params: QueryParams,
    data?: Sim[],
    lastEvaluatedKey?: string
  ): Promise<Sim[]> {
    console.log(params);
    console.log(data);

    if (!data) {
      data = [];
    }

    if (lastEvaluatedKey) {
      params.lastEvaluatedKey = lastEvaluatedKey;
    }

    const result = await this.httpClient.get(`/query/sims`, {
      params,
    });

    console.log(result);

    if (!result.data) {
      throw new Error("Failed to fetch sims");
    }

    data.push(...result.data);

    if (!result.data.lastEvaluatedKey) {
      return data as Sim[];
    }

    return this.searchSims(params, data, result.data.lastEvaluatedKey);
  }

  /**
   * getSim
   * @param simId
   */
  public async getSim(simId: string): Promise<Sim> {
    const result = await this.httpClient.get(`/sims/${simId}`);

    if (result.status !== 200) {
      throw new ServerError("Failed to fetch sim");
    }

    return result.data as Sim;
  }
}
