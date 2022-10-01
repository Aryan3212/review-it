const { PostModel } = require('../models/postModel');
const { ReviewModel } = require('../models/ReviewModel');

const listPosts = async (req, res) => {
  const posts = await PostModel.find({});
  const user = req.user;
  const geoData = posts.map((c) => {
    const rObj = { ...c.location.toObject() };
    rObj.properties = {
      name: rObj.properties.name,
      title: c.title,
      id: c.id
    };
    return rObj;
  });
  res.status(200).render('posts/list', {
    title: 'Posts',
    posts,
    currentUser: user,
    geoData,
    mapTilerApiKey: process.env.MAPTILER_API_KEY
  });
};

const showPost = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const post = await PostModel.findById(id).populate('author');
  const geoData = [
    {
      ...post.location.toObject(),
      properties: {
        name: post.location.properties.name,
        title: post.title,
        id: post.id
      }
    }
  ];
  const reviews = await ReviewModel.find({
    post: post.id
  }).populate('author');
  res.status(200).render('posts/show', {
    title: post.title,
    post,
    reviews,
    currentUser: user,
    geoData,
    mapTilerApiKey: process.env.MAPTILER_API_KEY
  });
};

const createPost = async (req, res) => {
  const { title, price, description, longitude, latitude, name } = req.body;
  const author = req.user;
  const images = req.files.map((file) => {
    return {
      url: file.path,
      filename: file.filename
    };
  });
  const newPost = new PostModel({
    title,
    price,
    description,
    location: {
      geometry: {
        coordinates: [longitude, latitude]
      },
      properties: {
        name: name || ''
      }
    },
    author,
    images
  });
  await newPost.save();
  res.redirect(`/posts/`);
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const deletingPost = await PostModel.deleteOne({ _id: id });
  res.redirect('/posts');
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const toBeUpdatedPost = await PostModel.findById(id);
  // return if post doesn't exist
  const { title, price, description, location } = req.body;

  toBeUpdatedPost.title = title || toBeUpdatedPost.title;
  toBeUpdatedPost.price = price || toBeUpdatedPost.price;
  toBeUpdatedPost.description = description || toBeUpdatedPost.description;
  if (location) {
    toBeUpdatedPost.location.geometry.coordinates =
      location.coordinates || toBeUpdatedPost.location.geometry.coordinates;
    toBeUpdatedPost.location.properties.name =
      location.name || toBeUpdatedPost.location.properties.name;
  }
  await toBeUpdatedPost.save();
  // Redirect to somewhere useful
  res.status(204).redirect(`/posts/${toBeUpdatedPost.id}`);
};
module.exports = {
  listPosts,
  showPost,
  createPost,
  updatePost,
  deletePost
};
