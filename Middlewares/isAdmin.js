const User = require('../Schemas/User')
const isAdmin = async (req, res, next) => {
    try {
   
        const string = req.cookies.user
        // let scan = await User.scan();
        // scan = await scan.where('_id').eq(string);
        // scan = await scan.where('role').eq('admin');
        // const result = await scan.exec();
        // let result = await User.query('User_PK').eq(string).where('role').eq('admin').exec();
        let result = await User.get(string)
        if (result.role == 'admin') {
            console.log("it is an admin indeed")
            next()
        }
        else {
            console.log("sorry bro not a admin")
            res.json({ "error": "not authorized" })
        }

    }
    catch {
        res.json({ "message": "not authneticated" })

    }

}

module.exports = isAdmin