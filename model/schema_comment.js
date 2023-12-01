import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const commentSchema = new Schema({
	user: {
		type: String,
		required: true
	},
	postID: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	points: {
		type: Number,
		default: 0
	},
	timePosted: {
		type: String,
		required: true
	}
}, { timestamps: true });

// Last parameter is the collection on mongodb
const Comment = model('Comment', commentSchema, "comments");

export default Comment;