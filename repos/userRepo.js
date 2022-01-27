const User = require('../models/user');

let userRepo = {
    insert: function (userData){
        const user = new User({
            email: userData.email,
            password: userData.password,
            name: userData.name
        });
        return user.save();
    },
    find:function (filter){
        return  User.findOne(filter)
    }
}

module.exports = userRepo;
