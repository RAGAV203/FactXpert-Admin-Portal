// @/app/models/Question.js

import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
{
  questionnaire: String,
  question: String,
  answers: [String],
  correctAnswer: String,
}, { collection: 'Questions' });

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

export default Question;
