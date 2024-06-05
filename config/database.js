const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://samypasswala78780:8081123456@cluster0.bmpcrj9.mongodb.net/')
const db = mongoose.connection

db.on('connected', (err) => {
    if (err) {
        console.log("DataBase Is Not Connected");
        return false
    }
    console.log("DataBase Is Connected");
})

module.exports = db