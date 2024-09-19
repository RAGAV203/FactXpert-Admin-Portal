import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
{
  name: String,
  language: String,
  questChoice: String,
  scheduleFromDate: String,
  scheduleFromTime: String,
  scheduleToDate: String,
  scheduleToTime: String,
  questionnaire: [String],
  members : [String],
}, { collection: 'Courses' });

const Courses = mongoose.models.Courses || mongoose.model('Courses', courseSchema);

export default Courses;

//check scheduleTime: String, scheduleDate: String,