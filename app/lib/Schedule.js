// lib/models/question.js
const mongoose = require("mongoose");
if (mongoose.connection.models['Schedule']) {
    delete mongoose.connection.models['Schedule'];
}
const scheduleSchema = new mongoose.Schema({
  englishques: String,
  hindiques: String,
}, { collection: 'Schedule',
timestamps: true,  });

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
