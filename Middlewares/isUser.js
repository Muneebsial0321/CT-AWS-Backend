const User = require('../Schemas/User')
const isUser = async (req, res, next) => {
    try {
   
        const string = req.cookies.user
        let result = await User.get(string)
        if (result.role == 'viewer') {
            console.log("it is an user")
            next()
        }
        else {
            console.log("not a user")
            res.json({ "error": "not authorized" })
        }

    }
    catch {
        res.json({ "message": "not authneticated" })

    }

}

module.exports = isUser