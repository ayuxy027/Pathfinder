import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  ChevronRight, 
  Award, 
  Clock, 
  Brain, 
  Zap, 
  Flame, 
  BarChart2, 
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { generateQuizQuestions, generateMockQuestions } from '../services/quizService';
import CodeBlock from '../components/CodeBlock';
import { QuizQuestion } from '../types';

interface QuizTopic {
  id: string;
  name: string;
  icon: string;
}

interface DifficultyLevel {
  id: string;
  name: string;
  color: string;
}

type ScreenType = 'config' | 'quiz' | 'result';

const QUIZ_TOPICS: QuizTopic[] = [
  { id: 'html', name: 'HTML', icon: '📄' },
  { id: 'css', name: 'CSS', icon: '🎨' },
  { id: 'javascript', name: 'JavaScript', icon: '⚡' },
  { id: 'react', name: 'React', icon: '⚛️' },
  { id: 'node', name: 'Node.js', icon: '🟢' },
];

const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { id: 'beginner', name: 'Beginner', color: 'bg-green-500' },
  { id: 'intermediate', name: 'Intermediate', color: 'bg-yellow-500' },
  { id: 'advanced', name: 'Advanced', color: 'bg-red-500' },
];

const Quiz: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>('config');
  const [topic, setTopic] = useState<string>('javascript');
  const [difficulty, setDifficulty] = useState<string>('intermediate');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (screen === 'quiz' && !showExplanation && !selectedAnswer) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) handleTimeout();
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [screen, showExplanation, selectedAnswer]);

  const handleTimeout = (): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setSelectedAnswer('TIMEOUT');
    setIsCorrect(false);
    setShowExplanation(true);
    setStreak(0);
  };

  const handleAnswerClick = (answer: number): void => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const correct = answer === questions[currentQuestionIndex].correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => {
        const newStreak = s + 1;
        if (newStreak > highestStreak) setHighestStreak(newStreak);
        return newStreak;
      });
      if (timeLeft > 20) confetti({ particleCount: 30, spread: 70 });
    } else {
      setStreak(0);
    }
  };

  const startQuiz = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setScore(0);
    setStreak(0);
    setCurrentQuestionIndex(0);
    
    try {
      // Check if API key exists
      const apiKey = import.meta.env.VITE_API_KEY;
      if (!apiKey) {
        console.error('Missing Gemini API key. Please add VITE_API_KEY to your .env file');
        setError('Missing API key. Please check README-QUIZ.md for setup instructions.');
        setIsLoading(false);
        return;
      }
      
      console.log(`Generating ${difficulty} level questions for ${topic}...`);
      const generatedQuestions = await generateQuizQuestions(topic, difficulty);
      
      if (generatedQuestions && generatedQuestions.length > 0) {
        console.log(`Successfully generated ${generatedQuestions.length} questions`);
        setQuestions(generatedQuestions);
        setScreen('quiz');
      } else {
        throw new Error('No questions were generated');
      }
    } catch (err) {
      console.error('Error starting quiz:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`${errorMessage}. Please try again or select a different topic.`);
      
      // Try with mock questions as a UI fallback
      console.log('Using mock questions as UI fallback');
      const mockQuestions = generateMockQuestions(topic, difficulty);
      if (mockQuestions.length > 0) {
        setQuestions(mockQuestions);
        setScreen('quiz');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = (): void => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      resetQuestionState();
    } else {
      setScreen('result');
      if (score === questions.length) confetti({ particleCount: 100, spread: 70 });
    }
  };

  const resetQuestionState = (): void => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeLeft(30);
    setShowExplanation(false);
  };

  const restartQuiz = (): void => {
    setScreen('config');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-stone-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          <p className="text-lg font-medium text-stone-700">
            Generating {difficulty} level {topic} questions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-stone-50">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-500">
              Developer Quiz Challenge
            </span>
          </h1>
          <p className="text-stone-500">
            Test your knowledge and track your progress
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {screen === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-white rounded-xl border shadow-md border-stone-100"
            >
              <h2 className="flex items-center mb-6 text-2xl font-bold">
                <Brain className="mr-2 text-teal-500" /> Quiz Setup
              </h2>
              
              <div className="mb-6">
                <label className="block mb-3 font-medium">Topic</label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                  {QUIZ_TOPICS.map(t => (
                    <motion.button
                      key={t.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTopic(t.id)}
                      className={`p-4 rounded-lg flex flex-col items-center transition-colors ${
                        topic === t.id 
                          ? 'bg-teal-100 border-2 border-teal-300' 
                          : 'bg-stone-50 hover:bg-stone-100'
                      }`}
                    >
                      <span className="mb-2 text-2xl">{t.icon}</span>
                      <span className="font-medium">{t.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block mb-3 font-medium">Difficulty</label>
                <div className="flex flex-wrap gap-3">
                  {DIFFICULTY_LEVELS.map(d => (
                    <motion.button
                      key={d.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDifficulty(d.id)}
                      className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                        difficulty === d.id 
                          ? `${d.color} text-white` 
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {d.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center p-3 mb-4 text-red-600 bg-red-50 rounded-lg">
                  <AlertCircle className="mr-2" size={18} />
                  {error}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startQuiz}
                disabled={isLoading}
                className="py-3 w-full font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-md transition-all hover:from-teal-600 hover:to-teal-700"
              >
                Start Quiz
              </motion.button>
            </motion.div>
          )}

          {screen === 'quiz' && questions.length > 0 && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden bg-white rounded-xl border shadow-md border-stone-100"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col gap-2 justify-between items-center mb-6 md:flex-row">
                  <div className="flex gap-4 items-center p-2 w-full rounded-lg bg-stone-50 md:w-auto">
                    <div className="flex items-center text-stone-700">
                      <Award className="mr-1.5 text-teal-500" size={18} />
                      <span className="font-medium">{score} pts</span>
                    </div>
                    <div className="h-5 border-r border-stone-300"></div>
                    <div className="flex items-center text-stone-700">
                      <Flame className="mr-1.5 text-orange-500" size={18} />
                      <span className="font-medium">{streak} streak</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-center p-2 w-full rounded-lg bg-stone-50 md:w-auto">
                    <div className="flex items-center text-stone-700">
                      <Clock className={`mr-1.5 ${timeLeft < 10 ? 'text-red-500' : 'text-teal-500'}`} size={18} />
                      <span className={`font-medium ${timeLeft < 10 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
                    </div>
                    <div className="h-5 border-r border-stone-300"></div>
                    <div className="font-medium text-stone-700">
                      {currentQuestionIndex + 1}/{questions.length}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-4 text-xl font-medium text-stone-800">
                    {questions[currentQuestionIndex].question}
                  </h3>

                  {questions[currentQuestionIndex].code && (
                    <div className="mb-5 rounded-lg overflow-hidden">
                      <CodeBlock 
                        code={questions[currentQuestionIndex].code}
                        language={topic === 'javascript' ? 'javascript' : topic === 'html' ? 'html' : topic}
                        showLineNumbers={true}
                      />
                    </div>
                  )}

                  <div className="mb-4 space-y-3">
                    {questions[currentQuestionIndex].options.map((option, i) => {
                      // Determine button style based on selection state
                      let buttonStyle = "bg-stone-50 hover:bg-stone-100 border border-stone-200";
                      
                      if (selectedAnswer) {
                        if (option === questions[currentQuestionIndex].correctAnswer) {
                          buttonStyle = "bg-green-100 border border-green-300 text-green-800";
                        } else if (option === selectedAnswer) {
                          buttonStyle = "bg-red-100 border border-red-300 text-red-800";
                        } else {
                          buttonStyle = "bg-stone-50 border border-stone-200 opacity-70";
                        }
                      }
                      
                      return (
                        <motion.button
                          key={i}
                          whileHover={!selectedAnswer ? { scale: 1.01 } : {}}
                          whileTap={!selectedAnswer ? { scale: 0.99 } : {}}
                          onClick={() => !selectedAnswer && handleAnswerClick(option)}
                          disabled={!!selectedAnswer}
                          className={`w-full p-3.5 text-left rounded-lg transition-all ${buttonStyle} flex items-center`}
                        >
                          <span className="flex justify-center items-center mr-3 w-7 h-7 text-sm font-medium rounded-full bg-stone-200 text-stone-700">
                            {String.fromCharCode(65 + i)}
                          </span>
                          {option}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 mb-4 bg-amber-50 rounded-lg border border-amber-200"
                    >
                      <h4 className="flex items-center mb-2 font-medium text-amber-800">
                        <Lightbulb className="mr-2 text-amber-500" size={18} />
                        Explanation
                      </h4>
                      <p className="text-stone-700">{questions[currentQuestionIndex].explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {showExplanation && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextQuestion}
                    className="flex justify-center items-center py-3 w-full font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-md transition-all hover:from-teal-600 hover:to-teal-700"
                  >
                    {currentQuestionIndex < questions.length - 1 ? (
                      <>Next Question <ChevronRight size={18} className="ml-1" /></>
                    ) : (
                      <>Finish Quiz <Award size={18} className="ml-1" /></>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {screen === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-white rounded-xl border shadow-md border-stone-100"
            >
              <h2 className="flex items-center mb-6 text-2xl font-bold">
                <BarChart2 className="mr-2 text-teal-500" /> Quiz Results
              </h2>
              
              <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-5 text-center bg-gradient-to-br from-teal-50 rounded-lg border border-teal-100 to-stone-50"
                >
                  <div className="mb-1 text-3xl font-bold text-teal-700">{score}/{questions.length}</div>
                  <div className="text-sm text-stone-600">Correct Answers</div>
                </motion.div>
                
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-5 text-center bg-gradient-to-br from-amber-50 rounded-lg border border-amber-100 to-stone-50"
                >
                  <div className="mb-1 text-3xl font-bold text-amber-700">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <div className="text-sm text-stone-600">Score</div>
                </motion.div>
                
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="p-5 text-center bg-gradient-to-br from-orange-50 rounded-lg border border-orange-100 to-stone-50"
                >
                  <div className="mb-1 text-3xl font-bold text-orange-700">{highestStreak}</div>
                  <div className="text-sm text-stone-600">Highest Streak</div>
                </motion.div>
              </div>
              
              <div className="mb-8">
                <h3 className="flex items-center mb-4 text-lg font-medium">
                  <Zap className="mr-2 text-yellow-500" size={18} />
                  Performance Insights
                </h3>
                
                <div className="p-4 rounded-lg border bg-stone-50 border-stone-200">
                  {score === questions.length ? (
                    <p className="text-green-700">
                      Perfect score! You've mastered this {topic} {difficulty} quiz.
                    </p>
                  ) : score >= questions.length * 0.8 ? (
                    <p className="text-teal-700">
                      Great job! You have a strong understanding of {topic} at the {difficulty} level.
                    </p>
                  ) : score >= questions.length * 0.6 ? (
                    <p className="text-amber-700">
                      Good effort! With a bit more practice, you'll master {topic} at the {difficulty} level.
                    </p>
                  ) : (
                    <p className="text-orange-700">
                      Keep practicing! {topic} at the {difficulty} level needs more of your attention.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={restartQuiz}
                  className="flex flex-1 justify-center items-center py-3 font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-md transition-all hover:from-teal-600 hover:to-teal-700"
                >
                  Try Another Quiz
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;