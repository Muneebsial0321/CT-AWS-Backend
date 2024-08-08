const User = require('../Schemas/User')
const Client = async (req, res, next) => {
    try {
        console.log("in midddle ware")

        const string = req.cookies.user
        console.log(string)
        let scan = await User.scan();
        scan = await scan.where('email').eq(string);
        const result = await scan.exec();
        console.log("result is")
        if (result.length > 0) {
            next()
        }
        else {
            console.log("not authorized")
            res.json({ "error": "not authorized" })
        }

    }
    catch {
        res.json({ "message": "not authneticated" })

    }

}

module.exports = Client