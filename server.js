/* -------- REQUIRE -------- */
// .env
import 'dotenv/config';

// Express/hbs requirements
import express from 'express';
import expressHbs from 'express-handlebars';

// Session requirements
import session from 'express-session'; // session
const store = new session.MemoryStore();

// Mongo
import mongoose from 'mongoose';

// Others
import bodyParser from 'body-parser';
import cors from 'cors';

// DB Routes
import trendingRoutes from './model/route_trending.js';
import postRoutes from './model/route_post.js';
import userRoutes from './model/route_user.js';
import commentRoutes from './model/route_comment.js';

// DB functions
import getAllTrending from './model/controller_trending.js';

import {
    getPopularPosts, 
    home_getPopularPosts, 
    getRecentPosts, 
    home_getRecentPosts,
    getPost,
    getPostByUser,
    getPostsWithKeyword,
    home_getCommunityPosts
} from './model/controller_post.js';

import getUser from './model/controller_user.js';

import {
    getCommentOfPost,
    getCommentsWithKeyword,
    getCommentsByUser
} from './model/controller_comment.js';

const app = express();

/* -------- INITIALIZE BODYPARSER -------- */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

/* -------- INITIALIZE SESSION -------- */
app.use(session ({
    secret: 'sussus amongus', // used to sign session ID cookie
    cookie: {
        maxAge: 1814400000 // specs: 3 weeks per login
    },
    resave: true,
    saveUninitialized: false, // bc what if the user isn't logged in yet
    store: store
}));

/* -------- HANDLEBARS SETTINGS -------- */
// Import public folder
app.use(express.static('public'));

// Use .hbs as handlebars file
app.engine('.hbs', expressHbs.engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

/* -------- FRONTEND ROUTES -------- */
// Index
app.get('/', async (req, res) => {
    const trending = await getAllTrending();
    const popular = await home_getPopularPosts();
    const recent = await home_getRecentPosts();
    const community = await home_getCommunityPosts();

    res.render('index', {
        title: 'Home',
        trending: trending, // trending games
        popular: popular, // popular posts
        recent: recent, // recent posts
        community: community
    });
});

// Popular posts page
app.get('/popular', async (req, res) => {
    const popular = await getPopularPosts();
    res.render('popular', { title: 'Popular Posts', popular: popular });
});

// Recent posts page
app.get('/new', async (req, res) => {
    const recent = await getRecentPosts();
    res.render('new', { title: 'Recent Posts', recent: recent });
});

// About page
app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// Post (with comments)
app.get('/post/:id', async (req, res) => {
    // Main post objects
    const post = await getPost(req.params.id);
    const user = await getUser(post.user);

    // Comment objects
    const comments = await getCommentOfPost(req.params.id);
    const commenters = await getUser(comments.user);

    res.render('post', {
        title: post.title,
        post: post,
        user: user,
        comments: comments,
        commenters: commenters
    });
});

import Comment from './model/schema_comment.js'; // Import the Comment model

app.post('/post/:id', async (req, res) => {
    const { content } = req.body;
    const postID = req.params.id;

    const username = req.session.user.username;

    const newComment = new Comment({
        user: username,
        postID: postID,
        content: content,
        timePosted: new Date().toISOString() 
    });

    await newComment.save(); // Save the new comment to the database

    res.redirect(`/post/${postID}`); // Redirect back to the post page
});

// User profile
app.get('/user/:username', async (req, res) => {
    const user = await getUser(req.params.username);
    const userPost = await getPostByUser(req.params.username);
    const userComment = await getCommentsByUser(req.params.username);

    res.render('user', {
        title: req.params.username,
        user,
        userPost,
        userComment
    });
});

// User object
import User from './model/schema_user.js' // user model

// Register form
app.post('/register', async (req, res) => {
    const user = new User({
        username: req.body.username,
        login: {
            email: req.body.email,
            password: req.body.password
        },
        pronouns: req.body.pronouns,
        description: req.body.description
    });

    await user.save();

    res.render('user_created', { title: 'Success!' })
});

// Login request
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if(username && password) {
        const user = await User.findOne({ username }); // check if user exists

        // If user exists
        if(user) {
            // If passwords match
            if(user.login.password === req.body.password) {
                req.session.authenticated = true;
                req.session.user = {
                    username: user.username,
                    userId: user._id
                };
                res.redirect('/');
            } else {
                res.send("Wrong password!");
            }
        } else { // user does not exist
            res.send('Username does not exist.');
        }
    } else res.status(400).json({ msg: 'Please enter both username and password' });
});

// Create post page
app.get('/create_post', async (req, res) => {
    res.render('createPost', { title: 'Create Post' });
});

import Post from './model/schema_post.js'; // Import the Post model

// Route to handle post creation form submission
app.post('/create_post', async (req, res) => {
    const { title, shortDesc, content } = req.body;

    // Check if the user is authenticated and session data is available
    if (req.session.authenticated && req.session.user) {
        const username = req.session.user.username;
        const op = true; // or determine based on your application logic

        const newPost = new Post({
            user: username,
            op: op,
            title: title,
            shortDesc: shortDesc,
            content: content,
            timePosted: new Date().toISOString() 
        });

        await newPost.save(); // Save the new post to the database
        res.redirect('/'); // Redirect to the home page or another page of your choice
    } else {
        // If the user is not logged in, redirect them to the login page or send an error message
        res.redirect('/create_post#login'); // Redirect to the login page
        // or res.status(403).json({ msg: 'Unauthorized access' });
    }
});

// Search page
app.get('/search', async (req, res) => {
    // Query values
    const search = req.query.q || ""; // if search has no query, simply assume it's ""
    const type = req.query.type;

    // Result variables
    const postResults = await getPostsWithKeyword(search);
    const commentResults = await getCommentsWithKeyword(search);

    if(search === "") {
        res.render('search', { title: 'Search'});
    } else {
        if(type === "post") {
            res.render('search', {
                title: 'Search',
                postResults: postResults
            });
        } else { // type is comment
            res.render('search', {
                title: 'Search',
                commentResults: commentResults
            });
        }
    }
});

/* -------- BACKEND ROUTES -------- */
app.use(trendingRoutes);
app.use(postRoutes);
app.use(userRoutes);
app.use(commentRoutes);

/* -------- APP LISTEN -------- */
app.listen(process.env.PORT, () => {
    console.log('Server is starting at port', process.env.PORT);
    mongoose.connect(process.env.MONGODB_URI, { dbname: process.env.DB_NAME });

    mongoose.connection.on('connected', () => {
        console.log('Connected to database successfully');
    })
});