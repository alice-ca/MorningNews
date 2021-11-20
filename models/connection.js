const mongoose = require('mongoose');

const options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

mongoose.connect('mongodb+srv://alice:Capsule1995$@cluster0.vjira.mongodb.net/morningnews?retryWrites=true&w=majority',
    options,
    function (err) {
        console.log(err);
    }
)

module.exports = mongoose