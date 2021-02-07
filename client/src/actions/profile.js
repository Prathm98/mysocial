import { GET_PROFILE, PROFILE_ERROR } from './types';
import axios from 'axios';
import { setAlert } from './alert';

export const getCurrentProfile = () => async dispatch => {
  try {
    let res = await axios.get("http://localhost:5000/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (error) { 
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
}