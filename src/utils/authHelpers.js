function mapApiUser(data) {
  return {
    id: data.id,
    firstName: data.firstName || data.name?.split(' ')[0] || '',
    lastName: data.lastName || data.name?.split(' ').slice(1).join(' ') || '',
    username: data.username || data.name,
    email: data.email,
    phone: data.phone || '',
    avatar: data.image || '',
    gender: data.gender || '',
    role: data.role || (data.urole === 'admin' ? 'Admin' : 'User'),
    isactive: data.isactive !== false,
  };
}

export function getStoredToken() {
  return localStorage.getItem('ali_token');
}

export function getAuthHeaders(token) {
  const authToken = token || getStoredToken();
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

export { mapApiUser };
