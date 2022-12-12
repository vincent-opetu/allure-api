const express = require("express")
const mongoose = require("mongoose")
const config = require('./utils/config')
const cors = require("cors");
var colors = require('colors')
const productRoute = require("./routes/productRoute")

const app = express();

colors.enable()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/products', productRoute)

// mongoose.set('strictQuery', false)
const log = console.log

if(!config.MONGO_URI) {
    log("MONGO_URI not found in .env file")
} else {
    mongoose
    .connect(config.MONGO_URI)
    .then(() => {
        log('DB Connection Successfull'.green);
        app.listen(config.PORT || 8080, () => {
            log(`Server is running on port: ${config.PORT}`.yellow);
        });
    })
    .catch(err => log(err))
}

