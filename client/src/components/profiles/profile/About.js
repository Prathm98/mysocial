import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const About = ({ profile }) => {
  const { user:{name, avatar}, status, company, location, social, skills, bio, website } = profile;
  return (
    <Fragment>
      <div className="profile-grid my-1">
        <div className="profile-top bg-primary p-2">
          <img
            className="round-img my-1"
            src={avatar && avatar}
            alt=""
          />
          <h1 className="large">{name && name}</h1>
          <p className="lead">{ status && status} { company && `at `+company}</p>
          <p>{ location && location }</p>
          <div className="icons my-1">
            {website && <a href={website} target="_blank" rel="noopener noreferrer">
              <i className="fas fa-globe fa-2x"></i>
            </a>}
            {social && social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter fa-2x"></i>
            </a>}
            {social && social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook fa-2x"></i>
            </a>}
            {social && social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin fa-2x"></i>
            </a>}
            {social && social.youtube && <a href={social.youtube} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube fa-2x"></i>
            </a>}
            {social && social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram fa-2x"></i>
            </a>}
          </div>
        </div>

        <div className="profile-about bg-light p-2">
          { bio && <Fragment>
            <h2 className="text-primary">{name}'s Bio</h2>
            <p>{bio}</p>
          <div className="line"></div></Fragment>}
          {skills && <Fragment>
            <h2 className="text-primary">Skill Set</h2>
            <div className="skills">
              {skills.map((skill, index) => <div className="p-1" key={index}>
                <i className="fa fa-check"></i> {skill}
              </div>)}
            </div>
          </Fragment>}
        </div>
      </div>
    </Fragment>
  )
}

About.propTypes = {
  profile: PropTypes.object.isRequired
}

export default About;
