var express = require("express");
var router = express.Router()
const Ticket = require("../models/ticket")


// Ticket Creation API
router.post('/create', async (req, res) => {
    const { numTickets } = req.body;

    try {
        const tickets = [];

        for (let i = 0; i < numTickets; i++) {
            let isUnique = false;
            let ticketData, ticketId;

            // Generate a unique ticket
            while (!isUnique) {
                ticketData = generateTicketData();
                ticketId = generateTicketId();

                const existingTicket = await Ticket.findOne({ ticketId, ticketData });
                if (!existingTicket) {
                    isUnique = true;
                }
            }

            const ticket = new Ticket({
                ticketId,
                ticketData,
            });

            await ticket.save();
            tickets.push(ticket);
        }

        res.json({ tickets });
    } catch (err) {
        console.error('Failed to create tickets:', err);
        res.status(500).json({ error: 'Failed to create tickets' });
    }
});


// Ticket Fetch API
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    try {
        const totalTickets = await Ticket.countDocuments({ ticketId: id });
        const tickets = await Ticket.find({ ticketId: id })
            .skip(skip)
            .limit(Number(limit));

        res.json({
            totalTickets,
            tickets,
        });
    } catch (err) {
        console.error('Failed to fetch tickets:', err);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

// ...
// Generate Tambola Ticket Data
function generateTicketData() {
    const ticketData = [];

    const availableNumbers = new Set();
    for (let i = 1; i <= 90; i++) {
        availableNumbers.add(i);
    }

    for (let col = 0; col < 9; col++) {
        const column = [];

        for (let row = 0; row < 3; row++) {
            const numbers = Array.from(availableNumbers);
            const randomIndex = Math.floor(Math.random() * numbers.length);
            const number = numbers.splice(randomIndex, 1)[0];

            column.push(number);
        }

        ticketData.push(column);
    }

    return ticketData;
}

// Generate a unique ticket ID
function generateTicketId() {
    return Math.random().toString(36).substring(2);
}


module.exports = router
