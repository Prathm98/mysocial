import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Educations = ({ education }) => {
  return (
    <Fragment>
      <div className="profile-edu bg-white p-2">
        <h2 className="text-primary">Education</h2>
        {education === null || education.length === 0? <p>No Education details Added!</p>:
          (education.map((edu, index) => <div key={index}>
            <h3 className="text-dark">{edu.school}</h3>
            <p>{new Date(edu.from).toLocaleDateString()} - {edu.current ? 
                'Current': new Date(edu.to).toLocaleDateString()}</p>
            <p><strong>Degree: </strong>{edu.degree? edu.degree: 'N.A.'}</p>
            <p><strong>Field Of Study: </strong>{edu.fieldofstudy? edu.fieldofstudy: 'N.A.'}</p>
            <p>
              <strong>Description: </strong>{edu.description? edu.description: 'N.A.'}
            </p>
          </div>))
        }
      </div>
    </Fragment>
  )
}

Educations.propTypes = {
  education: PropTypes.array
}

export default Educations;
