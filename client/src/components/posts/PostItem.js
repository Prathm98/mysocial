import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { addLike, removeLike, deletePost } from '../../actions/post';

const PostItem = ({ post, auth, addLike, removeLike, deletePost }) => {
  return (
    <Fragment>
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to={`/profile/${post.user && post.user}`}>
            <img className="round-img"src={post.avatar && post.avatar} alt="" />
            <h4>{post.name && post.name}</h4>
          </Link>
        </div>
        <div>
          <p className="my-1">{post.text && post.text}</p>
          <p className="post-date">Posted on {new Date(post.date).toLocaleDateString()}</p>
          {!auth.loading && post.likes.filter(item => item.user == auth.user._id).length > 0 ? (<Fragment>
            <button type="button" className="btn btn-light" disabled>
              <i className="fas fa-thumbs-up"></i><span> {post.likes? post.likes.length: 0}</span>
            </button>
            <button type="button" className="btn btn-light" onClick={e => removeLike(post._id)}>
              <i className="fas fa-thumbs-down"></i>
            </button>            
          </Fragment>): (<button type="button" className="btn btn-light" onClick={e => addLike(post._id)}>
              <i className="fas fa-thumbs-up"></i><span> {post.likes? post.likes.length: 0}</span>
            </button>)}
          <Link to={`/posts/${post._id}`} className="btn btn-primary">
            Discussion{" "}
            {post.comments && post.comments.length > 0? 
              <span className='comment-count'>{post.comments.length}</span>: ''}            
          </Link>
          {!auth.loading && post.user == auth.user._id && 
            <button type="button" className="btn btn-danger" onClick={e => deletePost(post._id)}>
              <i className="fas fa-times"></i>
            </button>}
        </div>
      </div>
    </Fragment>
  )
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  addLike, removeLike, deletePost
})(PostItem);
