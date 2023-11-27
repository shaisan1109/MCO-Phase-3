import Trending from './schema_trending.js';

export const getAllTrending = async () => {
  const trending = await Trending.find().lean();
  return trending;
};

export default getAllTrending;