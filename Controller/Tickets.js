const Ticket = require('../Schemas/Ticket')

const getAllTickets = async (req,res)=>{
    try {
        const ticket = await Ticket.scan().exec()
        res.json({
            count:ticket.length,
            data:ticket
        })
        
    } catch (error) {
        console.log(error)
        res.send(error)
        
    }
}
const getMyTickets = async (req,res)=>{
    try {
        const id = req.params.id
        const ticket = await Ticket.scan('ticketBuyerId').eq(id).exec()
        res.json({
            count:ticket.length,
            data:ticket
        })
        
    } catch (error) {
        console.log(error)
        res.send(error)
        
    }

}

module.exports= {getAllTickets,getMyTickets}