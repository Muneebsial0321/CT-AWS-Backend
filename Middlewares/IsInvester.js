const User = require('../Schemas/User')


const isInvester = async (req, res, next) => {
    try {
   
        const string = req.cookies.user
        let result = await User.get(string)
        if (result.role == 'invester') {
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

module.exports = isInvester