const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n5sag.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello DB it is working')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentCollection = client.db("Paintingnetic").collection("appointments");
    const ServiceCollection = client.db("Paintingnetic").collection("services");
    const reviewCollection = client.db("Paintingnetic").collection("reviews");
    const adminCollection = client.db("Paintingnetic").collection("admins");

    app.post('/addAppointment', (req, res) => {
        const appointment = req.body;
        console.log(appointment);
        appointmentCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/appointments', (req, res) => {
        appointmentCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addService', (req, res) => {
        const newProduct = req.body;
        console.log('adding new event: ', newProduct);

        ServiceCollection.insertOne(newProduct)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/addReview', (req, res) => {
        const newProduct = req.body;
        console.log('adding new event: ', newProduct);

        reviewCollection.insertOne(newProduct)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    })

    app.post('/appointmentsByDate', (req, res) => {
        const date = req.body;
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                const filter = { date: date.date }
                if (admins.length === 0) {
                    filter.email = email;
                }
                appointmentCollection.find(filter)
                    .toArray((err, documents) => {
                        console.log(email, date.date, admins, documents)
                        res.send(documents);
                    })
            })
    })

    app.post('/addAdmin', (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        adminCollection.insertOne({ name, email })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/services', (req, res) => {
        ServiceCollection.find({})
        .toArray((err, items) => {
            console.log(err);
            res.send(items);
            console.log('form database', items);
        })
    })

    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
        .toArray((err, items) => {
            console.log(err);
            res.send(items);
            console.log('form database', items);
        })
    })
});


app.listen(process.env.PORT || port);