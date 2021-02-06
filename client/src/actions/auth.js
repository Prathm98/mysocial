import { REGISTER_FAIL, REGISTER_SUCCESS } from './types';
import { setAlert } from './alert';
import axios from 'axios';

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