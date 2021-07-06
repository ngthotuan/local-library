module.exports = {
  UserRole: [
    { name: 'User', value: 0, operations: ['read'] },
    { name: 'Editor', value: 1, operations: ['read', 'create', 'update'] },
    {
      name: 'Admin',
      value: 2,
      operations: ['read', 'create', 'update', 'delete'],
    },
  ],
};
