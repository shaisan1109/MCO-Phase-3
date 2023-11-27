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

// // POST (create) post
// router.post('/posts', (req, res) => {
//     const post = new Post({
//       user: req.body.user,
//       op: req.body.op,
//       title: req.body.title,
//       content: req.body.content,
//       points: req.body.points,
//       timePosted: req.body.timePosted
//     });
//     post.save();
//     res.json({ message: "Created post" });
// });

// PATCH (update) one post
// router.patch('/post/:id', updatePost);

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

// DELETE route to delete a post
router.delete('/delete/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

export default router;