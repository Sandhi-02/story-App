import { getActiveRoute } from '../routes/url-parser.js';
import { ACCESS_TOKEN_KEY } from '../config.js';
// export const ACCESS_TOKEN_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLVY2VlFBMHZfWnhzYXZaRW8iLCJpYXQiOjE3NDUxNTY0ODl9.nNDp5MZvasnfGzFA1mZMUNxyJN3XzLFnRopqntenmTk";

localStorage.setItem('accessToken', ACCESS_TOKEN_KEY);

// console.log(getActiveRoute());

export function getAccessToken() {
  try {
    // const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const accessToken = localStorage.getItem('accessToken');
    // console.log(accessToken);

    if (accessToken === 'null' || accessToken === 'undefined') {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error('getAccessToken: error:', error);
    return null;
  }
}

export function putAccessToken(token) {
  try {
    // localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem('accessToken', token);
    return true;
  } catch (error) {
    console.error('putAccessToken: error:', error);
    return false;
  }
}

export function removeAccessToken() {
  try {
    // localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem('accessToken');
    return true;
  } catch (error) {
    console.error('getLogout: error:', error);
    return false;
  }
}

const unauthenticatedRoutesOnly = ['/login', '/register'];

export function checkUnauthenticatedRouteOnly(page) {
  const url = getActiveRoute();
  // console.log(url);

  const isLogin = !!getAccessToken();
  // console.log(isLogin);

  if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
    location.hash = '/';
    return null;
  }

  return page;
}

export function checkAuthenticatedRoute(page) {
  const isLogin = !!getAccessToken();

  if (!isLogin) {
    location.hash = '/login';
    return null;
  }

  return page;
}

export function getLogout() {
  removeAccessToken();
}
