// const mongoose = require('mongoose');

// const loginSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     }
// });

// const User = mongoose.model("userLogin", loginSchema);
// const user =  User.findOne({ email:"riskmanagement1@jindalsteel.com" });
// console.log(user.password);
module.exports = User;
