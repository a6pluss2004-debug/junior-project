export const ROLE_PERMISSIONS = {
  admin: [
    'create_project',
    'invite_members',
    'manage_columns',
    'create_tasks',
    'edit_tasks',
    'delete_tasks',
    'add_comments',
    'view_board'
  ],
  owner: [
    'create_project',
    'delete_project',
    'invite_members',
    'manage_columns',
    'create_tasks',
    'edit_tasks',
    'delete_tasks',
    'add_comments',
    'view_board'
  ],
  member: [
    'create_project',
    'create_tasks',
    'edit_tasks',
    'add_comments',
    'view_board'
  ],
  guest: [
    'create_project',
    'view_board'
  ]
};

export function checkPermission(action, role) {
  if (!role || !ROLE_PERMISSIONS[role]) return false;
  return ROLE_PERMISSIONS[role].includes(action);
}
