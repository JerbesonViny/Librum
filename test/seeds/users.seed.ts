import { ObjectId } from 'mongodb';

export const users = [
  {
    _id: new ObjectId('6a2b3fa1ed358eaafa29055e'),
    name: 'mockedLibrarianName',
    lastName: 'mockedLibrarianLastName',
    email: 'mockedLibrarianEmail',
    role: 'LIBRARIAN',
    password:
      'cfd5b1652ec2609241b1ac9480ff1b146a068a543a986e1ce8c6d456a919de98b573393282323a94743a04c4b47eb955b51154e77ca9ec3f5c2328572824c17f',
  },
  {
    _id: new ObjectId('6a2c2cb5f9a1a35f8615c839'),
    name: 'mockedTenantName',
    lastName: 'mockedTenantLastName',
    email: 'mockedTenantEmail',
    role: 'TENANT',
    password:
      'cfd5b1652ec2609241b1ac9480ff1b146a068a543a986e1ce8c6d456a919de98b573393282323a94743a04c4b47eb955b51154e77ca9ec3f5c2328572824c17f',
  },
];
