const express=require('express')

const app=express()

require('dotenv').config()

const dbConfig= require('./config/dbConfig')

const port=process.env.PORT||5000

app.use(express.json())

const userRoute=require('./routes/usersRoute')
const busRoute=require('./routes/busesRoute')
const bookingRoute=require('./routes/bookingsRoute')

app.use('/api/users',userRoute)
app.use('/api/buses', busRoute);
app.use('/api/bookings', bookingRoute);
//heroku
const path = require("path");
if(process.env.NODE_ENV === "production")
{
    app.use(express.static("client/build"));
  
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
    });
}

app.listen(port,()=>console.log(`Listent on the port ${port}`))