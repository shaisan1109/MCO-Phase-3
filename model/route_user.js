import Router from 'express';
import User from './schema_user.js';

const router = Router();

// GET one user thru username
router.get('/user/:username', (req, res) => {
    User.findOne({ username: req.params.username }).then((user) => {
      res.json(user);
      res.end();
    });
});

// GET one user thru username (but for registration)
router.get('/register', async function(req, res) {
  // your code here
  try {
      const user = await User.findOne({ username: req.query.username }).exec();
      console.log(user);
      if (user) {
          res.sendStatus(409);
      }
      else {
          res.sendStatus(200);
      }
  } catch (err) {
      console.error(err);
      res.sendStatus(500);
  }
});

// GET one user thru email (for registration)
router.get('/register', async function(req, res) {
  // your code here
  try {
      const user = await User.findOne({ 'login.email': req.query.email }).exec();
      console.log(user);
      if (user) {
          res.sendStatus(409);
      }
      else {
          res.sendStatus(200);
      }
  } catch (err) {
      console.error(err);
      res.sendStatus(500);
  }
});

// POST (create) user
router.post('/user_created', (req, res) => {
  const user = new User({
    username: req.body.username,
    login: req.body.login,
    pronouns: req.body.pronouns,
    description: req.body.description
  });
  user.save();
  res.json({ message: "Candidate has been successfully added. "});
});

// PUT (update) user
router.put('/user_update', async(req, res) => {
  try {
    // gets username from the session
    const sessionId = req.session.user;

    // gets the user's NEW info
    const newUsername = req.body.username;
    const newLogin = req.body.login;
    const newPronouns = req.body.pronouns;
    const newDescription = req.body.description;
    
    // replace user info with NEW info
    await User.updateOne(sessionId, { username: newUsername, login: newLogin, description: newDescription, pronouns: newPronouns});
    res.status(200).json({ message: 'User Info updated successfully' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
});

export default router;