import Trending from './schema_trending.js';

export const getAllTrending = async () => {
  const trending = await Trending.find().lean();
  return trending;
};

export const getTrendingWithTag = async (tag) => {
  const trending = await Trending.findOne({ tag }).lean();
  return trending;
};

export default {
  getAllTrending,
  getTrendingWithTag
};