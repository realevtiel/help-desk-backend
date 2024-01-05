const express = require("express");
const router = express.Router();
const upload = require("../s3Upload");
const Ticket = require("../models/Ticket");

router.post("/tickets", upload.single("photo"), async (req, res) => {
  try {
    const ticketData = {
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      status: req.body.status || "new",
      photo: req.file ? req.file.location : undefined,
    };

    const newTicket = new Ticket(ticketData);
    const savedTicket = await newTicket.save();
    const fileUrl = req.file ? req.file.location : null;
    res.status(201).json({ message: "Ticket created successfully", fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating ticket" });
  }
});

router.get("/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/tickets/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/tickets/:id", async (req, res) => {
  const updateData = {
    status: req.body.status,
    response: req.body.response,
  };

  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(updatedTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/tickets/:id", async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
    if (!deletedTicket)
      return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
