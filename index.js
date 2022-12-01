const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mcdvihz.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const furnitureCollections = client.db('furnitureCollections').collection('allfurniture')
        const homeFurnitureCollection = client.db('furnitureCollections').collection('homepagefurniture')
        const productsBooked = client.db('furnitureCollections').collection('booking')
        const allUserCollection = client.db('furnitureCollections').collection('user')
        const productAdded = client.db('furnitureCollections').collection('addproduct')
        const advertiseProduct = client.db('furnitureCollections').collection('advertise')

        app.get('/furniture', async(req, res) =>{
            const query = {}
            const result = await homeFurnitureCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/products/:category' , async(req, res) =>{
            const category = req.params.category
            // console.log(category)
            const query = {category : category}
            const result = await furnitureCollections.find(query).toArray()
            res.send(result)
        })

        app.post('/booking', async(req, res) =>{
            const product = req.body
            const result = await productsBooked.insertOne(product)
            res.send(result) 
        })

        app.post('/user', async(req, res) =>{
            const user = req.body 
            const result = await allUserCollection.insertOne(user)
            res.send(result)
        })

        app.post('/googleuser', async(req, res) =>{
            const user = req.body 
            const result = await allUserCollection.insertOne(user)
            res.send(result)
        })

        app.get('/user/admin/:email', async(req, res) =>{
            const email = req.params.email 
            // console.log(email)
            const query = {email}
            const user = await allUserCollection.findOne(query)
            res.send({isAdmin: user?.role === 'admin'})
        })

        app.get('/user/seller/:email', async(req, res) =>{
            const email = req.params.email 
            // console.log(email)
            const query = {email}
            const user = await allUserCollection.findOne(query)
            res.send({isSeller: user?.role === 'seller'})
        })

        app.get('/user/buyer/:email', async(req, res) =>{
            const email = req.params.email 
            const query = {email}
            const user = await allUserCollection.findOne(query)
            res.send({isBuyer: user?.role === 'buyer'})
        })

        app.get('/allseller', async(req, res) =>{
            const query = {role : "seller"}
            const seller = await allUserCollection.find(query).toArray()
            res.send(seller)
        })

        app.get('/allbuyer', async(req, res) =>{
            const query = {role : "buyer"}
            const buyer = await allUserCollection.find(query).toArray()
            res.send(buyer)
        })

        app.delete('/allseller/:id', async(req, res) =>{
            const id = req.params.id 
            // console.log(id)
            const query = {_id: ObjectId(id)}
            const result = await allUserCollection.deleteOne(query)
            res.send(result)
        })

        app.delete('/allbuyer/:id', async(req, res) =>{
            const id = req.params.id 
            const query = {_id : ObjectId(id)}
            const result = await allUserCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/myorder', async(req, res) =>{
            const email = req.query.email
            // console.log(email)
            const query = {userEmail : email}
            const result = await productsBooked.find(query).toArray()
            res.send(result)
        })

        app.delete('/myorder/:id', async(req, res) =>{
            const id = req.params.id
            // console.log(id)
            const query = {_id: ObjectId(id)}
            const result = await productAdded.deleteOne(query)
            res.send(result)
        })

        app.post('/addproduct', async(req, res) =>{
            const product = req.body 
            const result = await productAdded.insertOne(product)
            const newProduct = await furnitureCollections.insertOne(product)
            res.send(result)
        })

        app.get('/addproduct', async(req, res) =>{
            const query = {}
            const products = await productAdded.find(query).toArray()
            res.send(products)
        })

        app.post('/advertise', async(req, res) =>{
            const product = req.body 
            const result = await advertiseProduct.insertOne(product)
            res.send(result)
        })

        app.get('/advertise', async(req, res) =>{
            const query = {}
            const result = await advertiseProduct.find(query).toArray()
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