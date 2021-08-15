import Cookies from "js-cookie";

function getAuth(cookies) {
  const authCookie = cookies.auth;
  let isAuth = false;
  let isAdmin = false;
  if (authCookie) {
    isAuth = true;
    const auth = JSON.parse(authCookie);
    if (auth.email === "admin@gmail.com") isAdmin = true;
  }
  return { isAuth, isAdmin };
}

function isAdminLoggedIn({ isAuth, isAdmin }) {
  return isAuth && isAdmin;
}

function isUserLoggedIn({ isAuth, isAdmin }) {
  return isAuth && !isAdmin;
}

function logout() {
  Cookies.remove("auth");
}

function getUser() {
  const auth = Cookies.get("auth");
  return auth ? JSON.parse(auth) : {};
}

export { getAuth, isAdminLoggedIn, isUserLoggedIn, logout, getUser };
