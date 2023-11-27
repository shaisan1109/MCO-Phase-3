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

export default router;