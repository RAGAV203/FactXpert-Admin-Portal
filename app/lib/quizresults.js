import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    userId: String,
    username: String,
    coursename: String,
    courseId: String,
    Questionnaire: String,
    quizScore: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      required: true
    },
    wrongAnswers: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    quizFromDate: String,
    quizFromTime: String,
    quizToDate: String,
    quizToTime: String,  
  },
  { collection: 'QuizResult' }
);

const QuizResult = mongoose.models.QuizResult || mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;
