"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserPermission = exports.hasPermissionOrDependency = exports.resolvePermissions = exports.canManageRole = void 0;
const permissions_1 = require("../constants/permissions");
/**
 * Checks if actor has higher rank than target
 */
const canManageRole = (actorRole, targetRole) => {
    const actorLevel = permissions_1.ROLE_LEVELS[actorRole] || 0;
    const targetLevel = permissions_1.ROLE_LEVELS[targetRole] || 0;
    // Super admin can do anything
    if (actorRole === 'super_admin')
        return true;
    // Must be strictly higher level to manage
    return actorLevel > targetLevel;
};
exports.canManageRole = canManageRole;
/**
 * Resolves all implied permissions based on direct permissions
 */
const resolvePermissions = (directPermissions = []) => {
    const resolved = new Set(directPermissions);
    directPermissions.forEach(perm => {
        const deps = permissions_1.PERMISSION_DEPENDENCIES[perm];
        if (deps) {
            deps.forEach(d => resolved.add(d));
        }
    });
    return Array.from(resolved);
};
exports.resolvePermissions = resolvePermissions;
const hasPermissionOrDependency = (userPerms, targetPerm) => {
    if (!userPerms)
        return false;
    // Check direct
    if (userPerms.includes(targetPerm))
        return true;
    // Check if any held permission implies targetPerm
    // Invert dependency check: Does user have a permission P where dependencies(P) includes targetPerm?
    return userPerms.some(p => {
        const deps = permissions_1.PERMISSION_DEPENDENCIES[p];
        return deps && deps.includes(targetPerm);
    });
};
exports.hasPermissionOrDependency = hasPermissionOrDependency;
/**
 * Check if a user has a specific permission (Core logic for both FE and BE)
 */
const checkUserPermission = (user, permission) => {
    if (!user)
        return false;
    if (user.role === 'admin' || user.role === 'super_admin')
        return true;
    // 1. Get all permissions the user holds directly or via role
    const rolePerms = permissions_1.ROLE_PERMISSIONS[user.role] || [];
    const directPerms = user.permissions || [];
    const allHeldPerms = new Set([...rolePerms, ...directPerms]);
    // 2. Check if user has the target permission directly
    if (allHeldPerms.has(permission))
        return true;
    // 3. Check dependencies (Does any held permission IMPLY the target permission?)
    for (const heldPerm of allHeldPerms) {
        const impliedPerms = permissions_1.PERMISSION_DEPENDENCIES[heldPerm];
        if (impliedPerms && impliedPerms.includes(permission))
            return true;
    }
    return false;
};
exports.checkUserPermission = checkUserPermission;
