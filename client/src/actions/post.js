import axios from 'axios';
import { DELETE_POST, GET_POSTS, POST_ERROR, UPDATE_LIKES, ADD_POST, 
  GET_POST, UPDATE_COMMENTS } from './types';
import { setAlert } from './alert';

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

export const addLike = postId => async dispatch =>{
  try {
    let res = await axios.put(`http://localhost:5000/api/posts/like/${postId}`);
    
    dispatch({
      type: UPDATE_LIKES,
      payload: {id: postId, likes: res.data}
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const removeLike = postId => async dispatch =>{
  try {
    let res = await axios.put(`http://localhost:5000/api/posts/unlike/${postId}`);
    
    dispatch({
      type: UPDATE_LIKES,
      payload: {id: postId, likes: res.data}
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const deletePost = postId => async dispatch =>{
  try {
    let res = await axios.delete(`http://localhost:5000/api/posts/${postId}`);
    
    dispatch({
      type: DELETE_POST,
      payload: postId
    });

    dispatch(setAlert("Post deleted successfully", 'success'));
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const addPost = text => async dispatch =>{
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let res = await axios.post(`http://localhost:5000/api/posts`, JSON.stringify({text}), config);
    
    dispatch({
      type: ADD_POST,
      payload: res.data
    });

    dispatch(setAlert("Post added successfully", 'success'));
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const getPost = id => async dispatch =>{
  try {
    let res = await axios.get(`http://localhost:5000/api/posts/${id}`);
    
    dispatch({
      type: GET_POST,
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

export const deleteComment = (commentId, postId) => async dispatch =>{
  try {
    let res = await axios.delete(`http://localhost:5000/api/posts/comment/${commentId}/${postId}`);
    
    dispatch({
      type: UPDATE_COMMENTS,
      payload: res.data
    });

    dispatch(setAlert('Comment Deleted successfully', 'success'));
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const addComment = (postId, text) => async dispatch =>{
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    let res = await axios.post(`http://localhost:5000/api/posts/comment/${postId}`,
      JSON.stringify({text}), config);
    
    dispatch({
      type: UPDATE_COMMENTS,
      payload: res.data
    });

    dispatch(setAlert('Comment Added successfully', 'success'));
  } catch (err) {
    console.log(err);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}