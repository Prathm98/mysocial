import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfileById } from '../../../actions/profile';
import { Link } from 'react-router-dom';
import GithubRepos from './GithubRepos';
import About from './About';
import Experience from './Experience';
import Education from './Education';
import Spinner from '../../layout/Spinner';

const Profile = ({ match: {params: {user_id}}, getProfileById, 
  profile, loading }) => {
  
  useEffect(() => {
    getProfileById(user_id)
  }, []);

  return (
    <Fragment>
      <Link to="/profiles" className="btn btn-light">Back To Profiles</Link>      
      { loading || profile == null? <Spinner />: (<Fragment>
        <About profile={profile} />
        <Experience experience={profile.experience? profile.experience: null} />
        <Education education={profile.education? profile.education: null} />
        <GithubRepos username={profile.githubusername? profile.githubusername: null} />
      </Fragment>) }
    </Fragment>
  )
}

Profile.propTypes = {
  profile: PropTypes.object,
  getProfileById: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile.profile,
  loading: state.profile.loading
});

export default connect(mapStateToProps, {
  getProfileById
})(Profile);
