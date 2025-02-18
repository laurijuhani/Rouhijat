const useSignout = () => {
  const signout = () => {
    localStorage.removeItem('token');

    window.location.href = '/';
  };

  return signout;
};

export default useSignout;