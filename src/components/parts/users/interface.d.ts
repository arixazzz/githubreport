interface UserDetailResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  nik: string;
  position: string;
  workUnit: string;
  profilePicture: any;
  role: Role;
  gender: string;
}

interface Role {
  name: string;
  roleType: string;
  rolePermissions: string[];
}

interface UsersResponse {
  id: number;
  name: string;
  email: string;
  gender: string;
  role: RolePub;
}

interface RolePub {
  name: string;
}

interface UsersDetailResponse {
  id: number;
  email: string;
  name: string;
  gender: string;
  password: string;
  roleId: number;
  profilePicture: any;
  nik: string;
  position: string;
  workUnit: string;
  phone: string;
  address: string;
  pin: string;
}
