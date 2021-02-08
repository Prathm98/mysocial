import { CLEAR_PROFILE, GET_PROFILE, GET_REPOS, PROFILE_ERROR, GET_PROFILES,
  SET_PROFILE_LOADING } from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
};

export default function(state=initialState, action){
  switch (action.type) {
    case GET_PROFILE:
      return {...state, profile: action.payload, error:{}, loading: false};
    case GET_PROFILES:
      return {...state, profiles: action.payload, error:{}, loading: false};
    case PROFILE_ERROR:
      return {...state, error: action.payload, loading: false, profile: null};
    case CLEAR_PROFILE:
      return {...state, loading: false, profile: null, repos: []};
    case GET_REPOS:
      return {...state, repos: action.payload, error:{}, loading: false};
    case SET_PROFILE_LOADING:
      return state;
    default:
      return state;
  }
}