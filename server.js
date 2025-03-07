// server.js
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files from the "public" folder (for CSS, images, etc.)
app.use(express.static('public'));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Use method-override to support PUT & DELETE methods via query parameter ?_method=
app.use(methodOverride('_method'));

// In-memory storage for posts (resets when the server restarts)
let posts = [];

// Home route: display all posts
app.get('/', (req, res) => {
  res.render('index', { posts });
});

// Route to show form for creating a new post
app.get('/posts/new', (req, res) => {
  res.render('new');
});

// Route to handle form submission and add a new post
app.post('/posts', (req, res) => {
  const post = {
    id: posts.length + 1,
    url: req.body.image,
    title: req.body.title,
    content: req.body.content,
    createdAt: new Date()
  };
  posts.push(post);
  res.redirect('/');
});

// Route to display a single post by id
app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).send('Post not found');
  }
  res.render('post', { post });
});

// Route to show form for editing a post
app.get('/posts/:id/edit', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).send('Post not found');
  }
  res.render('edit', { post });
});

// Route to handle updating a post (PUT)
app.put('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).send('Post not found');
  }
  // Update the post's data
  post.title = req.body.title;
  post.content = req.body.content;
  // Optionally update the timestamp or keep the original creation date
  res.redirect(`/posts/${post.id}`);
});

// Route to handle deletion of a post (DELETE)
app.delete('/posts/:id', (req, res) => {
  posts = posts.filter(p => p.id !== parseInt(req.params.id));
  res.redirect('/');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
