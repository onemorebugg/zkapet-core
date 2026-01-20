/**
 * Checks if actor has higher rank than target
 */
export declare const canManageRole: (actorRole: string, targetRole: string) => boolean;
/**
 * Resolves all implied permissions based on direct permissions
 */
export declare const resolvePermissions: (directPermissions?: string[]) => string[];
export declare const hasPermissionOrDependency: (userPerms: string[] | undefined, targetPerm: string) => boolean;
export interface UserLike {
    role: string;
    permissions?: string[];
}
/**
 * Check if a user has a specific permission (Core logic for both FE and BE)
 */
export declare const checkUserPermission: (user: UserLike | null | undefined, permission: string) => boolean;
