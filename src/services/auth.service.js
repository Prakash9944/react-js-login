import axios from "axios";

const API_URL = "http://localhost:3010/api/";

const register = (email, password) => {
  return axios.post(API_URL + "signup", {
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "signin", {
      email,
      password,
    })
    .then((response) => {
      if (response && response.data && response.data.statusCode === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data
      }
      return null;
    })
};

const logout = () => {
  localStorage.removeItem("user");
  return axios.post(API_URL + "signout").then((response) => {
    return response.data;
  });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user")) || {};
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser
}

export default AuthService;
