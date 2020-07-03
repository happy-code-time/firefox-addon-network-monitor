const setAuthentication = (name: string, value: string) => {
  localStorage.setItem(name, value);
};

export default setAuthentication;
