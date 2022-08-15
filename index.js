const express = require('express');
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.em3xo2p.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        await client.connect();
        console.log('db connected');
        const notesColection = client.db("Easy-Note").collection("notes");

        //search notes by email
        app.get('/my-notes', async(req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = notesColection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        //add a new note
        app.post('/my-notes', async(req, res) => {
            const doc = req.body;
            const result = await notesColection.insertOne(doc);
            res.send(result);
        });

        //update note
        app.put('/my-notes/:id', async(req, res) => {
            const id = req.params.id;
            const updatedNote = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert:true};
            const updateDoc = {
                $set: updatedNote
            }
            const result = await notesColection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        //delete note 
        app.delete('/my-notes/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await notesColection.deleteOne(query);
            res.send(result);
        });
        
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Getting response from the api');
});

app.listen(port, () => {
    console.log("App is running on PORT : ", port);
});

