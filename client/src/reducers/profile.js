import { CLEAR_PROFILE, GET_PROFILE, PROFILE_ERROR } from '../actions/types';

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
    case PROFILE_ERROR:
      return {...state, error: action.payload, loading: false};
    case CLEAR_PROFILE:
      return {...state, loading: false, profile: null, repos: []};
    default:
      return state;
  }
}