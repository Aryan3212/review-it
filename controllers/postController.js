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
  const newCamp = new PostModel({
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
  await newCamp.save();
  res.redirect(`/posts/`);
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const deletingCamp = await PostModel.deleteOne({ _id: id });
  res.redirect('/posts');
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const toBeUpdatedCamp = await PostModel.findById(id);
  // return if camp doesn't exist
  const { title, price, description, location } = req.body;

  toBeUpdatedCamp.title = title || toBeUpdatedCamp.title;
  toBeUpdatedCamp.price = price || toBeUpdatedCamp.price;
  toBeUpdatedCamp.description = description || toBeUpdatedCamp.description;
  if (location) {
    toBeUpdatedCamp.location.geometry.coordinates =
      location.coordinates || toBeUpdatedCamp.location.geometry.coordinates;
    toBeUpdatedCamp.location.properties.name =
      location.name || toBeUpdatedCamp.location.properties.name;
  }
  await toBeUpdatedCamp.save();
  // Redirect to somewhere useful
  res.status(204).redirect(`/posts/${toBeUpdatedCamp.id}`);
};
module.exports = {
  listPosts,
  showPost,
  createPost,
  updatePost,
  deletePost
};
