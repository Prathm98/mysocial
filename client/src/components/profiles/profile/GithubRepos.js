import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGithubRepos } from '../../../actions/profile';
import ReposItem from './ReposItem';
import Spinner from '../../layout/Spinner';

const GithubRepos = ({ username, getGithubRepos, profile:{loading, repos} }) => {
  useEffect(() => {
    if(username){
      getGithubRepos(username);
    }     
  }, [getGithubRepos(username)]);

  if(username === null){
    return <h4><br /><i className="fab fa-github"></i> Github Account is not linked by user!!!</h4>
  }  

  return (
    <Fragment>
      <div className="profile-github">
        <h2 className="text-primary my-1">
          <i className="fab fa-github"></i> Github Repos
        </h2>
        {loading? <Spinner />: (repos && repos.length > 0? 
          repos.map(repo => <ReposItem key={repo._id} repo={repo} />): 
          <Fragment><p>No repositories found!!!</p></Fragment>)}        
      </div>
    </Fragment>
  )
}

GithubRepos.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  profile: PropTypes.array.isRequired,
  username: PropTypes.string
}

const mapStateToProps = state => ({
  profile: state.profile.repos
});

export default connect(mapStateToProps, {
  getGithubRepos
})(GithubRepos);
