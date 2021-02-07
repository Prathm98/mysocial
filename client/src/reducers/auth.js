import { REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR,
  LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, ACCOUNT_DELETED } from '../actions/types';

const initialState = {
  loading: true,
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token')
};

export default function(state=initialState, action) {
  switch (action.type) {
    case USER_LOADED:
      return {...state, isAuthenticated: true, loading: false, user: action.payload };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {...state, ...action.payload, isAuthenticated: true, loading: false };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case ACCOUNT_DELETED:
    case LOGOUT:
      localStorage.removeItem('token');
      return {...state, isAuthenticated: false, token: null, user: null, loading: false};
    default:
      return state;
  }
}