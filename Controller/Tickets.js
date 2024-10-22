const Ticket = require('../Schemas/Ticket')
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid');


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
const getEventTickets = async (req,res)=>{
    try {
        const id = req.params.id
        const ticket = await Ticket.scan('ticketEventId').eq(id).exec()
        res.json({
            count:ticket.length,
            data:ticket
        })
        
    } catch (error) {
        console.log(error)
        res.send(error)
        
    }

}
const createTicket= async (req,res) =>{
    try {
        const _id =uuidv4()
        const metadata= jwt.verify(req.query.token,process.env.JWT_SECRET)
        const ticket= new Ticket({_id,...metadata})
        await ticket.save()
        console.log("saving token")
        res.redirect(`${process.env.FRONT_URL}/ticketdetails?eventid=${metadata.ticketEventId}&buyerid=${metadata.ticketBuyerId}`)
        
    } catch (error) {
        console.log(error)
        
    }
    
}

module.exports= {getAllTickets,getMyTickets,getEventTickets,createTicket}