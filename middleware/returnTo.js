const returnTo = async (req, res, next) => {
  const currentUser = req.currentPath;
  const { post_id } = req.params;
  let reviews = await ReviewModel.find({ author: currentUser });
  if (!post.author.equals(req.user.id)) {
    return res.redirect(`/posts/${id}`);
  }
  return next();
};
