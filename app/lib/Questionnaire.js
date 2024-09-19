import mongoose from "mongoose";

const questionnaireSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
      },
      language: {
        type: String,
        required: true
      },
    course: String,  
}, { collection: 'Questionnaires' });

const Questionnaire = mongoose.models.Questionnaire || mongoose.model('Questionnaire', questionnaireSchema);

export default Questionnaire;
