import { SignJWT } from "jose";
import { importPKCS8 } from "jose";
import type {
  ServiceConfig,
  LoginInput,
  RegisterInput,
  LoginResponse,
  RegisterResponse,
  SwitchWorkspaceResponse,
  PermissionResult,
  WorkspacePermission,
  FullUserResponse,
  Workspace,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  InviteInput,
  CreateSubscriptionInput,
  SubscriptionResponse,
  CreateOrderInput,
  OrderResponse,
  ProductListResponse,
} from "./types";

export * from "./types";

const ACCOUNTS_ISSUER = "accounts.musakonttori.fi";
const SERVICE_EXPIRY = "5m";

async function importKey(pem: string): Promise<CryptoKey> {
  return importPKCS8(pem, "RS256");
}

export class AccountsClient {
  private apiUrl: string;
  private serviceName: string;
  private privateKey: string;
  private _keyPromise: Promise<CryptoKey> | null = null;

  constructor(config: ServiceConfig) {
    this.apiUrl = config.apiUrl.replace(/\/$/, "");
    this.serviceName = config.serviceName;
    this.privateKey = config.privateKey;
  }

  private async getKey(): Promise<CryptoKey> {
    if (!this._keyPromise) {
      this._keyPromise = importKey(this.privateKey);
    }
    return this._keyPromise;
  }

  async createServiceToken(): Promise<string> {
    const key = await this.getKey();
    return new SignJWT({ sub: this.serviceName })
      .setProtectedHeader({ alg: "RS256" })
      .setIssuedAt()
      .setExpirationTime(SERVICE_EXPIRY)
      .setIssuer(this.serviceName)
      .setAudience(ACCOUNTS_ISSUER)
      .sign(key);
  }

  private async headers(userToken: string): Promise<Record<string, string>> {
    const serviceToken = await this.createServiceToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceToken}`,
      "X-User-Token": `Bearer ${userToken}`,
    };
  }

  private async request<T>(
    path: string,
    options: RequestInit & { userToken?: string },
  ): Promise<T> {
    const { userToken, ...init } = options;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string>),
    };

    if (userToken) {
      const serviceToken = await this.createServiceToken();
      headers["Authorization"] = `Bearer ${serviceToken}`;
      headers["X-User-Token"] = `Bearer ${userToken}`;
    }

    const res = await fetch(`${this.apiUrl}${path}`, { ...init, headers });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        `Accounts API error ${res.status}: ${body.error ?? res.statusText}`,
      );
    }

    return res.json() as Promise<T>;
  }

  async login(input: LoginInput): Promise<LoginResponse> {
    return this.request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async register(input: RegisterInput): Promise<RegisterResponse> {
    return this.request<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async refreshToken(userToken: string): Promise<{ token: string }> {
    return this.request<{ token: string }>("/api/auth/refresh", {
      method: "POST",
      userToken,
      body: JSON.stringify({ token: userToken }),
    });
  }

  async getMe(userToken: string): Promise<FullUserResponse> {
    return this.request<FullUserResponse>("/api/me", {
      userToken,
    });
  }

  async getWorkspaces(userToken: string): Promise<Workspace[]> {
    return this.request<Workspace[]>("/api/me/workspaces", {
      userToken,
    });
  }

  async switchWorkspace(
    userToken: string,
    workspaceId: string,
  ): Promise<SwitchWorkspaceResponse> {
    return this.request<SwitchWorkspaceResponse>("/api/auth/switch-workspace", {
      method: "POST",
      userToken,
      body: JSON.stringify({ workspaceId }),
    });
  }

  async checkPermission(
    userToken: string,
    product: string,
    opts?: { action?: string; resourceType?: string; resourceId?: string },
  ): Promise<PermissionResult> {
    return this.request<PermissionResult>("/api/permissions/check", {
      method: "POST",
      userToken,
      body: JSON.stringify({ product, ...opts }),
    });
  }

  async listPermissions(
    userToken: string,
    product: string,
  ): Promise<WorkspacePermission[]> {
    return this.request<WorkspacePermission[]>("/api/permissions/list", {
      method: "POST",
      userToken,
      body: JSON.stringify({ product }),
    });
  }

  async getWorkspaceMembers(
    userToken: string,
    workspaceId: string,
  ): Promise<unknown[]> {
    return this.request<unknown[]>(`/api/workspaces/${workspaceId}/members`, {
      userToken,
    });
  }

  async createWorkspace(
    userToken: string,
    input: CreateWorkspaceInput,
  ): Promise<Workspace> {
    return this.request<Workspace>("/api/workspaces", {
      method: "POST",
      userToken,
      body: JSON.stringify(input),
    });
  }

  async updateWorkspace(
    userToken: string,
    slug: string,
    input: UpdateWorkspaceInput,
  ): Promise<Workspace> {
    return this.request<Workspace>(`/api/workspaces/${slug}`, {
      method: "PATCH",
      userToken,
      body: JSON.stringify(input),
    });
  }

  async inviteToWorkspace(
    userToken: string,
    slug: string,
    input: InviteInput,
  ): Promise<unknown> {
    return this.request<unknown>(`/api/workspaces/${slug}/invitations`, {
      method: "POST",
      userToken,
      body: JSON.stringify(input),
    });
  }

  async createSubscription(
    userToken: string,
    input: CreateSubscriptionInput,
  ): Promise<SubscriptionResponse> {
    return this.request<SubscriptionResponse>("/api/subscriptions", {
      method: "POST",
      userToken,
      body: JSON.stringify(input),
    });
  }

  async getSubscriptions(
    userToken: string,
    opts: { workspaceId?: string; userId?: string },
  ): Promise<{ subscriptions: SubscriptionResponse[] }> {
    const params = new URLSearchParams();
    if (opts.workspaceId) params.set("workspaceId", opts.workspaceId);
    if (opts.userId) params.set("userId", opts.userId);
    return this.request<{ subscriptions: SubscriptionResponse[] }>(
      `/api/subscriptions?${params.toString()}`,
      { userToken },
    );
  }

  async createOrder(
    userToken: string,
    input: CreateOrderInput,
  ): Promise<OrderResponse> {
    return this.request<OrderResponse>("/api/orders", {
      method: "POST",
      userToken,
      body: JSON.stringify(input),
    });
  }

  async getOrders(
    userToken: string,
    opts: { workspaceId?: string; userId?: string; page?: number; limit?: number },
  ): Promise<{ orders: OrderResponse[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    const params = new URLSearchParams();
    if (opts.workspaceId) params.set("workspaceId", opts.workspaceId);
    if (opts.userId) params.set("userId", opts.userId);
    if (opts.page) params.set("page", String(opts.page));
    if (opts.limit) params.set("limit", String(opts.limit));
    return this.request<{ orders: OrderResponse[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
      `/api/orders?${params.toString()}`,
      { userToken },
    );
  }

  async getProducts(productSlug?: string): Promise<ProductListResponse> {
    const params = productSlug ? `?product=${encodeURIComponent(productSlug)}` : "";
    return this.request<ProductListResponse>(`/api/products${params}`, {});
  }
}

export function createAccountsClient(config: ServiceConfig): AccountsClient {
  return new AccountsClient(config);
}
