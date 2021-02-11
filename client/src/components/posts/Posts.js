import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPosts, addPost } from '../../actions/post';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';

const Posts = ({ getPosts, addPost, post: {posts, loading}}) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const [postText, setPostText] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    addPost(postText);

    setPostText('');
  }

  return (<Fragment>
    {loading? <Spinner />: (posts.length > 0? <Fragment>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead"><i className="fas fa-user"></i> Welcome to the community!</p>

      <div className="post-form">
        <div className="bg-primary p">
          <h3>Say Something...</h3>
        </div>
        <form className="form my-1">
          <textarea name="text" cols="30" rows="5"
            placeholder="Create a post" required 
            value={postText} onChange={e => setPostText(e.target.value)}></textarea>
          {(postText.trim()).length > 0 && 
            <input type="submit" className="btn btn-dark my-1" value="Submit" onClick={e => onSubmit(e)} />}
        </form>
      </div>

      <div className="posts">
        {posts.map(post => <PostItem key={post._id} post={post} />)}
      </div>        
    </Fragment>: <Fragment>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead"><i className="fas fa-user"></i> No Posts Found!!!</p>
    </Fragment>)}
  </Fragment>);
}

Posts.propTypes = {
  post: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(mapStateToProps, {
  getPosts, addPost
})(Posts);
