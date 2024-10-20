import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth0 } from '@auth0/auth0-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const questions = [
  {
    question: "What does this CSS selector target?",
    code: "div > p + ul",
    options: [
      "All <ul> elements that are direct children of <p> elements",
      "The first <ul> element that comes after a <p> element, which is a direct child of a <div>",
      "All <ul> elements that come after <p> elements inside a <div>",
      "The first <p> element and the first <ul> element that are direct children of a <div>"
    ],
    correctAnswer: "The first <ul> element that comes after a <p> element, which is a direct child of a <div>"
  },
  {
    question: "What will be the output of this JavaScript code?",
    code: `const arr = [1, 2, 3, 4, 5];
const result = arr.reduce((acc, curr) => acc + curr, 0);
console.log(result);`,
    options: ["10", "15", "0", "[1,2,3,4,5]"],
    correctAnswer: "15"
  },
  {
    question: "Which React hook would you use to perform side effects in your component?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctAnswer: "useEffect"
  },
  {
    question: "What does this HTML5 element represent?",
    code: "<figure>",
    options: [
      "A container for mathematical equations",
      "A self-contained content, like illustrations, diagrams, photos, code listings, etc.",
      "A figure of speech in the text",
      "A placeholder for future content"
    ],
    correctAnswer: "A self-contained content, like illustrations, diagrams, photos, code listings, etc."
  },
  {
    question: "What's the purpose of this Git command?",
    code: "git rebase -i HEAD~3",
    options: [
      "To interactively rebase the last 3 commits",
      "To create a new branch with the last 3 commits",
      "To delete the last 3 commits",
      "To merge the last 3 commits into one"
    ],
    correctAnswer: "To interactively rebase the last 3 commits"
  }
];

const LegendaryQuiz = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (showScore) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, showScore]);

  const handleTimeout = () => {
    setStreak(0);
    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(30);
      setShowHint(false);
    } else {
      setShowScore(true);
      if (score === questions.length) {
        launchConfetti();
      }
    }
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      setHighestStreak(Math.max(highestStreak, streak + 1));
    } else {
      setStreak(0);
    }

    setTimeout(moveToNextQuestion, 1500);
  };

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeLeft(30);
    setStreak(0);
    setHighestStreak(0);
    setShowHint(false);
  };

  if (isLoading) {
    return <div className="mt-10 text-2xl text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-100 sm:px-6 lg:px-8 font-body">
      <div className="max-w-3xl mx-auto overflow-hidden bg-white shadow-md rounded-xl">
        <div className="p-8">
          <h1 className="mb-6 text-3xl font-extrabold text-center">
            <span className="text-transparent bg-clip-text bg-proj">
              Frontend Quiz
            </span>
          </h1>
          {isAuthenticated && (
            <p className="mb-6 text-xl text-center">
              Welcome, <span className="font-semibold">{user.name}</span>! Ready to prove your skills?
            </p>
          )}
          {showScore ? (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-4 text-3xl font-bold">
                <span className="text-transparent bg-clip-text bg-proj">
                  You scored {score} out of {questions.length}
                </span>
              </h2>
              <p className="mb-2 text-xl">Highest Streak: {highestStreak}</p>
              {score === questions.length ? (
                <p className="mb-6 text-2xl">Congratulations! You're a frontend legend!</p>
              ) : (
                <p className="mb-6 text-xl">Great effort! Keep practicing to become a frontend legend!</p>
              )}
              <button
                onClick={resetQuiz}
                className="px-4 py-2 font-bold text-white transition duration-300 ease-in-out transform rounded bg-proj hover:bg-proj-hover hover:scale-105"
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  <span className="text-transparent bg-clip-text bg-proj">
                    Question {currentQuestion + 1}/{questions.length}
                  </span>
                </h2>
                <div className="text-right">
                  <p className="text-lg font-semibold">Score: {score}</p>
                  <p className="text-lg font-semibold">Streak: {streak}</p>
                  <motion.p 
                    className="text-lg font-semibold"
                    animate={{ color: timeLeft <= 5 ? '#EF4444' : '#1F2937' }}
                  >
                    Time: {timeLeft}s
                  </motion.p>
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mb-4 text-xl">{questions[currentQuestion].question}</p>
                  {questions[currentQuestion].code && (
                    <SyntaxHighlighter language="javascript" style={dracula} className="mb-4 rounded-lg">
                      {questions[currentQuestion].code}
                    </SyntaxHighlighter>
                  )}
                  <div className="mb-6 space-y-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerClick(option)}
                        className={`w-full text-left p-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${
                          selectedAnswer === option
                            ? isCorrect
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        disabled={selectedAnswer !== null}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                  {!showHint && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="px-4 py-2 font-bold text-white transition duration-300 ease-in-out transform bg-yellow-500 rounded hover:bg-yellow-600 hover:scale-105"
                    >
                      Show Hint
                    </button>
                  )}
                  {showHint && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 italic text-gray-600"
                    >
                      Hint: Think about the specific use case or common scenario where this concept is applied.
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegendaryQuiz;