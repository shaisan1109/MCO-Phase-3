import Comment from './schema_comment.js';

export const getCommentOfPost = async (id) => {
	const comment = await Comment.find({ postID: id }).sort({ timePosted: 1 }).lean();
	return comment;
};

export const getCommentsWithKeyword = async (q) => {
	const comment = await Comment.find({ content: {$regex: q, $options: "i"} }).lean();
	return comment;
}

export default {
	getCommentOfPost,
	getCommentsWithKeyword
};