import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String,
		maxLength: 300
	},
	joined: {
		type: String,
		//required: true
	},
	lastActive: {
		type: String,
		//required: true
	},
	pronouns: {
		type: String,
		required: true
	},
	pfpURL: {
		type: String,
		default: 'user_default.jpg'
	},
	login: {
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true,
			minLength: 8
		}
	}
}, { timestamps: true });

const User = model("User", userSchema, 'users');

export default User;