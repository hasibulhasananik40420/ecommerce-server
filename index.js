
const express = require('express')
require('dotenv').config()
const cors = require('cors')
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())



// mongodb connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.he6drsw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//varify jwt token
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthrized access' })
    }
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbiden access' })
        }
        req.decoded = decoded
        next()
    });
}

async function run() {

    try {

        await client.connect()
        const serviceCollection = client.db('medical-website').collection('services')
        const bookingCollection = client.db('medical-website').collection('booking')
        const userCollection = client.db('medical-website').collection('user')

        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })


        app.post('/booking', async (req, res) => {
            const booking = req.body
            const query = { treatment: booking.treatment, date: booking.date, patient: booking.patient }
            const exist = await bookingCollection.findOne(query)
            if (exist) {
                return res.send({ success: false, booking: exist })
            }
            const result = await bookingCollection.insertOne(booking)
            return res.send({ success: true, result })
        })

        // get all bookings

        app.get('/bookings', verifyJWT, async (req, res) => {
            const patient = req.query.patient
            const decodedEmail = req.decoded.email
            if (patient === decodedEmail) {
                const query = { patient: patient }
                const bookings = await bookingCollection.find(query).toArray()
                res.send(bookings)
            }
            else {
                return res.status(403).send({ message: 'Forbiden access' })
            }

        })



        app.get('/available', async (req, res) => {
            const date = req.query.date;

            const services = await serviceCollection.find().toArray();

            const query = { date: date };
            const bookings = await bookingCollection.find(query).toArray();
            // console.log(date);
            services.forEach(service => {
                const serviceBookings = bookings.filter(book => book.treatment === service.name);
                const bookedSlots = serviceBookings.map(book => book.slot);
                const available = service.slots.filter(slot => !bookedSlots.includes(slot));
                service.slots = available;
            });
            res.send(services);
        })

        // save a user

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const filter = { email: email }
            const options = { upsert: true };
            const updateDoc = {

                $set: user
            };

            const result = await userCollection.updateOne(filter, updateDoc, options)
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
            res.send({ result, token })
        })

        app.get('/user', verifyJWT, async (req, res) => {
            const users = await userCollection.find().toArray()
            res.send(users)
        })

        // make admin

        app.put('/user/admin/:email', verifyJWT, async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const updateDoc = {

                $set: { role: 'admin' }
            };
            const result = await userCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        // get  admin

        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email
            const user = await userCollection.findOne({ email: email })
            const isAdmin = user.role === 'admin'
            res.send({ admin: isAdmin })
        })

        // 75.8


    } finally {

        // await client.close();

    }

}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello medical website!')
})

app.listen(port, () => {
    console.log(`medical app listening on port ${port}`)
})