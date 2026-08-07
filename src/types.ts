export interface UserPayload {
  sub: string;
  email: string;
  name?: string;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  locale: string | null;
  timezone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  country: string | null;
  status: string;
  role: string;
  productRoles: string[];
}

export interface Membership {
  id: string;
  workspaceId: string;
  role: string;
  status: string;
  joinedAt: Date;
  workspace: {
    id: string;
    name: string;
    slug: string;
    type: string;
  };
  productRoles: Array<{
    role: {
      productId: string;
      slug: string;
      name: string;
      product: { slug: string; name: string };
    };
    resourceType: string | null;
    resourceId: string | null;
  }>;
}

export interface PermissionResult {
  allowed: boolean;
  workspaceId?: string;
  workspaceSlug?: string;
  role?: string;
  productRoles?: string[];
}

export interface WorkspacePermission {
  workspaceId: string;
  workspaceSlug: string;
  workspaceName: string;
  role: string;
  productRoles: string[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface ServiceConfig {
  apiUrl: string;
  serviceName: string;
  privateKey: string;
}

export interface CreateWorkspaceInput {
  name: string;
  slug: string;
  type?: string;
  description?: string;
}

export interface UpdateWorkspaceInput {
  name?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
}

export interface InviteInput {
  email: string;
  role?: string;
}

export interface FullUserResponse {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  locale: string | null;
  timezone: string | null;
  memberships: Membership[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionInput {
  workspaceId: string;
  planId: string;
  status?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

export interface SubscriptionResponse {
  id: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  canceledAt: string | null;
  createdAt: string;
  plan: {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    interval: string;
    product: { name: string; slug: string };
  };
  workspace: { id: string; name: string; slug: string };
}

export interface CreateOrderInput {
  workspaceId: string;
  userId: string;
  productName: string;
  sourceService: string;
  status?: string;
  currency?: string;
  subtotal: number;
  tax?: number;
  total: number;
  items?: Array<{
    name: string;
    quantity?: number;
    unitPrice: number;
    taxRate?: number;
  }>;
  metadata?: Record<string, unknown>;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  productName: string;
  sourceService: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  metadata?: unknown;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  payments?: Array<{
    id: string;
    provider: string;
    status: string;
    amount: number;
    paidAt: string | null;
  }>;
}

export interface PlanEntitlement {
  key: string;
  value: string;
}

export interface PlanResponse {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  interval: string;
  entitlements: PlanEntitlement[];
}

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  plans: PlanResponse[];
}

export interface ProductListResponse {
  products: ProductResponse[];
}
