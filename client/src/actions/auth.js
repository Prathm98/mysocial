import { REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR,
  LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_PROFILE } from './types';
import { setAlert } from './alert';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

export const loadUser = () => async dispatch => {
  if(localStorage.token){
    setAuthToken(localStorage.token);
  }  

  try {
    let user = await axios.get('http://localhost:5000/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: user.data
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR
    });
  }
}

export const register = ({ name, email, password }) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify({ name, email, password });
    let res = await axios.post('http://localhost:5000/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
  } catch (err) {   
    const errors = err.response.data.errors; 
    if(errors){
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }    
    dispatch({
      type: REGISTER_FAIL
    });    
  }  
}

export const login = (email, password) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify({ email, password });
    let res = await axios.post('http://localhost:5000/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {   
    const errors = err.response.data.errors; 
    if(errors){
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }    
    dispatch({
      type: LOGIN_FAIL
    });    
  }  
}

export const logout = () => dispatch => {
  dispatch({
    type: CLEAR_PROFILE
  });
  dispatch({
    type: LOGOUT
  });
}