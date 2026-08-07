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
}
declare function createAccountsClient(config: ServiceConfig): AccountsClient;

export { AccountsClient, type CreateWorkspaceInput, type FullUserResponse, type InviteInput, type LoginInput, type LoginResponse, type Membership, type PermissionResult, type RegisterInput, type RegisterResponse, type ServiceConfig, type UpdateWorkspaceInput, type UserPayload, type UserProfile, type Workspace, type WorkspacePermission, createAccountsClient };
