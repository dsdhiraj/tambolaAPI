const mongoose = require("mongoose");


    const ticketSchema = new mongoose.Schema({
        ticketId: {
          type: String,
          required: true,
          unique: true,
        },
        ticketData: {
          type: [[Number]],
          required: true,
        },
      });

  const Ticket = mongoose.model("ticket",ticketSchema)    
  module.exports = Ticket