const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

app.use(cors());
app.use(bodyParser.json());

const rootCall = (req, res) => res.send('Thank you very much');
const users = ['Nowshin', 'Fahad', 'Nabiha', 'Rudba'];

const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });

//database connection

app.get('/', (req, res) => {


    res.send('Hola!!!');
});
app.get('/products', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object

        collection.find().limit(10).toArray((err, documents) => {

            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                
                res.send(documents);
            }

        });



        client.close();
    });
});


app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    console.log(req.query.sort);
    const name = users[id];
    res.send({ id, name });

})



//post
app.post('/addProduct', (req, res) => {
    //save to database
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        // perform actions on the collection object

        collection.insertOne(product, (err, result) => {

            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                console.log('successfully inserted', result);
                res.send(result.ops[0]);
            }

        });



        client.close();
    });




})






const port=process.env.PORT || 3000;

app.listen(port, () => console.log('Listening to port 3000'))