import Post from './schema_post.js';

export const getPopularPosts = async () => {
	const post = await Post.find().sort({ points: -1 }).lean();
	return post;
};

export const home_getPopularPosts = async () => {
	const post = await Post.find().sort({ points: -1 }).limit(5).lean();
	return post;
};

export const getRecentPosts = async () => {
	const post = await Post.find().sort({ timePosted: -1 }).lean();
	return post;
};

export const home_getRecentPosts = async () => {
	const post = await Post.find().sort({ timePosted: -1 }).limit(5).lean();
	return post;
};

export const home_getCommunityPosts = async () => {
	const post = await Post.find({ community: true }).sort({ points: -1 }).lean();
	return post;
};

export const getPost = async (id) => {
	const post = await Post.findById(id).lean();
	return post;
};

export const getPostByUser = async (username) => {
	const post = await Post.find({ user: username }).lean();
	return post;
};

export const getPostsWithKeyword = async (q) => {
	const post = await Post.find({ $or: [
		{ title: {$regex: q, $options: "i"} },
		{ content: {$regex: q, $options: "i"} },
		{ shortDesc: {$regex: q, $options: "i"} }
	  ]}).lean();
	return post;
}

export default { 
	getPopularPosts,
	home_getPopularPosts,
	getRecentPosts,
	home_getRecentPosts,
	getPost,
	getPostByUser,
	getPostsWithKeyword,
	home_getCommunityPosts
};