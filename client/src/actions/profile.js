import { GET_PROFILE, PROFILE_ERROR, GET_EXPERIENCE } from './types';
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

export const createProfile = (formData, history, edit=false) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let res = await axios.post("http://localhost:5000/api/profile", JSON.stringify(formData), config);
    
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(edit? 'Profile Updated': 'Profile Created', 'success'));
    if(!edit){
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors; 
    if(errors){
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const addExperience = (expData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let res = await axios.put('http://localhost:5000/api/profile/experience', 
      JSON.stringify(expData), config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Added', 'success'));
    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors; 
    if(errors){
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const addEducation = (eduData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let res = await axios.put('http://localhost:5000/api/profile/education', 
      JSON.stringify(eduData), config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Added', 'success'));
    history.push("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors; 
    if(errors){
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}