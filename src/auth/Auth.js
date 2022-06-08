export const AUTH = () => {
  if (localStorage.getItem("Authorization")) {
    return true;
  } else {
    return false;
  }
};
