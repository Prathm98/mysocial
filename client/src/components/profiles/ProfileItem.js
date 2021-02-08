import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProfileItem = ({ profile }) => {  
  return (
    <Fragment>
      <div className="profile bg-light">
        <img
          className="round-img"
          src={ profile.user.avatar && profile.user.avatar }
          alt=""
        />
        <div>
          <h2>{ profile.user.name && profile.user.name }</h2>
          <p>{ profile.status && profile.status } { profile.company && ("at " + profile.company) }</p>
          <p>{ profile.location && profile.location }</p>
          <Link to={`/profile/${profile.user._id}`} className="btn btn-primary">View Profile</Link>
        </div>

        <ul>
          { profile.skills && profile.skills.map((skill, index) => (
            <li key={index} className="text-primary">
              <i className="fas fa-check"></i> { skill.toUpperCase() }
            </li>
          )) }                  
        </ul>
      </div>
    </Fragment>
  )
}

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
}

export default ProfileItem;
