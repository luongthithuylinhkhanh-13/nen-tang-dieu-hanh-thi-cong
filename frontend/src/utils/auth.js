const AUTH_STORAGE_KEY = 'constructflow_auth_user';

const DEFAULT_USER = {
  username: 'admin',
  fullName: 'Quản trị viên',
  role: 'Quản trị hệ thống'
};

export const getAuthUser = () => {
  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getAuthUser());

export const loginUser = (username, password) => {
  if (!username?.trim() || !password) {
    return { success: false, message: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu' };
  }

  const user = { ...DEFAULT_USER, username: username.trim() };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  return { success: true, user };
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
