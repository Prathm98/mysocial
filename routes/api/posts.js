const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const User = require('../../models/User');
const router = express.Router();

// @route     POST api/posts
// @desc      Add post
// @access    Private
router.post("/", [auth, [
  check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(400).json({ errors: errors.array()});
  }

  try {
    let user = await User.findById(req.user.id).select('-password');
    if(!user){
      res.status(400).json({ errors: [{msg: 'User not exists'}]});
    }

    const newPost = new Post({
      text: req.body.text,
      user: req.user.id,
      name: user.name,
      avatar: user.avatar
    });

    await newPost.save();
    res.json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @route     GET api/posts
// @desc      Get all posts
// @access    Private
router.get("/", auth, async (req, res) => {
  try {
    let posts = await Post.find();

    if(!posts){
      res.status(400).json({msg: "No posts found"});
    }

    res.json(posts);
  } catch (error) {
    console.error(error);    
    res.status(500).send('Server Error');
  }
});

// @route     GET api/posts/:post_id
// @desc      Get post by id
// @access    Private
router.get("/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if(!post){
      res.status(400).json({msg: "Post not found"});
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    if(error.kind === 'ObjectId'){
      res.status(400).json({msg: 'Post not found'});
    }
    res.status(500).send('Server Error');
  }
});

// @route     DELETE api/posts/:post_id
// @desc      Delete post by id
// @access    Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if(!post){
      return res.status(400).json({msg: 'Post not found'});
    }

    if(post.user.toString() != req.user.id){
      return res.status(400).json({msg: 'You are not authorized'});
    }

    await Post.findByIdAndRemove(req.params.id);

    res.json({msg: "Post deleted"});
  } catch (error) {
    console.error(error);
    if(error.kind === 'ObjectId'){
      res.status(400).json({msg: 'Post not found'});
    }
    res.status(500).send('Server Error');
  }
});

// @route     Put api/posts/like/:post_id
// @desc      Like post by id
// @access    Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if(!post){
      return res.status(400).json({msg: 'Post not found'});
    }

    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
      return res.status(400).json({ msg: 'Post already liked by user!!!' });
    }

    post.likes.unshift({user: req.user.id});
    await post.save();

    res.json(post.likes);
    
  } catch (error) {
    console.error(error);
    if(error.kind === 'ObjectId'){
      res.status(400).json({msg: 'Post not found'});
    }
    return res.status(500).send('Server Error');
  }
});

// @route     Put api/posts/unlike/:post_id
// @desc      Like post by id
// @access    Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if(!post){
      return res.status(400).json({msg: 'Post not found'});
    }

    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
      return res.status(400).json({ msg: 'Post is not liked by user!!!' });
    }
    const removeIndex = post.likes.map(like => like.user).indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();

    res.json(post.likes);
    
  } catch (error) {
    console.error(error);
    if(error.kind === 'ObjectId'){
      res.status(400).json({msg: 'Post not found'});
    }
    return res.status(500).send('Server Error');
  }
});

// @route     POST api/posts/comment/:post_id
// @desc      Add comment to post by id
// @access    Private
router.post('/comment/:post_id', [auth, [
  check('text', 'Text is required!!!').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json(errors.array());
  }

  try {
    const user = await User.findById( req.user.id ).select('-password');

    const post = await Post.findById(req.params.post_id);
    if(!post){
      return res.status(400).json({ msg: 'Post not found!!!' });
    }

    const comment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    };

    post.comments.unshift(comment);
    await post.save();

    res.json(post.comments);
  } catch (e) {
    console.error(e);
    if(e.kind === 'ObjectId'){
      return res.status(400).json({ msg: 'Post not found!!!' });
    }
    res.status(500).send("Server Error!!!");
  }
});

// @route     DELETE api/posts/comment/:comment_id/:post_id
// @desc      Delete comment from post by id
// @access    Private
router.delete('/comment/:comment_id/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if(!post){
      return res.status(400).json({ msg: 'Post not found!!!' });
    }

    // Pull out comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    // Make sure comment exist
    if(!comment){
      return res.status(404).json({ msg: 'Comment not found!!!' });
    }

    // Check if user authorized
    if(comment.user.toString() !== req.user.id){
      return res.status(401).json({ msg: 'User not authorized!!!' });
    }

    const removeIndex = post.comments.map(comment => comment.id.toString()).indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);
    await post.save();

    res.json(post.comments);
  } catch (e) {
    console.error(e);
    if(e.kind === 'ObjectId'){
      return res.status(400).json({ msg: 'Post not found!!!' });
    }
    res.status(500).send("Server Error!!!");
  }
});

module.exports = router;