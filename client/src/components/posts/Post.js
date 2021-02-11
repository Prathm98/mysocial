import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getPost, deleteComment, addComment } from '../../actions/post';
import Spinner from '../layout/Spinner';

const Post = ({ getPost, post:{post, loading}, match, auth, deleteComment, addComment}) => {
  useEffect(()=>{
    getPost(match.params.id);
  }, []);

  const [text, setText] = useState('');

  return (loading || post == null? <Spinner />:
    <Fragment>
      <Link to="/posts" className="btn">Back To Posts</Link>
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to={`/profile/${post.user}`}>
            <img
              className="round-img"
              src={post.avatar}
              alt=""
            />
            <h4>{post.name}</h4>
          </Link>
        </div>
        <div>
          <p className="my-1">{post.text}</p>
        </div>
      </div>

      <div className="post-form">
        <div className="bg-primary p">
          <h3>Leave A Comment</h3>
        </div>
        <form className="form my-1">
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Comment on this post"
            required
            value={text} onChange={e => setText(e.target.value)}
          ></textarea>
          {(text.trim()).length > 0 && 
          <button type="button" className="btn btn-dark my-1" value="Submit" 
            onClick={e=> {
              e.preventDefault();
              addComment(post._id, text);
              setText('');
            }}>Submit</button>}
        </form>
      </div>

      <div className="comments">
        {post.comments && post.comments.length > 0 ? 
          post.comments.map(comment => <div key={comment._id} className="post bg-white p-1 my-1">
          <div>
            <a href={`/profile/${comment.user}`}>
              <img
                className="round-img"
                src={comment.avatar}
                alt=""
              />
              <h4>{comment.name}</h4>
            </a>
          </div>
          <div>
            <p className="my-1">{comment.text}</p>
            <p className="post-date">Posted on {new Date(comment.date).toLocaleDateString()}</p>
            {!auth.loading && auth.user._id && auth.user._id === comment.user && 
            <button type="button" className="btn btn-danger" 
              onClick={e => deleteComment(comment._id, post._id)}>
              <i className="fas fa-times"></i>
            </button>}
          </div>
        </div>): <p>No comments posted yet!!!</p>}
      </div>
    </Fragment>
  )
}

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth
});

export default connect(mapStateToProps, {
  getPost, deleteComment, addComment
})(Post);
