"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AccountsClient: () => AccountsClient,
  createAccountsClient: () => createAccountsClient
});
module.exports = __toCommonJS(src_exports);

// src/client.ts
var import_jose = require("jose");
var import_jose2 = require("jose");
var ACCOUNTS_ISSUER = "accounts.musakonttori.fi";
var SERVICE_EXPIRY = "5m";
async function importKey(pem) {
  return (0, import_jose2.importPKCS8)(pem, "RS256");
}
var AccountsClient = class {
  apiUrl;
  serviceName;
  privateKey;
  _keyPromise = null;
  constructor(config) {
    this.apiUrl = config.apiUrl.replace(/\/$/, "");
    this.serviceName = config.serviceName;
    this.privateKey = config.privateKey;
  }
  async getKey() {
    if (!this._keyPromise) {
      this._keyPromise = importKey(this.privateKey);
    }
    return this._keyPromise;
  }
  async createServiceToken() {
    const key = await this.getKey();
    return new import_jose.SignJWT({ sub: this.serviceName }).setProtectedHeader({ alg: "RS256" }).setIssuedAt().setExpirationTime(SERVICE_EXPIRY).setIssuer(this.serviceName).setAudience(ACCOUNTS_ISSUER).sign(key);
  }
  async headers(userToken) {
    const serviceToken = await this.createServiceToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceToken}`,
      "X-User-Token": `Bearer ${userToken}`
    };
  }
  async request(path, options) {
    const { userToken, ...init } = options;
    const headers = {
      "Content-Type": "application/json",
      ...init.headers
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
        `Accounts API error ${res.status}: ${body.error ?? res.statusText}`
      );
    }
    return res.json();
  }
  async login(input) {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(input)
    });
  }
  async register(input) {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(input)
    });
  }
  async refreshToken(userToken) {
    return this.request("/api/auth/refresh", {
      method: "POST",
      userToken,
      body: JSON.stringify({})
    });
  }
  async getMe(userToken) {
    return this.request("/api/me", {
      userToken
    });
  }
  async getWorkspaces(userToken) {
    return this.request("/api/me/workspaces", {
      userToken
    });
  }
  async checkPermission(userToken, product, opts) {
    return this.request("/api/permissions/check", {
      method: "POST",
      userToken,
      body: JSON.stringify({ product, ...opts })
    });
  }
  async listPermissions(userToken, product) {
    return this.request("/api/permissions/list", {
      method: "POST",
      userToken,
      body: JSON.stringify({ product })
    });
  }
  async getWorkspaceMembers(userToken, workspaceId) {
    return this.request(`/api/workspaces/${workspaceId}/members`, {
      userToken
    });
  }
  async createWorkspace(userToken, input) {
    return this.request("/api/workspaces", {
      method: "POST",
      userToken,
      body: JSON.stringify(input)
    });
  }
  async updateWorkspace(userToken, slug, input) {
    return this.request(`/api/workspaces/${slug}`, {
      method: "PATCH",
      userToken,
      body: JSON.stringify(input)
    });
  }
  async inviteToWorkspace(userToken, slug, input) {
    return this.request(`/api/workspaces/${slug}/invitations`, {
      method: "POST",
      userToken,
      body: JSON.stringify(input)
    });
  }
  async createSubscription(userToken, input) {
    return this.request("/api/subscriptions", {
      method: "POST",
      userToken,
      body: JSON.stringify(input)
    });
  }
  async getSubscriptions(userToken, opts) {
    const params = new URLSearchParams();
    if (opts.workspaceId) params.set("workspaceId", opts.workspaceId);
    if (opts.userId) params.set("userId", opts.userId);
    return this.request(
      `/api/subscriptions?${params.toString()}`,
      { userToken }
    );
  }
  async createOrder(userToken, input) {
    return this.request("/api/orders", {
      method: "POST",
      userToken,
      body: JSON.stringify(input)
    });
  }
  async getOrders(userToken, opts) {
    const params = new URLSearchParams();
    if (opts.workspaceId) params.set("workspaceId", opts.workspaceId);
    if (opts.userId) params.set("userId", opts.userId);
    if (opts.page) params.set("page", String(opts.page));
    if (opts.limit) params.set("limit", String(opts.limit));
    return this.request(
      `/api/orders?${params.toString()}`,
      { userToken }
    );
  }
  async getProducts(productSlug) {
    const params = productSlug ? `?product=${encodeURIComponent(productSlug)}` : "";
    return this.request(`/api/products${params}`);
  }
};
function createAccountsClient(config) {
  return new AccountsClient(config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AccountsClient,
  createAccountsClient
});
//# sourceMappingURL=index.js.map