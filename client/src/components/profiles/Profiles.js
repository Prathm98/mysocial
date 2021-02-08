import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfiles } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';

const Profiles = ({ getProfiles, profile: {profiles, loading}}) => {
  useEffect(()=>{
    getProfiles();
  }, []);

  return (
    <Fragment>
      <h1 className="large text-primary">Developers</h1>
      <p className="lead">
        <i className="fab fa-connectdevelop"></i> Browse and connect with developers
      </p>
      <div className="profiles">
        { loading? (<Fragment>
          <Spinner />
        </Fragment>): (<Fragment>
          {profiles.length > 0? (<Fragment>
            {profiles.map(profile => (
              <ProfileItem key={profile._id} profile={profile} />
            ))}
          </Fragment>): (<Fragment>
            <p>No Profile found!!!</p>
          </Fragment>)} 
        </Fragment>)}
      </div>
    </Fragment>
  )
}

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfiles: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, {
  getProfiles
})(Profiles);
