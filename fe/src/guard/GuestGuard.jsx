
const GuestGuard = ({ children }) => {
  // Để client có thể xem cả khi chưa đăng nhập, ta không redirect ở đây
  return children;
};

export default GuestGuard;
