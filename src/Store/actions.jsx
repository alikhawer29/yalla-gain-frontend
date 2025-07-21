export const setData = (data) => {
  return {
    type: "SET_DATA",
    payload: data,
  };
};

export const setToken = (token) => ({
  type: "SET_TOKEN",
  payload: token,
});

export const setRoles = (role) => ({
  type: "SET_ROLE",
  payload: role,
});

export const resetCartData = () => ({
  type: "RESET_CART_DATA",
});

export const addImage = (name, dataURL) => ({
  type: "ADD_IMAGE",
  payload: { name, dataURL },
});

export const deleteAllImages = () => {
  sessionStorage.removeItem("images"); // Clear sessionStorage
  return {
    type: "DELETE_ALL_IMAGES",
  };
};

export const logout = () => ({ type: "LOGOUT" });

