import { GET_PROFILE, PROFILE_ERROR, ACCOUNT_DELETED, CLEAR_PROFILE,
  GET_PROFILES, GET_REPOS, SET_PROFILE_LOADING, GITHUB_ERROR } from './types';
import axios from 'axios';
import { setAlert } from './alert';

export const getCurrentProfile = () => async dispatch => {
  dispatch({ type: SET_PROFILE_LOADING });
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
  dispatch({ type: SET_PROFILE_LOADING });
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
  dispatch({ type: SET_PROFILE_LOADING });
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
  dispatch({ type: SET_PROFILE_LOADING });
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

export const deleteEducation = (id) => async dispatch => {
  dispatch({ type: SET_PROFILE_LOADING });
  try {
    let res = await axios.delete(`http://localhost:5000/api/profile/education/${id}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
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

export const deleteExperience = (id) => async dispatch => {
  dispatch({ type: SET_PROFILE_LOADING });
  try {
    let res = await axios.delete(`http://localhost:5000/api/profile/experience/${id}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
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

export const deleteAccount = () => async dispatch => {
  dispatch({ type: SET_PROFILE_LOADING });
  try {
    if(window.confirm('Are you sure? This action can not be undone')){
      let res = await axios.delete('http://localhost:5000/api/profile');

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });
      dispatch(setAlert('Account deleted permanently'));
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


export const getProfiles = () => async dispatch => {
  dispatch({ type: SET_PROFILE_LOADING });
  dispatch({ type: CLEAR_PROFILE });
  try {
    let res = await axios.get("http://localhost:5000/api/profile");

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
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

export const getProfileById = userId => async dispatch => {
  dispatch({ type: SET_PROFILE_LOADING });
  try {
    let res = await axios.get(`http://localhost:5000/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {    
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const getGithubRepos = userName => async dispatch => {
  dispatch({ type: SET_PROFILE_LOADING });
  try {
    let res = await axios.get(`http://localhost:5000/api/profile/github/${userName}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GITHUB_ERROR,
      payload: { msg: err.response.msg, status: err.response.status }
    });
  }
}