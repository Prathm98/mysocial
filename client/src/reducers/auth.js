import { REGISTER_FAIL, REGISTER_SUCCESS } from '../actions/types';

const initialState = {
  loading: true,
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token')
};

export default function(state=initialState, action) {
  switch (action.type) {
    case REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {...state, ...action.payload, isAuthenticated: true, loading: false };
    case REGISTER_FAIL:
      localStorage.removeItem('token');
      return {...state, isAuthenticated: false, token: null, user: null, loading: false};
    default:
      return state;
  }
}