var cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require("dotenv");
var assert = require('assert')
const router = express.Router()
const url = 'mongodb://localhost/UserDBex'

const DB = 'mongodb+srv://sanya:SanyaJain@cluster0.hffcg.mongodb.net/cryptoData?retryWrites=true&w=majority'
dotenv.config();
const app = express()
app.use(cors())
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`connection successful`);
}).catch((err) => console.log(err));
app.use(express.json())

const userRouter = require('./routes/users')
app.use('/users', userRouter)

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.log('Server started')
})



router.get('/get-data', function(req, res, next) {
    var resultArray = [];
    mongo.connect(url, function(err, DB){
        assert.equal(null, err);
        var cursor = DB.collection('users').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function() {
            DB.close();
            res.send();
        });
    });
});