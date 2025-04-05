import config from '..';
import { USER_ROLE } from '../../modules/User/user.constant';
import { User } from '../../modules/User/user.model';

const superUser = {
  name: 'Omar Faruk',
  email: config.super_admin_email,
  password: config.super_admin_password,
  role: USER_ROLE.admin,
  status: 'in-progress',
  verification: {
    verification: true,
  },
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  const isSuperAdminExits = await User.findOne({
    role: USER_ROLE.admin,
    email: superUser.email,
  });
  if (!isSuperAdminExits) {
    // await User.create(superUser);
  }
};

export default seedSuperAdmin;
