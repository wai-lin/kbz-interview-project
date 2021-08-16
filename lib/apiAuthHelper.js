import { getAuth, isAdminLoggedIn, isUserLoggedIn } from "./authHelper";

function authMiddleWare(cookies, permission) {
  const auth = getAuth(cookies);

  if (permission === "admin" && isAdminLoggedIn(auth)) {
    return null;
  } else if (permission === "user" && isUserLoggedIn(auth)) {
    return null;
  } else if (
    permission === "both" &&
    (isUserLoggedIn(auth) || isAdminLoggedIn(auth))
  ) {
    return null;
  } else {
    return {
      success: false,
      message: "Permission denied!",
      data: null,
      error: null,
    };
  }
}

export { authMiddleWare };
