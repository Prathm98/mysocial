import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Experience = ({ experience }) => {
  return (
    <Fragment>
      <div className="profile-exp bg-white p-2">
        <h2 className="text-primary">Experience</h2>
        {experience === null || experience.length === 0? <p>No Experience Added!</p>:
          (experience.map((exp, index) => <div key={index}>
            <h3 className="text-dark">{exp.company}</h3>
            <p>{new Date(exp.from).toLocaleDateString()} - {exp.current ? 
                'Current': new Date(exp.to).toLocaleDateString()}</p>
            <p><strong>Position: </strong>{exp.title? exp.title: 'N.A.'}</p>
            <p>
              <strong>Description: </strong>{exp.description? exp.description: 'N.A.'}
            </p>
          </div>))
        }
      </div>
    </Fragment>
  )
}

Experience.propTypes = {
  experience: PropTypes.array
}

export default Experience;
