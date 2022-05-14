const User = require('../../models/user')

const UserController = {
     async getUser() {
         return await User.findOne({where: {firstName: 'Nigel'}});
     },
}

module.exports = UserController
