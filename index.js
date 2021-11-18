const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qqcyy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        // console.log('connected to database');
        const database = client.db('tourXwebsite');
        const packagesCollection = database.collection('packages');
       
        const bookingsCollection = database.collection('bookings');
     
        // GET API
        app.get('/packages', async(req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });

            app.get('/bookings', async(req, res) => {
           const cursor = bookingsCollection.find({});
            const bookings = await cursor.toArray();
            
            res.json(bookings);
        })

        app.get('/userbookings', async(req, res) => {
            const email = req.query.email;
                const query = {email: email}
                console.log(query);
                const cursor = bookingsCollection.find(query);
                const userbookings = await cursor.toArray();
                res.json(userbookings);
        })
       

        //Get Single 
        app.get('/packages/:id', async(req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = {_id: ObjectId(id) };
            const package = await packagesCollection.findOne(query);
            res.json(package);
        })

        app.get('/bookings/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id) };
            const booking = await bookingsCollection.findOne(query);
            res.json(booking);
        });


        //POST API
        app.post('/packages', async(req, res) => {
            const package = req.body;
            console.log('hit api', package);
           
            const result  = await packagesCollection.insertOne(package);
            console.log(result);
            res.json(result);
        });

    

//POST booking API
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            console.log(result);
            res.json(result);
        })

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = {email: user.email};
            const options = { upsert: true};
            const updateDoc = {$set: user};
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/bookings/:id', async(req, res) =>{
            const id = req.params.id;
            // console.log('put', booking);
            const filter = {_id: ObjectId(id)};
            const updateDoc = {$set: {status: 'shipped'}};
            const result = await bookingsCollection.updateOne(filter, updateDoc)
            res.json(result);
        })



        //DELETE API
        app.delete('/packages/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await packagesCollection.deleteOne(query);
            res.json(result);
        })
        app.delete('/bookings/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

app.listen(port, () => {
    console.log('Running Genius Server on Port', port);
})