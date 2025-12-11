
export interface UserInfo {
  id: string | number;
  userId: string | number;
  username: string;
  realname: string;
  avatar: string;
  desc?: string;
  homePath?: string;
  tenantid?: string | number;
  roles: RoleInfo[];
  orgCode?: string;
}

// Lock screen information
export interface LockInfo {
    // Password required
    pwd?: string | undefined;
    // Is it locked?
    isLock?: boolean;
}

export interface LoginInfo {
  multi_depart?: string | number;
  userInfo?: object;
  departs?: [];
  tenantList?: [];
  isLogin?: boolean;
}