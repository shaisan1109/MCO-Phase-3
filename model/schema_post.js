import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const postSchema = new Schema({
	user: {
		type: String,
		required: true
	},
	op: {
		type: Boolean,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	shortDesc: {
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
		//required: true
	}
}, { timestamps: true });

// Last parameter is the collection on mongodb
const Post = model('Post', postSchema, "posts");

export default Post;