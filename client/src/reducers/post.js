import { POST_ERROR, GET_POSTS } from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};

export default function(state=initialState, action){
  switch (action.type) {
    case GET_POSTS:
      return {...state, loading: false, posts: action.payload};
    case POST_ERROR:
      return {...state, loading: false, error: action.payload};
    default:
      return state;
  }
}