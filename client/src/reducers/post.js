import { POST_ERROR, GET_POSTS, UPDATE_LIKES, DELETE_POST, ADD_POST, 
  GET_POST, UPDATE_COMMENTS } from '../actions/types';

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
    case GET_POST:
      return {...state, loading: false, post: action.payload, posts: []};
    case POST_ERROR:
      return {...state, loading: false, error: action.payload};
    case UPDATE_LIKES:      
      return {...state, loading: false, 
        posts: state.posts.map(post => post._id == action.payload.id? 
          {...post, likes: action.payload.likes}: post)};
    case UPDATE_COMMENTS:
      return {...state, loading: false, 
        post: {...state.post, comments: action.payload}};
    case DELETE_POST:      
      return {...state, loading: false, 
        posts: state.posts.filter(post => post._id !== action.payload)};
    case ADD_POST:      
      return {...state, loading: false, posts: [...state.posts, action.payload]};
    default:
      return state;
  }
}