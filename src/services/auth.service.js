import axios from "axios";
const API_URL = `http://54.89.114.51:3010/api/`;

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

let verifyOtp = (email, otp) => {
  return axios.post(API_URL + "verify", {
    email,
    otp
  });
}

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user")) || {};
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  verifyOtp
}

export default AuthService;
