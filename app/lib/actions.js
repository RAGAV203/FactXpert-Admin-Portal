"use server";

import { revalidatePath } from "next/cache";
import { Product, User } from "./models";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { signIn } from "../auth";

export const fetchUsers = async (q, page) => {
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 5;

  try {
    connectToDB();
    const count = await User.find({ username: { $regex: regex } }).count();
    const users = await User.find({ username: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, users };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const fetchUsersAdd = async (q, page, courseID) => {
  const regex = new RegExp(q, "i");
  const ITEM_PER_PAGE = 5;

  try {
    connectToDB();
    
    // Count users who are not enrolled in the specified course
    const count = await User.find({ 
      username: { $regex: regex },
      courses: { $ne: courseID } // Filter users who don't have the specified course
    }).count();

    // Fetch users who are not enrolled in the specified course
    const users = await User.find({ 
      username: { $regex: regex },
      courses: { $ne: courseID } // Filter users who don't have the specified course
    })
    .limit(ITEM_PER_PAGE)
    .skip(ITEM_PER_PAGE * (page - 1));

    return { count, users };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const fetchUsersAdded = async (q, page, courseID) => {
  const regex = new RegExp(q, "i");

  try {
    connectToDB();
    

    // Fetch users who are not enrolled in the specified course
    const users = await User.find({ 
      username: { $regex: regex },
      courses: { $in: [courseID] } // Filter users who have the specified course
    })
    

    return  users;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};


export const addStudent = async (formData) => {
  const { username, age, gender, language, phone, password, area } =  Object.fromEntries(formData);
  
  try {
    connectToDB();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Check if a user with the same username or email exists
    const existingUser = await User.findOne({ phone: phone });
    const courses= await Courses.find({language:language});
    const courseIds = courses.map(course => course._id);
    if (existingUser) {
      // If user exists, update the existing user with new data
      existingUser.username = username;
      existingUser.phone = phone;
      existingUser.age = age;
      existingUser.courses = courseIds;
      existingUser.gender = gender;
      existingUser.language = language;
      existingUser.password = hashedPassword;
      existingUser.pwd = password;
      existingUser.area = area;

      await existingUser.save();
      console.log('User updated:', username);
    
    } else {
      // If user doesn't exist, create a new user
      const newUser = new User({
        username: username,
        phone: phone,
        age: age,
        gender: gender,
        language: language,
        courses : courseIds,
        password: hashedPassword,
        pwd: password,
        isAdmin: false,
        area: area,
      });

      await newUser.save();
      console.log('New user created:', username);
    }
  } catch (err) {
    console.log(err);
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const addStudentcsv = async (object) => {
  try {
    connectToDB();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(object.password, salt);
    // Check if a user with the same username or email exists
    const existingUser = await User.findOne({ phone: object.phone });
    const courses= await Courses.find({language: object.language});
    const courseIds = courses.map(course => course._id);

    if (existingUser) {
      // If user exists, update the existing user with new data
      existingUser.username = object.username;
      existingUser.password = hashedPassword;
      existingUser.pwd = object.password;
      existingUser.username = object.username;
      existingUser.phone = object.phone;
      existingUser.age = object.age;
      existingUser.courses = courseIds;
      existingUser.gender = object.gender;
      existingUser.language = object.language;
      existingUser.password = hashedPassword;
      existingUser.pwd = object.password;
      existingUser.area = object.area;
      await existingUser.save();
      console.log('User updated:', object.username);
    } else {
      // If user doesn't exist, create a new user
      const newUser = new User({
        username: object.username,
        phone: object.phone,
        age: object.age,
        gender: object.gender,
        language: object.language,
        password: hashedPassword,
        courses : courseIds,
        pwd: object.password,
        isAdmin: false,
        area: object.area,
      });
      
      await newUser.save();
      console.log('New user created:', object.username);
    }
  } catch (err) {
    console.error(err);
  }
};

export const exportUsersToCSV = async (req, res) => {
  try {
    // Fetch non-admin users
    const users = await User.find({ isAdmin: false }).select('username phone pwd language age gender area');
    // Send users data as JSON response
    return users;
  } catch (error) {
    console.error('Error exporting users to CSV:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const updateUser = async (formData) => {
  const {id, username, age, gender, language, phone, password, area,  isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    connectToDB();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Check if a user with the same username or email exists
    const courses= await Courses.find({language: language});
    const courseIds = courses.map(course => course._id);

    const updateFields = {
      username,
      phone,
      age,
      gender,
      language,
      password: hashedPassword,
      courses: courseIds,
      pwd: password,
      area,
      isAdmin,
      isActive,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await User.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update user!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const fetchUserResults = async () => {
  try {
    connectToDB(); 
    const students = await User.find({ isAdmin: false });

    const userDetails = students.map(student => {
      const progress = student.quizResults.length;
      const status = {
        text: progress === 14 ? "Completed" : "Not Complete",
        color: progress === 14 ? "green" : "red"
      };

      return {
        username: student.username,
        phone: student.phone,
        language: student.language,
        Progress: progress,
        status: status
      };
    });

    return userDetails;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const addUserCourse = async (formData) => {
  const { userID, courseID } = Object.fromEntries(formData);
  try {
    
    connectToDB();

    // Update user document to add course
    const userUpdateResult = await User.findByIdAndUpdate(userID, {
      $addToSet: { courses: courseID }
    });

    // Update course document to add member
    const courseUpdateResult = await Courses.findByIdAndUpdate(courseID, {
      $addToSet: { members: userID }
    });

    //console.log("User Update Result:", userUpdateResult);
    //console.log("Course Update Result:", courseUpdateResult);

    if (userUpdateResult && courseUpdateResult) {
      console.log("Member added to course successfully");
    } else {
      console.log("Failed to add member to course");
    }
  } catch (error) {
    console.log(err);
    throw new Error("Failed to add user!");
  }
  revalidatePath("/dashboard/");
  redirect(`/dashboard/courses/${courseID}/users`);
};

export const removeUserCourse = async (formData) => {
  const { userID, courseID } = Object.fromEntries(formData);
  try {
    connectToDB();

    // Update user document to remove course
    const userUpdateResult = await User.findByIdAndUpdate(userID, {
      $pull: { courses: courseID }
    });

    // Update course document to remove member
    const courseUpdateResult = await Courses.findByIdAndUpdate(courseID, {
      $pull: { members: userID }
    });

    if (userUpdateResult && courseUpdateResult) {
      console.log("Member removed from course successfully");
    } else {
      console.log("Failed to remove member from course");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to remove user!");
  }
 
  redirect(`/dashboard/courses/${courseID}/users`);
};

export const addProduct = async (formData) => {
  const { title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const newProduct = new Product({
      title,
      desc,
      price,
      stock,
      color,
      size,
    });

    await newProduct.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create product!");
  }

  revalidatePath("/dashboard/quiz");
  redirect("/dashboard/quiz");
};

import Questionnaire from './Questionnaire';

// Function to delete a question
export const deleteQuestion = async (questionId) => {
  try {
    // Find the question by ID and delete it
    connectToDB();
    await Question.findByIdAndDelete(questionId);
    
    return { success: true, message: "Question deleted successfully" };
  } catch (error) {
    return { success: false, message: "Error deleting question" };
  }
  
};

// Function to edit a question
export const editQuestion = async (questionId, updatedData) => {
  try {
    connectToDB();
    // Find the question by ID and update it with the new data
    await Question.findByIdAndUpdate(questionId, updatedData);
    return { success: true, message: "Question updated successfully" };
  } catch (error) {
    return { success: false, message: "Error updating question" };
  }
};

export const fetchQuestions = async () => {
  try {
    // Fetch all questionnaires
    connectToDB();
    const questionnaires = await Questionnaire.find().lean();

    // Fetch questions for each questionnaire
    const questionsByQuestionnaire = await Promise.all(
      questionnaires.map(async (questionnaire) => {
        const questions = await Question.find({ questionnaire: questionnaire._id }).lean();
        return {
          ...questionnaire,
          questions
        };
      })
    );

    return questionsByQuestionnaire;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

export const fetchQuestionsreview = async (id) => {
  try {
    // Fetch all questionnaires
    connectToDB();
    const questionnaires = await Questionnaire.findById(id).lean();
    //console.log(questionnaires);
    // Fetch questions for each questionnaire
    const questions = await Question.find({ questionnaire: questionnaires._id }).lean();
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};
// Function to fetch existing questionnaires from MongoDB
export const getQuestionnaires = async () => {
  try {
    connectToDB();
    // Query MongoDB to find all questionnaires
    let questionnaires = await Questionnaire.find();

    // If no questionnaires found, create a new one
    if (questionnaires.length === 0) {
      const newQuestionnaire = new Questionnaire({
        title: 'Default Questionnaire' // You can adjust the default title as needed
        // Add other fields as needed for your questionnaire
      });
      await newQuestionnaire.save();
      questionnaires = [newQuestionnaire];
    }

    return questionnaires;
  } catch (error) {
    throw new Error(`Error fetching questionnaires: ${error.message}`);
  }
};


export const updateQuestion = async (questionId, formData) => {
  const { question, answers, correctAnswer } = formData;

  try {
    connectToDB();

    const updateFields = {
      question,
      answers,
      correctAnswer
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || updateFields[key] === undefined) && delete updateFields[key]
    );

    await Question.findByIdAndUpdate(questionId, updateFields);

  } catch (err) {
    console.error(err);
    throw new Error("Failed to update question!");
  }
  
};


// Function to fetch a question by ID
export const fetchQuestion = async (questionId) => {
  try {
    // Find the question by ID and return it
    const question = await Question.findById(questionId).lean();
    return question;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
};

// Modify the fetchQuestions function to return questions grouped by language
export const fetchQuestions1 = async () => {
  try {
    connectToDB();
    const questions = await Question.find().populate('questionnaire').exec();
    const groupedQuestions = {};

    questions.forEach((question) => {
      const { language } = question.questionnaire;
      if (!groupedQuestions[language]) {
        groupedQuestions[language] = [];
      }
      groupedQuestions[language].push(question);
    });

    return groupedQuestions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};


// Function to save a new questionnaire
export const saveQuestionnaire = async (title, language, courseId) => {
  try {
    await connectToDB(); // Connect to the database
    const newQuestionnaire = new Questionnaire({
      title: title,
      language: language,
      course: courseId
    });
    await newQuestionnaire.save();
    // Update the course to append the new questionnaire ID to the questionnaire array
    await Courses.findByIdAndUpdate(courseId, {
      $addToSet: { questionnaire: newQuestionnaire._id }
    });
    return newQuestionnaire;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create Questionnaire");
  }
};

// Other functions such as saveQuestion, etc.
import Courses from './courses';

export const fetchCourses = async () => {
  try {
    connectToDB();
    // Fetch questionnaires from the database
    const courses = await Courses.find();

    return courses;
  } catch (error) {
    console.error("Error fetching Courses:", error);
    throw new Error("Failed to fetch Courses");
  }
};



// Action to save a new course
export const saveCourse = async (title, language) => {
  try {
    await connectToDB(); // Connect to the database
    const newCourse = new Courses({
      name: title,
      language: language,
    });
    await newCourse.save();
    
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create Course");
  }
  revalidatePath("/dashboard/courses");
  redirect('/dashboard/courses');
};

// Action to get questionnaires by course
export const getQuestionnairesByCourse = async (courseId) => {
  try {
    await connectToDB(); // Connect to the database
    const questionnaires = await Questionnaire.find({ course: courseId });
    return questionnaires;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch Questionnaires");
  }
};


// Action to update a course with new questionnaires
export const updateCourse = async (courseId, courseData) => {
  try {
    await connectToDB(); // Connect to the database
    console.log(courseData);
    const updatedCourse = await Courses.findByIdAndUpdate(courseId, courseData, { new: true });
    revalidatePath("/dashboard/courses");
    return updatedCourse;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update Course");
  }
};

export const fetchCourse = async (id) => {
  try {
    connectToDB();
    const course = await Courses.findById(id);
    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw new Error("Failed to fetch course");
  }
};

export const fetchCount = async () => {
  try {
    connectToDB();
    const countCourse = await Courses.countDocuments();
    const countStudent = await User.countDocuments({ isAdmin: false });
    const Count = {
      CourseCount: countCourse,
      StudentCount: countStudent,
    }
    return Count;
  } catch (error) {
    console.error("Error fetching count:", error);
    throw new Error("Failed to fetch count");
  }
};


export const fetchSchedule = async (id) => {
  try {
    connectToDB();
    const course = await Courses.findById(id);
    if (!course) {
      throw new Error("Course not found");
    }
    const { scheduleFromDate, scheduleFromTime, scheduleToDate, scheduleToTime } = course;
    if(course.questChoice && scheduleFromDate && scheduleFromTime && scheduleToDate && scheduleToTime){
      const Questionnairename= await Questionnaire.findById(course.questChoice);
      if (Questionnairename){
      const Schedule = {
        Questionnaire: Questionnairename.title,
        FromDate: scheduleFromDate,
        FromTime: scheduleFromTime,
        ToDate: scheduleToDate,
        ToTime: scheduleToTime,
      };
      return Schedule;
    }
      else{
        return "";
      }
      
    }
    else{
      return "";
    }
    
  } catch (error) {
    console.error("Error fetching Questionnaire name:", error);
    throw new Error("Failed to fetch Questionnaire name");
  }
};

export const fetchCourseMembers = async (id) => {
  try {
    connectToDB();
    const course = await Courses.findById(id);
    if (!course) {
      throw new Error("Course not found");
    }
    
    const members = course.members || [];
    const membersWithUsernames = [];

    // Iterate through each member ID and fetch username
    for (let memberId of members) {
      const user = await User.findById(memberId);
      if (user) {
        membersWithUsernames.push({
          userId: memberId,
          username: user.username
        });
      }
    }

    return membersWithUsernames;
  } catch (error) {
    console.error("Error fetching Members", error);
    throw new Error("Failed to fetch Members");
  }
};


import QuizResult from "./quizresults";
export const fetchResults = async (courseId) => {
  try {
    connectToDB();
    const Results = await QuizResult.find({courseId: courseId});
    return Results;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to Fetch Results");
  }
};

export const fetchResultsbyquiz = async (questionnaireId) => {
  try {
    connectToDB();
    const Results = await QuizResult.find({Questionnaire: questionnaireId});
    return Results;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to Fetch Results");
  }
};

export const addNewCourseName = async (questionnaireId, questionData) => {
  try {
    connectToDB();
    const { coursename, language } = questionData;
    const newCourse = new Courses({
      name: coursename,
      language: language,
    });
    //console.log(coursename);
    await newCourse.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create Course");
  }
  revalidatePath("/dashboard/courses");
  redirect("/dashboard/courses");
};



export const deleteCourse = async (questionId) => {
  try {
    // Find the question by ID and delete it
    connectToDB();
    await Courses.findByIdAndDelete(questionId);
    
    return { success: true, message: "Course deleted successfully" };
  } catch (error) {
    return { success: false, message: "Error deleting Course" };
  }
  
};




import Question from './Question';

export const saveQuestion = async (questionnaireId, questionData) => {
  try {
    connectToDB();
    const { question, answers, correctAnswer } = questionData;
    const newQuestion = new Question({
      questionnaire: questionnaireId,
      question,
      answers,
      correctAnswer,
    });
    await newQuestion.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create product!");
  }
};

export const saveQuestions = async (questionnaireId, questionData) => {
  try {
    connectToDB();
    const { question, answers, correctAnswerIndex } = questionData;
    const newQuestion = new Question({
      questionnaire: questionnaireId,
      question,
      answers,
      correctAnswer: answers[correctAnswerIndex], // Assuming the correct answer is an index
    });
    await newQuestion.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create question!");
  }
};

// @/app/lib/actions/questionnaires
export const fetchQuestionnaires = async (courseid) => {
  try {
    connectToDB();
    // Fetch questionnaires from the database
    const questionnaires = await Questionnaire.find({course:courseid});

    return questionnaires;
  } catch (error) {
    console.error("Error fetching questionnaires:", error);
    throw new Error("Failed to fetch questionnaires");
  }
};

const Schedule = require("./Schedule");


export const saveQuestionnairechoice = async (selectedEng, selectedHindi) => {
  try {
    // Connect to MongoDB
    // Ensure you have connected to your MongoDB database before querying

    // Create a new question document
    const newQuestion = new Schedule({
      englishques: selectedEng,
      hindiques: selectedHindi,
    });

    // Save the new question document to the database
    
    await newQuestion.save();
    
  } catch (error) {
    console.error("Error saving question:", error);
    throw new Error("Failed to save question");
  }
  revalidatePath("/dashboard/quiz");
  redirect("/dashboard/quiz");
};
// Add other CRUD operations for questionnaires if needed

export const updateProduct = async (formData) => {
  const { id, title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const updateFields = {
      title,
      desc,
      price,
      stock,
      color,
      size,
    };

    Object.keys(updateFields).forEach(
      (key) =>
        (updateFields[key] === "" || undefined) && delete updateFields[key]
    );

    await Product.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update product!");
  }

  
};

export const deleteUser = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await User.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete user!");
  }

  revalidatePath("/dashboard/quiz");
};

export const deleteProduct = async (formData) => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await Product.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete product!");
  }

  revalidatePath("/dashboard/quiz");
};

export const authenticate = async (res, formData) => {
  const { username, password } = Object.fromEntries(formData);

  try {
    await signIn("credentials", { username, password });
  } catch (err) {
    if (err.message.includes("CredentialsSignin")) {
      return "Wrong Credentials";
    }
    throw err;
  }
};
