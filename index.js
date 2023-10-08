const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://jewelary_shop:Zx3uYdV5OYKJAR5e@cluster0.kbqlzif.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const usersCollection = client.db("jewellaryShop").collection("users");
    const jewelaryCollection = client.db("jewellaryShop").collection("jewellery");
    const myJewelleryCollection = client.db("jewellaryShop").collection("myJewellery");




    // admin api 
    app.get('/user/admin/:email',  async (req, res) => {
      const email = req.params.email;
      const decodedEmail = req.decoded.email;

      if (email !== decodedEmail) {
        return ({ admin: false })
      }
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const result = { admin: user?.role === 'admin' }
      res.send(result)
    })
    // users api 

    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const option = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(query, updateDoc, option);
      console.log(result);
      res.send(result);
    })

    app.post('/user', async (req, res) => {
      const body = req.body;
      const result = await usersCollection.insertOne(body);
      res.send(result)
    })

    app.post('/alljewellery', async (req, res) => {
      const body = req.body;
      const result = await jewelaryCollection.insertOne(body);
      res.send(result);
    })

    app.get('/alljewellery/:email', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await jewelaryCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/alljewellery', async (req, res) => {
      const body = req.body;
      const result = await jewelaryCollection.find(body).toArray();
      res.send(result)
    })


    app.post('/myjewellary', async (req, res) => {
      const body = req.body;
      const result = await myJewelleryCollection.insertOne(body);
      res.send(result);
    })
    app.get('/myjewellary/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await myJewelleryCollection.find(query).toArray();
      res.send(result);
    })

    app.delete('/myjewellarydelete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myJewelleryCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('jewelary is running')
})

app.listen(port, () => {
  console.log(`jewelary is is running on port ${port}`);
})