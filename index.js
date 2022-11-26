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
        const furnitureCollections = client.db('furnitureCollections').collection('allfurniture')
        const homeFurnitureCollection = client.db('furnitureCollections').collection('homepagefurniture')
        const productsBooked = client.db('furnitureCollections').collection('booking')

        app.get('/furniture', async(req, res) =>{
            const query = {}
            const result = await homeFurnitureCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/products/:category' , async(req, res) =>{
            const category = req.params.category
            console.log(category)
            const query = {category_id : category}
            const result = await furnitureCollections.find(query).toArray()
            res.send(result)
        })

        app.post('/booking', async(req, res) =>{
            const product = req.body
            console.log(product)
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