const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xd4auwc.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();


        //Gallary Toys
        const toyCollection = client.db('animalToyDB').collection('toyGallary')
        //toys category
        const toyCategoryCollection = client.db('toyCategory').collection('category')

        // allToys
        const allToysCollection = client.db('allToys').collection('allToy')

        app.get('/toyGallary', async (req, res) => {
            const result = await toyCollection.find().toArray()
            res.send(result)
        })
        //get toys category
        app.get('/category', async (req, res) => {
            const result = await toyCategoryCollection.find().toArray()
            res.send(result)
        })
        // get data from mongodb database
        app.get('/alltoys', async (req, res) => {
            const cursor = allToysCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        })

        // get data from client side
        app.post('/alltoys', async (req, res) => {
            const newToys = req.body;
            const result = await allToysCollection.insertOne(newToys);
            res.send(result)
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
    res.send('server running for Animal kidol')
})


app.listen(port, () => {
    console.log(`server running at port ${port}`);
})