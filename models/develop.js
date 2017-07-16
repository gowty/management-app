var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var DevelopSchema = mongoose.Schema({
     name: {
        type: String
    },
     email: {
        type: String
    },
     phonenumber: {
        type: String
    },
     username: {
        type: String,
        index: true
    },
     password: {
        type: String,
    }
});

DevelopSchema.plugin(passportLocalMongoose);

var Develop = module.exports = mongoose.model("Develop", DevelopSchema);