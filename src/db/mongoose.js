const mongoose = require("mongoose")

require("dotenv").config();

const connectionURL = process.env.MONGODB_URL + "/task-manager"

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then((result) => {
    // console.log("Sucessfully connected to mongoose")
}).catch((error) => {
    console.log(error)
})