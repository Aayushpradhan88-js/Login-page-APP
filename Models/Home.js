const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:27017/security`);

let userSchema = mongoose.Schema({
    Email: String,
    password: String
})

module.exports = mongoose.model("user", userSchema);