import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const trendingSchema = new Schema({
	title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    imgURL: String
});

// Last parameter is the collection on mongodb
const Trending = model("Trending", trendingSchema, "trending");

export default Trending;