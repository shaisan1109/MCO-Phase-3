import Router from 'express';
import Post from './schema_post.js';

const router = Router();

// GET all posts according to points (popular posts)
router.get('/', async (req, res) => {
  Post.find()
  .sort({ points: -1 })
  .limit(5) // homepage only shows first 5
  .then((post) => {
    res.json(post);
    res.end();
  });
});

router.get('/popular', async (req, res) => { // solo page version
  Post.find()
    .sort({ points: -1 })
    .then((post) => {
      res.json(post);
      res.end();
    });
});

// GET all posts according to upload date (What's New)
router.get('/', async (req, res) => {
  Post.find()
    .sort({ timePosted: -1 })
    .limit(5) // homepage only shows first 5
    .then((post) => {
      res.json(post);
      res.end();
    });
});

router.get('/new', async (req, res) => { // solo page version
  Post.find()
    .sort({ timePosted: -1 })
    .then((post) => {
      res.json(post);
      res.end();
    });
});

// GET all community posts
router.get('/', async (req, res) => {
  Post.find({ community: true })
    .sort({ points: -1 })
    .then((post) => {
      res.json(post);
      res.end();
    });
});

// GET one post thru id
router.get('/post/:id', (req, res) => {
    Post.findById(req.params.id).then((post) => {
      res.json(post);
      res.end();
    });
});

// GET posts by a certain user
router.get('/user/:username', (req, res) => {
  Post.find({ user: req.params.username }).then((post) => {
    res.json(post);
    res.end();
  });
});

// GET posts with multiple queries (search)
router.get('/search', async (req, res) => {
  try {
    const search = req.query.q || ""; // if search has no query, simply assume it's ""

    // i = search is not case-sensitive
    const posts = await Post.find({ $or: [
      { title: {$regex: search, $options: "i"} },
      { content: {$regex: search, $options: "i"} },
      { shortDesc: {$regex: search, $options: "i"} }
    ]});
    const response = { error: false, posts };

    res.status(200).json(response);
    res.end();
  } catch {
    res.status(500).json({ error: true, message: 'Internal Server Error'});
    res.end();
  }
});

// PATCH post score to upvote
router.patch('/post/:id', async (req, res) => {
  const id = req.params.id;
  const addedPoints = req.body.upvote;

  // Post to upvote/downvote
  const post = await Post.findOne({ _id: id }); // to retrieve original post points
  const updatedPost = await Post.findOneAndUpdate({ _id: id }, { points: (post.points + addedPoints) });

  try {
    res.status(200).json({ message: 'Post upvoted succesfully' });

    const response = { error: false, updatedPost };
    res.status(200).json(response);
    res.end();
  } catch (error) {
    res.status(500).json({ error: true, message: 'Internal Server Error' });
    res.end();
  }
});

// PUT route to edit a post
router.put('/edit/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedContent = req.body.content;
    await Post.findByIdAndUpdate(postId, { content: updatedContent });
    res.status(200).json({ message: 'Post updated successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

// get route to delete a post
router.get('/delete/:id', async (req, res) => {
  try {
      const postId = req.params.id;

      // Fetch the post
      const post = await Post.findById(postId);
      if (!post) {
          return res.status(404).send('Post not found');
      }

      // Check if the logged-in user is the author of the post
      // Compare the username in the post with the username in the session
      if (req.user && post.user === req.user.username) {
          await Post.findByIdAndDelete(postId);
          res.redirect('/'); // Redirect to homepage or some confirmation page
      } else {
          res.status(403).send('You are not authorized to delete this post');
      }
  } catch (error) {
      res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

// GET posts with a certain tag (for trending)
router.get('category/:tag', async (req, res) => {
  try {
    const posts = await Post.find({ tags: tag }).lean();
    const response = { error: false, posts };

    res.status(200).json(response);
    res.end();
  } catch {
    res.status(500).json({ error: true, message: 'Internal Server Error'});
    res.end();
  }
});

export default router;
