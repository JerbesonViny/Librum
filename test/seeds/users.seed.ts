export const users = [
  {
    id: 'a0000000-0000-4000-a000-000000000001',
    name: 'mockedLibrarianName',
    last_name: 'mockedLibrarianLastName',
    email: 'mockedLibrarianEmail',
    password:
      'cfd5b1652ec2609241b1ac9480ff1b146a068a543a986e1ce8c6d456a919de98b573393282323a94743a04c4b47eb955b51154e77ca9ec3f5c2328572824c17f',
    createdAt: new Date('2020-01-01T04:00:00.000Z'),
  },
  {
    id: 'a0000000-0000-4000-a000-000000000002',
    name: 'mockedTenantName',
    last_name: 'mockedTenantLastName',
    email: 'mockedTenantEmail',
    password:
      'cfd5b1652ec2609241b1ac9480ff1b146a068a543a986e1ce8c6d456a919de98b573393282323a94743a04c4b47eb955b51154e77ca9ec3f5c2328572824c17f',
    createdAt: new Date('2020-01-02T04:00:00.000Z'),
  },
  {
    id: 'a0000000-0000-4000-a000-000000000003',
    name: 'mockedAdminName',
    last_name: 'mockedAdminLastName',
    email: 'mockedAdminEmail',
    password:
      'cfd5b1652ec2609241b1ac9480ff1b146a068a543a986e1ce8c6d456a919de98b573393282323a94743a04c4b47eb955b51154e77ca9ec3f5c2328572824c17f',
    createdAt: new Date('2020-01-02T04:00:00.000Z'),
  },
  {
    id: 'a0000000-0000-4000-a000-000000000004',
    name: 'mockedUnapprovedLibrarianName',
    last_name: 'mockedUnapprovedLibrarianLastName',
    email: 'mockedUnapprovedLibrarianEmail',
    password:
      'cfd5b1652ec2609241b1ac9480ff1b146a068a543a986e1ce8c6d456a919de98b573393282323a94743a04c4b47eb955b51154e77ca9ec3f5c2328572824c17f',
    createdAt: new Date('2020-01-02T04:00:00.000Z'),
  },
  {
    id: 'a0000000-0000-4000-a000-000000000005',
    name: 'mockedDisabledLibrarianName',
    last_name: 'mockedDisabledLibrarianLastName',
    email: 'mockedDisabledLibrarianEmail',
    password:
      'cfd5b1652ec2609241b1ac9480ff1b146a068a543a986e1ce8c6d456a919de98b573393282323a94743a04c4b47eb955b51154e77ca9ec3f5c2328572824c17f',
    createdAt: new Date('2020-01-02T04:00:00.000Z'),
  },
];

export const librarians: any[] = [
  {
    user_id: 'a0000000-0000-4000-a000-000000000001',
    approved: true,
    disabled: false,
    approvedAt: new Date('2077-01-01T04:00:00.000Z'),
  },
  {
    user_id: 'a0000000-0000-4000-a000-000000000004',
    approved: false,
    disabled: false,
  },
  {
    user_id: 'a0000000-0000-4000-a000-000000000005',
    approved: false,
    disabled: true,
    disabledAt: new Date('2077-01-01T04:00:00.000Z'),
  },
];

export const tenants: any[] = [
  {
    user_id: 'a0000000-0000-4000-a000-000000000002',
    birth_date: '20020902',
  },
];

export const admins: any[] = [
  {
    user_id: 'a0000000-0000-4000-a000-000000000003',
  },
];
