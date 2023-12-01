import Router from 'express';
import Comment from './schema_comment.js';

const router = Router();

// GET comment of post with id=?
router.get('/post/:id', (req, res) => {
    Comment.find({ postID: req.params.id }) // get only comments under the given post
        .sort({ timePosted: 1 })
        .then((post) => {
        res.json(post);
        res.end();
        });
});

// GET posts with multiple queries (search)
router.get('/search', async (req, res) => {
    try {
      const search = req.query.q || ""; // if search has no query, simply assume it's ""
  
      // i = search is not case-sensitive
      const comments = await Comment.find({ content: {$regex: search, $options: "i"} });
      const response = { error: false, comments };
  
      res.status(200).json(response);
      res.end();
    } catch {
      res.status(500).json({ error: true, message: 'Internal Server Error'});
      res.end();
    }
  });

// GET comments by a certain user
router.get('/user/:username', (req, res) => {
  Comment.find({ user: req.params.username }).then((comment) => {
    res.json(comment);
    res.end();
  });
});

// POST comment under reply
router.post('/post/:id', async (req, res) => {
  const { content } = req.body;
    const postID = req.params.id;

    const username = req.session.user.username;

    const newComment = new Comment({
        user: username,
        postID: postID,
        content: content,
        timePosted: new Date().toISOString() 
    });

    await newComment.save();
});

// PUT route to edit a comment
router.put('/edit/:id', async (req, res) => {
  try {
    const commentId = req.params.id;
    const updatedContent = req.body.content;
    await Comment.findByIdAndUpdate(commentId, { content: updatedContent });
    res.status(200).json({ message: 'Comment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

// DELETE route to delete a comment
router.delete('/delete/:id', async (req, res) => {
  try {
    const commentId = req.params.id;
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

export default router;