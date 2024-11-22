// const express = require('express')
// const app = express()
// require('dotenv').config()
// const port = process.env.PORT || 4000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.dev' }); // Ensure .env.dev is loaded correctly

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || '';
const DB_NAME = 'todoDB';

let db, todosCollection;

// Debugging: Check if the environment variables are loaded
console.log('MONGO_URI:', MONGO_URI);

if (!MONGO_URI.startsWith('mongodb://')) {
  console.error('Invalid MONGO_URI. Ensure it is correctly defined in .env.dev.');
  process.exit(1);
}

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(DB_NAME);
    todosCollection = db.collection('todos');
    console.log(`Connected to database: ${DB_NAME}`);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// API Routes
app.get('/api/todos', async (req, res) => {
  const todos = await todosCollection.find().toArray();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: 'Task is required' });

  const newTodo = { task, completed: false };
  const result = await todosCollection.insertOne(newTodo);

  res.status(201).json({ _id: result.insertedId, ...newTodo });
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;

  const updatedTodo = await todosCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...(task && { task }), ...(completed !== undefined && { completed }) } },
    { returnDocument: 'after' }
  );

  if (!updatedTodo.value) return res.status(404).json({ error: 'Todo not found' });
  res.json(updatedTodo.value);
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;

  const result = await todosCollection.deleteOne({ _id: new ObjectId(id) });

  if (!result.deletedCount) return res.status(404).json({ error: 'Todo not found' });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
