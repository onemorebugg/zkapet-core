import { PERMISSION_DEPENDENCIES, ROLE_LEVELS, ROLE_PERMISSIONS } from '../constants/permissions';

/**
 * Checks if actor has higher rank than target
 */
export const canManageRole = (actorRole: string, targetRole: string): boolean => {
    const actorLevel = ROLE_LEVELS[actorRole] || 0;
    const targetLevel = ROLE_LEVELS[targetRole] || 0;
    
    // Super admin can do anything
    if (actorRole === 'super_admin') return true;

    // Must be strictly higher level to manage
    return actorLevel > targetLevel;
};

/**
 * Resolves all implied permissions based on direct permissions
 */
export const resolvePermissions = (directPermissions: string[] = []): string[] => {
    const resolved = new Set(directPermissions);
    
    directPermissions.forEach(perm => {
        const deps = PERMISSION_DEPENDENCIES[perm];
        if (deps) {
            deps.forEach(d => resolved.add(d));
        }
    });
    
    return Array.from(resolved);
};

export const hasPermissionOrDependency = (userPerms: string[] | undefined, targetPerm: string): boolean => {
    if (!userPerms) return false;
    // Check direct
    if (userPerms.includes(targetPerm)) return true;
    
    // Check if any held permission implies targetPerm
    // Invert dependency check: Does user have a permission P where dependencies(P) includes targetPerm?
    return userPerms.some(p => {
        const deps = PERMISSION_DEPENDENCIES[p];
        return deps && deps.includes(targetPerm);
    });
};

export interface UserLike {
    role: string;
    permissions?: string[];
}

/**
 * Check if a user has a specific permission (Core logic for both FE and BE)
 */
export const checkUserPermission = (user: UserLike | null | undefined, permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'super_admin') return true;

    // 1. Get all permissions the user holds directly or via role
    const rolePerms = ROLE_PERMISSIONS[user.role] || [];
    const directPerms = user.permissions || [];
    const allHeldPerms = new Set([...rolePerms, ...directPerms]);

    // 2. Check if user has the target permission directly
    if (allHeldPerms.has(permission)) return true;

    // 3. Check dependencies (Does any held permission IMPLY the target permission?)
    for (const heldPerm of allHeldPerms) {
        const impliedPerms = PERMISSION_DEPENDENCIES[heldPerm];
        if (impliedPerms && impliedPerms.includes(permission)) return true;
    }

    return false;
};
