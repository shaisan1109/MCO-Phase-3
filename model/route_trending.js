import Router from 'express';
import Trending from './schema_trending.js';

const router = Router();

// GET all trending
router.get('/', async (req, res) => {
    Trending.find().then((trending) => {
      res.json(trending);
      res.end();
    });
});

// GET one trending with tag
router.get('category/:tag', async (req, res) => {
  Trending.findOne({ tag: req.params.tag }).then((trending) => {
    res.json(trending);
    res.end();
  });
});

export default router;