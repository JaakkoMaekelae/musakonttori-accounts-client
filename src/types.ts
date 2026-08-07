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
