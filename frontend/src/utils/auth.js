const AUTH_KEY = 'construction_demo_auth';

export const getAuthUser = () => {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading auth state:', error);
    return null;
  }
};

export const setAuthUser = (user) => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving auth state:', error);
  }
};

export const logoutUser = () => {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error('Error clearing auth state:', error);
  }
};

export const isAuthenticated = () => {
  return !!getAuthUser();
};
