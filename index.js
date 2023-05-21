const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // toy by user
        const userCollection = client.db('allToys').collection('userToy')
        app.get('/getToyByText/:id')

        const indexKeys = { toyName: 1, category: 1 };
        const indexOptions = { category: "titleCategory" };
        app.get("/getToyByText/:text", async (req, res) => {
            const text = req.params.text;
            const result = await userCollection
                .find({
                    $or: [
                        { toyName: { $regex: text, $options: "i" } },
                        { category: { $regex: text, $options: "i" } },
                    ],
                })
                .toArray();
            res.send(result);
        });
                 

        app.get('/toyGallary', async (req, res) => {
            const result = await toyCollection.find().toArray()
            res.send(result)
        })
        //get toys category
        // app.get('/category', async (req, res) => {
        //     const result = await toyCategoryCollection.find().toArray()
        //     res.send(result)
        // })
       
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
        // get data by single id
        app.get('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allToysCollection.findOne(query)
            res.send(result)
        })
        // delete data by single id
        app.delete('/usertoy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })

        app.get('/usertoy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(query);
            res.send(result)
        })

        app.put('/usertoy/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updatedtoy = req.body;
            const toy = {
                $set: {
                    toyName: updatedtoy.toyName,
                    quantity: updatedtoy.quantity,
                    price: updatedtoy.price,
                    details: updatedtoy.details,
                    photoUrl: updatedtoy.photoUrl,
                }
            };
            const result = await userCollection.updateOne(filter, toy, options)
            res.send(result)
        })

        // get toy by user email
        app.get('/usertoy', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })
        // get toy by user
        app.post('/usertoy', async (req, res) => {
            const toys = req.body;
            const result = await userCollection.insertOne(toys);
            res.send(result)
        })
        app.get("/allToysByCategory/:category", async (req, res) => {
          console.log(req.params.id);
          const toys = await userCollection
            .find({
              category: req.params.category,
            })
            .toArray();
          res.send(toys);
        });
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