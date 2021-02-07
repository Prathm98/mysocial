import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Education = ({ profile:{ education }}) => (
  Education.length > 0 ? (<Fragment>
    <h2 className="my-2">Education Credentials</h2>
    <table className="table">
      <thead>
        <tr>
          <th>School</th>
          <th className="hide-sm">Degree</th>
          <th className="hide-sm">Years</th>
          <th />
        </tr>
      </thead>
      <tbody>
        { education.map(edu => (
          <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className="hide-sm">{edu.degree}</td>
            <td className="hide-sm">
              {new Date(edu.from).toLocaleDateString()} - {edu.current ? 
                'Current': new Date(edu.to).toLocaleDateString()}
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
    <p>You have not added any Education, please add some info</p>
  </Fragment>)
);

Education.propTypes = {
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile.profile
});

export default connect(mapStateToProps, {

})(Education);
