
const express = require("express");
const router = express.Router();
// verifyRoutes.js

// Hardcoded questions for different courses
const courseQuestions = {
  "C": {
  name: "C Basics",
  description: "Test your knowledge of C programming fundamentals.",
  questions: [
    {
      id: 1,
      question: "What is the correct extension of a C file?",
      options: [".c", ".cpp", ".java", ".txt"],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "Which of the following is used for single-line comments in C?",
      options: ["//", "#", "/*", "&"],
      correctAnswer: 0,
    },
    {
      id: 3,
      question: "Which function is used to read input from the user in C?",
      options: ["scanf()", "cin", "input()", "read()"],
      correctAnswer: 0,
    },
    {
      id: 4,
      question: "Which of these is the correct way to declare a pointer in C?",
      options: ["int *p;", "int p*;", "pointer int;", "*int p;"],
      correctAnswer: 0,
    },
    {
      id: 5,
      question: "What does the 'sizeof' operator do in C?",
      options: ["Returns the size of a variable", "Returns the address of a variable", "Returns the value of a variable", "None of the above"],
      correctAnswer: 0,
    },
    {
      id: 6,
      question: "Which of these data types is not used in C?",
      options: ["double", "char", "bool", "int"],
      correctAnswer: 2,
    },
    {
      id: 7,
      question: "Which header file is required for using the 'printf' function?",
      options: ["stdio.h", "conio.h", "stdlib.h", "math.h"],
      correctAnswer: 0,
    },
    {
      id: 8,
      question: "Which operator is used for multiplication in C?",
      options: ["*", "#", "%", "&"],
      correctAnswer: 0,
    },
    {
      id: 9,
      question: "What will the following code print? printf(\"%d\", 2 + 3 * 4);",
      options: ["14", "20", "12", "7"],
      correctAnswer: 0,
    },
    {
      id: 10,
      question: "What is the purpose of the 'return' statement in a function in C?",
      options: ["End the function", "Return a value", "Declare a function", "None of the above"],
      correctAnswer: 1,
    },
    {
      id: 11,
      question: "Which of the following is an example of a control flow statement in C?",
      options: ["if", "while", "for", "All of the above"],
      correctAnswer: 3,
    },
    {
      id: 12,
      question: "Which function is used to allocate memory dynamically in C?",
      options: ["malloc()", "new", "calloc()", "Both malloc() and calloc()"],
      correctAnswer: 3,
    }
  ]
},

  "Cpp": {
  name: "C++ Basics",
  description: "Test your knowledge of C++ programming fundamentals.",
  questions: [
    {
      id: 1,
      question: "Which keyword is used to define a class in C++?",
      options: ["class", "struct", "object", "define"],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "What is the output of 'cout << 10 / 3;' in C++?",
      options: ["3", "3.33", "Error", "10"],
      correctAnswer: 0,
    },
    {
      id: 3,
      question: "What does 'public' keyword mean in C++?",
      options: ["Access modifier", "Data type", "Function", "None of the above"],
      correctAnswer: 0,
    },
    {
      id: 4,
      question: "Which of the following is used for multiple inheritance in C++?",
      options: [": operator", "virtual inheritance", "-> operator", ":: operator"],
      correctAnswer: 1,
    },
    {
      id: 5,
      question: "Which is the default access specifier in a C++ class?",
      options: ["private", "public", "protected", "None"],
      correctAnswer: 0,
    },
    {
      id: 6,
      question: "What is the purpose of the 'new' keyword in C++?",
      options: ["Allocate memory dynamically", "Create an object", "Both a and b", "None of the above"],
      correctAnswer: 2,
    },
    {
      id: 7,
      question: "Which method is used to find the size of an object in C++?",
      options: ["sizeof()", "length()", "size()", "lengthOf()"],
      correctAnswer: 0,
    },
    {
      id: 8,
      question: "What does the following code output? cout << 'A' + 1;",
      options: ["A1", "B", "Error", "None of the above"],
      correctAnswer: 1,
    },
    {
      id: 9,
      question: "Which of the following is not a valid operator in C++?",
      options: ["&&", "&", "||", "&&&"],
      correctAnswer: 3,
    },
    {
      id: 10,
      question: "Which of the following is used to define a constructor in C++?",
      options: ["class constructor()", "void constructor()", "constructor void()", "constructor()"],
      correctAnswer: 0,
    },
    {
      id: 11,
      question: "What is the purpose of a destructor in C++?",
      options: ["Initialize an object", "Destroy an object", "Define an object", "None of the above"],
      correctAnswer: 1,
    },
    {
      id: 12,
      question: "Which of the following features are present in C++?",
      options: ["Encapsulation", "Inheritance", "Polymorphism", "All of the above"],
      correctAnswer: 3,
    }
  ]
},

"Java": {
  name: "Java Basics",
  description: "Test your knowledge of Java programming fundamentals.",
  questions: [
    {
      id: 1,
      question: "Which of the following is the correct syntax for declaring a variable in Java?",
      options: ["int x;", "var x;", "let x;", "x int;"],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: "Which method is used to find the length of a string in Java?",
      options: ["length()", "getLength()", "size()", "count()"],
      correctAnswer: 0,
    },
    {
      id: 3,
      question: "What is the output of the following code? System.out.println(5 + 10);",
      options: ["15", "510", "5 10", "Error"],
      correctAnswer: 0,
    },
    {
      id: 4,
      question: "Which of the following is a primitive data type in Java?",
      options: ["int", "String", "Integer", "ArrayList"],
      correctAnswer: 0,
    },
    {
      id: 5,
      question: "What is the correct way to declare a constant in Java?",
      options: ["const int x;", "final int x;", "static final int x;", "int final x;"],
      correctAnswer: 2,
    },
    {
      id: 6,
      question: "Which method is used to read input from the user in Java?",
      options: ["Scanner.next()", "Scanner.input()", "Scanner.read()", "System.in.next()"],
      correctAnswer: 0,
    },
    {
      id: 7,
      question: "Which of the following is not a valid access modifier in Java?",
      options: ["private", "protected", "default", "internal"],
      correctAnswer: 3,
    },
    {
      id: 8,
      question: "What is the default value of a boolean variable in Java?",
      options: ["false", "true", "null", "0"],
      correctAnswer: 0,
    },
    {
      id: 9,
      question: "What is the main method signature in Java?",
      options: ["public static void main(String[] args)", "public static void main()", "void main(String args[])", "static public void main()"],
      correctAnswer: 0,
    },
    {
      id: 10,
      question: "Which of these is used to create an object in Java?",
      options: ["new ClassName()", "new Object()", "Object new ClassName()", "new ObjectClass()"],
      correctAnswer: 0,
    },
    {
      id: 11,
      question: "Which keyword is used for inheritance in Java?",
      options: ["extends", "implements", "inherits", "extends interface"],
      correctAnswer: 0,
    },
    {
      id: 12,
      question: "Which of the following is used to handle exceptions in Java?",
      options: ["try-catch", "try-finally", "throw-catch", "catch-throw"],
      correctAnswer: 0,
    }
  ]
}

};

// Fetch questions for a specific course
router.get("/verify/:course", (req, res) => {
    console.log("testcourse");
  const { course } = req.params;

  const courseData = courseQuestions[course];

  if (!courseData) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Exclude correct answers when sending questions to the frontend
  const questions = courseData.questions.map(({ id, question, options }) => ({
    id,
    question,
    options,
  }));

  res.json({ questions });
});

// Handle test submission
router.post("/verify/:course/submit", (req, res) => {
  const { course } = req.params;
  const { answers } = req.body;

  const courseData = courseQuestions[course];

  if (!courseData) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Validate answers and calculate score
  const totalQuestions = courseData.questions.length;
  let correctAnswers = 0;

  courseData.questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correctAnswers++;
    }
  });

  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const status = score >= 50 ? "Passed" : "Failed";

  res.json({
    score,
    status,
    message: status === "Passed" ? "Congratulations! You passed the test." : "Better luck next time!",
  });
});

module.exports = router;
