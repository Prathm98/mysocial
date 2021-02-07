import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Experience = ({ profile:{ experience }}) => (
  experience.length > 0 ? (<Fragment>
    <h2 className="my-2">Experience Credentials</h2>
    <table className="table">
      <thead>
        <tr>
          <th>Company</th>
          <th className="hide-sm">Title</th>
          <th className="hide-sm">Years</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        { experience.map(exp => (
          <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td className="hide-sm">
              {new Date(exp.from).toLocaleDateString()} - {exp.current ? 
                'Current': new Date(exp.to).toLocaleDateString()}
            </td>
            <td>
              <button className="btn btn-danger">
                Delete
              </button>
            </td>
          </tr>
        )) }                  
      </tbody>
    </table>
  </Fragment>): (<Fragment>
    <p>You have not added any experience, please add some info</p>
  </Fragment>)
);

Experience.propTypes = {
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile.profile
});

export default connect(mapStateToProps, {

})(Experience);
