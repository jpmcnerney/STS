const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const serverless = require('serverless-http');

const app = express();

app.use(bodyParser.json());

// Set up CORS headers to allow requests from your React app
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env); // React app origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/updateClickCount', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('DBDemoDatabase');
    const collection = db.collection('DBDemoCollection');

    const { boxTitle, buttonName } = req.body;
    const query = { category: boxTitle, name: buttonName };
    const update = { $inc: { clicks: 1 } };

    await collection.updateOne(query, update);

    res.status(200).send('Click count updated successfully');
  } catch (err) {
    console.error('Error updating click count:', err);
    res.status(500).send('Error updating click count');
  }
});

app.get('/getClickStats', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('DBDemoDatabase');
    const collection = db.collection('DBDemoCollection');

    const { boxTitle, buttonName } = req.query;

    // Get total clicks for the category
    const totalResults = await collection.find({ category: boxTitle }).toArray();
    const totalClicks = totalResults.reduce((sum, doc) => sum + (doc.clicks || 0), 0);

    // Get clicks for the specific button
    const buttonResult = await collection.findOne({ category: boxTitle, name: buttonName });
    const buttonClicks = buttonResult ? buttonResult.clicks || 0 : 0;

    // Calculate percentage
    const percentage = totalClicks ? (buttonClicks / totalClicks) * 100 : 0;

    res.status(200).json({ totalClicks, buttonClicks, percentage });
  } catch (err) {
    console.error('Error fetching click stats:', err);
    res.status(500).send('Error fetching click stats');
  }
});

// Health check route
app.get('/', (req, res) => {
  res.status(200).send('Server is running successfully');
});

module.exports.handler = serverless(app);


// const express = require('express');
// const bodyParser = require('body-parser');
// const { MongoClient } = require('mongodb');

// const app = express();
// const port = 3030;

// app.use(bodyParser.json());

// // Set up CORS headers to allow requests from your React app
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://main.d2t4nvo240qvkm.amplifyapp.com/'); // React app origin
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

// const uri = 'mongodb+srv://jpmcnerney1:jksm1234@dbdemocluster.co6z0ck.mongodb.net/';
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// app.post('/updateClickCount', async (req, res) => {
//   try {
//     await client.connect();
//     const db = client.db('DBDemoDatabase');
//     const collection = db.collection('DBDemoCollection');

//     const { boxTitle, buttonName } = req.body;
//     const query = { category: boxTitle, name: buttonName };
//     const update = { $inc: { clicks: 1 } };

//     await collection.updateOne(query, update);

//     res.status(200).send('Click count updated successfully');
//   } catch (err) {
//     console.error('Error updating click count:', err);
//     res.status(500).send('Error updating click count');
//   }
// });

// app.get('/getClickStats', async (req, res) => {
//     try {
//       await client.connect();
//       const db = client.db('DBDemoDatabase');
//       const collection = db.collection('DBDemoCollection');
  
//       const { boxTitle, buttonName } = req.query;
  
//       // Get total clicks for the category
//       const totalResults = await collection.find({ category: boxTitle }).toArray();
//       const totalClicks = totalResults.reduce((sum, doc) => sum + (doc.clicks || 0), 0);
  
//       // Get clicks for the specific button
//       const buttonResult = await collection.findOne({ category: boxTitle, name: buttonName });
//       const buttonClicks = buttonResult ? buttonResult.clicks || 0 : 0;
  
//       // Calculate percentage
//       const percentage = totalClicks ? (buttonClicks / totalClicks) * 100 : 0;
  
//       res.status(200).json({ totalClicks, buttonClicks, percentage });
//     } catch (err) {
//       console.error('Error fetching click stats:', err);
//       res.status(500).send('Error fetching click stats');
//     }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });