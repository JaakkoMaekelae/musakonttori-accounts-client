interface UserPayload {
    sub: string;
    email: string;
    name?: string;
}
interface UserProfile {
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
interface Workspace {
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
interface Membership {
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
            product: {
                slug: string;
                name: string;
            };
        };
        resourceType: string | null;
        resourceId: string | null;
    }>;
}
interface PermissionResult {
    allowed: boolean;
    workspaceId?: string;
    workspaceSlug?: string;
    role?: string;
    productRoles?: string[];
}
interface WorkspacePermission {
    workspaceId: string;
    workspaceSlug: string;
    workspaceName: string;
    role: string;
    productRoles: string[];
}
interface LoginInput {
    email: string;
    password: string;
}
interface RegisterInput {
    email: string;
    password: string;
    name?: string;
}
interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string | null;
        email: string;
    };
}
interface RegisterResponse {
    token: string;
    user: {
        id: string;
        name: string | null;
        email: string;
    };
}
interface ServiceConfig {
    apiUrl: string;
    serviceName: string;
    privateKey: string;
}
interface CreateWorkspaceInput {
    name: string;
    slug: string;
    type?: string;
    description?: string;
}
interface UpdateWorkspaceInput {
    name?: string;
    description?: string;
    logoUrl?: string;
    website?: string;
}
interface InviteInput {
    email: string;
    role?: string;
}
interface FullUserResponse {
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
interface CreateSubscriptionInput {
    workspaceId: string;
    planId: string;
    status?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
}
interface SubscriptionResponse {
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
        product: {
            name: string;
            slug: string;
        };
    };
    workspace: {
        id: string;
        name: string;
        slug: string;
    };
}
interface CreateOrderInput {
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
interface OrderResponse {
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
interface PlanEntitlement {
    key: string;
    value: string;
}
interface PlanResponse {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    interval: string;
    entitlements: PlanEntitlement[];
}
interface ProductResponse {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: string;
    plans: PlanResponse[];
}
interface ProductListResponse {
    products: ProductResponse[];
}

declare class AccountsClient {
    private apiUrl;
    private serviceName;
    private privateKey;
    private _keyPromise;
    constructor(config: ServiceConfig);
    private getKey;
    createServiceToken(): Promise<string>;
    private headers;
    private request;
    login(input: LoginInput): Promise<LoginResponse>;
    register(input: RegisterInput): Promise<RegisterResponse>;
    refreshToken(userToken: string): Promise<{
        token: string;
    }>;
    getMe(userToken: string): Promise<FullUserResponse>;
    getWorkspaces(userToken: string): Promise<Workspace[]>;
    checkPermission(userToken: string, product: string, opts?: {
        action?: string;
        resourceType?: string;
        resourceId?: string;
    }): Promise<PermissionResult>;
    listPermissions(userToken: string, product: string): Promise<WorkspacePermission[]>;
    getWorkspaceMembers(userToken: string, workspaceId: string): Promise<unknown[]>;
    createWorkspace(userToken: string, input: CreateWorkspaceInput): Promise<Workspace>;
    updateWorkspace(userToken: string, slug: string, input: UpdateWorkspaceInput): Promise<Workspace>;
    inviteToWorkspace(userToken: string, slug: string, input: InviteInput): Promise<unknown>;
    createSubscription(userToken: string, input: CreateSubscriptionInput): Promise<SubscriptionResponse>;
    getSubscriptions(userToken: string, opts: {
        workspaceId?: string;
        userId?: string;
    }): Promise<{
        subscriptions: SubscriptionResponse[];
    }>;
    createOrder(userToken: string, input: CreateOrderInput): Promise<OrderResponse>;
    getOrders(userToken: string, opts: {
        workspaceId?: string;
        userId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        orders: OrderResponse[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getProducts(productSlug?: string): Promise<ProductListResponse>;
}
declare function createAccountsClient(config: ServiceConfig): AccountsClient;

export { AccountsClient, type CreateOrderInput, type CreateSubscriptionInput, type CreateWorkspaceInput, type FullUserResponse, type InviteInput, type LoginInput, type LoginResponse, type Membership, type OrderResponse, type PermissionResult, type PlanEntitlement, type PlanResponse, type ProductListResponse, type ProductResponse, type RegisterInput, type RegisterResponse, type ServiceConfig, type SubscriptionResponse, type UpdateWorkspaceInput, type UserPayload, type UserProfile, type Workspace, type WorkspacePermission, createAccountsClient };
