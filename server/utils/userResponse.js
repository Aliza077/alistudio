export function formatUserResponse(user) {
  const nameParts = (user.name || '').split(' ');
  return {
    id: user._id,
    name: user.name,
    username: user.username || user.name,
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    email: user.email,
    phone: user.phone || '',
    image: user.image || '',
    gender: user.gender || '',
    urole: user.urole,
    role: user.urole === 'admin' ? 'Admin' : 'User',
    isactive: user.isactive !== false,
  };
}
