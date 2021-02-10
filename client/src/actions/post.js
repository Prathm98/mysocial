import axios from 'axios';
import { GET_POSTS, POST_ERROR } from './types';
import { setAlert } from '../components/layout/Alert';

export const getPosts = () => async dispatch =>{
  try {
    let res = await axios.get("http://localhost:5000/api/posts");
    
    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}