const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mcdvihz.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const furnitureCollections = client.db('furnitureCollections').collection('homepagefurniture')

        app.get('/furniture', async(req, res) =>{
            const query = {}
            const result = await furnitureCollections.find(query).toArray()
            res.send(result)
        })
    }
    finally{

    }
}

run().catch(console.dir)


app.get('/', (req, res) =>{
    res.send('api running')
})

app.listen(port, () => console.log(`server on port ${port}`))