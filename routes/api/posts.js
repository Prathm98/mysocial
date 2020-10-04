const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Post = require('../../models/Post');
const auth = require('../../middleware/auth');

// @route     POST api/posts
// @desc      create post
// @access    Private
router.post('/', [auth, [
  check('text', 'Text is required!!!').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json(errors.array());
  }

  try {
    const user = await User.findById( req.user.id ).select('-password');

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });

    const post = await newPost.save();
    res.json(post);

  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error!!!");
  }
});

// @route     GET api/posts
// @desc      Get all posts
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1});

    res.json(posts);

  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error!!!");
  }
});

// @route     GET api/posts/:post_id
// @desc      Get post by id
// @access    Private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if(!post){
      return res.status(400).json({ msg: 'Post not found!!!' });
    }

    res.json(post);

  } catch (e) {
    console.error(e);
    if(e.kind === 'ObjectId'){
      return res.status(400).json({ msg: 'Post not found!!!' });
    }
    res.status(500).send("Server Error!!!");
  }
});

// @route     DELETE api/posts/:post_id
// @desc      Delete post by id
// @access    Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if(!post){
      return res.status(400).json({ msg: 'Post not found!!!' });
    }

    if(post.user.toString() !== req.user.id){
      return res.status(401).json({ msg: 'User is not authorized to delete this post.' });
    }

    await post.remove();
    res.json({ msg: "Post removed!!!" });

  } catch (e) {
    console.error(e);
    if(e.kind === 'ObjectId'){
      return res.status(400).json({ msg: 'Post not found!!!' });
    }
    res.status(500).send("Server Error!!!");
  }
});

// @route     PUT api/posts/like/:post_id
// @desc      Like post by id
// @access    Private
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if(!post){
      return res.status(400).json({ msg: 'Post not found!!!' });
    }

    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
      return res.status(400).json({ msg: 'Post already liked by user!!!' });
    }

    post.likes.unshift({user: req.user.id});
    await post.save();

    res.json(post.likes);
  } catch (e) {
    console.error(e);
    if(e.kind === 'ObjectId'){
      return res.status(400).json({ msg: 'Post not found!!!' });
    }
    res.status(500).send("Server Error!!!");
  }
});

// @route     PUT api/posts/unlike/:post_id
// @desc      Unlike post by id
// @access    Private
router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if(!post){
      return res.status(400).json({ msg: 'Post not found!!!' });
    }

    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
      return res.status(400).json({ msg: 'Post not yet liked by user!!!' });
    }

    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();

    res.json(post.likes);
  } catch (e) {
    console.error(e);
    if(e.kind === 'ObjectId'){
      return res.status(400).json({ msg: 'Post not found!!!' });
    }
    res.status(500).send("Server Error!!!");
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
