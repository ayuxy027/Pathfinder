import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, BookOpen, Code, Link, Clock, Award, Calendar, BarChart2, Lightbulb, ChevronRight, Star, Users, Zap } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Progress = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('skills');
  const [activeMetric, setActiveMetric] = useState('weekly');
  const [error, setError] = useState(null);

  // Insights data
  const insights = [
    { id: 1, text: "You're in the top 15% of JavaScript learners this month", icon: <Zap className="text-yellow-400" /> },
    { id: 2, text: "Your React skills have improved 34% in the last 30 days", icon: <BarChart2 className="text-green-400" /> },
    { id: 3, text: "Consider exploring GraphQL to complement your API knowledge", icon: <Lightbulb className="text-blue-400" /> },
  ];

  // Skill data
  const skillData = {
    JavaScript: 85,
    React: 78,
    "Node.js": 72,
    TypeScript: 65,
    GraphQL: 48,
    "UI Design": 70,
  };

  // Progress data for different time periods
  const progressData = {
    weekly: [35, 42, 50, 45, 62, 68, 75],
    monthly: [320, 380, 450, 520, 610, 580, 650],
    yearly: [1200, 1850, 2400, 3600, 4200, 5100, 5800]
  };

  // Learning streak data
  const streakData = {
    currentStreak: 12,
    longestStreak: 28,
    thisWeek: 5,
    totalDays: 142
  };

  // Achievement data
  const achievements = [
    { name: "Frontend Master", description: "Completed all React advanced courses", date: "2 days ago", icon: <Code className="text-blue-400" /> },
    { name: "Algorithm Adept", description: "Solved 50 algorithm challenges", date: "Last week", icon: <Star className="text-yellow-400" /> },
    { name: "Consistent Learner", description: "Maintained a 7-day streak", date: "3 weeks ago", icon: <Clock className="text-green-400" /> },
  ];

  // Mock API fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUserData({
          totalHours: 325,
          coursesCompleted: 18,
          rank: 125,
          certificatesEarned: 3
        });
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load user progress data. Please try again later.");
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Chart configurations
  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(64, 64, 64, 0.8)',
          font: { size: 11, family: "'Inter', sans-serif" },
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: 'rgba(0, 0, 0, 0.8)',
        bodyColor: 'rgba(0, 0, 0, 0.7)',
        borderColor: 'rgba(100, 116, 139, 0.5)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 12, family: "'Inter', sans-serif" },
        bodyFont: { size: 11, family: "'Inter', sans-serif" },
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false, color: 'rgba(100, 116, 139, 0.2)' },
        ticks: { color: 'rgba(0, 0, 0, 0.7)', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(100, 116, 139, 0.2)' },
        ticks: { color: 'rgba(0, 0, 0, 0.7)', font: { size: 10 } }
      }
    },
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    }
  });

  // Skill chart data
  const skillChartData = {
    labels: Object.keys(skillData),
    datasets: [
      {
        label: 'Skill Proficiency',
        data: Object.values(skillData),
        backgroundColor: [
          'rgba(45, 212, 191, 0.7)',  // teal
          'rgba(251, 146, 60, 0.7)',  // orange
          'rgba(52, 211, 153, 0.7)',  // green
          'rgba(192, 132, 252, 0.7)', // purple
          'rgba(251, 113, 133, 0.7)', // rose
          'rgba(250, 204, 21, 0.7)',  // yellow
        ],
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        barThickness: 22,
        borderRadius: 6,
      },
    ],
  };

  // Progress chart data
  const getProgressChartData = (metric) => ({
    labels: metric === 'weekly' 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : metric === 'monthly'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
        : ['2017', '2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: metric === 'weekly' ? 'Minutes' : metric === 'monthly' ? 'Hours' : 'Hours',
        data: progressData[metric],
        borderColor: 'rgba(45, 212, 191, 0.8)',
        backgroundColor: 'rgba(45, 212, 191, 0.15)',
        pointBackgroundColor: 'rgba(45, 212, 191, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: 4,
        borderWidth: 3,
        tension: 0.3,
        fill: true
      },
    ],
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          <p className="text-lg font-medium text-gray-700">Loading your progress...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
        <div className="p-8 max-w-md text-center bg-white rounded-xl shadow-xl border border-stone-200/70 backdrop-blur-sm">
          <div className="mx-auto mb-4 w-16 h-16 text-red-500">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800">Something went wrong</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <motion.button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 font-medium text-white bg-gradient-to-r from-teal-600 to-teal-500 rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 hover:shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
        <div className="p-8 max-w-md text-center bg-white rounded-xl shadow-xl border border-stone-200/70 backdrop-blur-sm">
          <Users className="mx-auto mb-6 w-16 h-16 text-teal-500" />
          <h1 className="mb-4 text-2xl font-bold text-gray-800">Track Your Learning Journey</h1>
          <p className="mb-6 text-gray-600">Sign in to access personalized progress tracking, achievements, and learning insights.</p>
          <motion.button 
            className="px-6 py-3 font-medium text-white bg-gradient-to-r from-teal-600 to-teal-500 rounded-lg shadow-md hover:from-teal-700 hover:to-teal-600 hover:shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign in to continue
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <div className="container px-4 py-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-500">
              Your Learning Dashboard
            </span>
          </h1>
          <p className="text-gray-600 md:text-lg">
            Track your progress, achievements, and growth in your developer journey
          </p>
        </motion.div>

        {/* Stats Overview with enhanced styling */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4"
        >
          {[
            { label: 'Learning Hours', value: userData?.totalHours || 0, icon: <Clock className="text-teal-500" /> },
            { label: 'Courses Completed', value: userData?.coursesCompleted || 0, icon: <BookOpen className="text-teal-500" /> },
            { label: 'Global Rank', value: `#${userData?.rank || 0}`, icon: <Award className="text-teal-500" /> },
            { label: 'Certificates', value: userData?.certificatesEarned || 0, icon: <Code className="text-teal-500" /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              className="overflow-hidden relative p-6 bg-white rounded-xl border shadow-md border-stone-200/70 backdrop-blur-sm hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex flex-col h-full">
                <div className="mb-3 text-2xl">{stat.icon}</div>
                <p className="mb-1 text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid with enhanced styling */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 lg:col-span-2"
          >
            {/* Chart Section */}
            <div className="p-6 bg-white rounded-xl border shadow-md border-stone-200/70 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-stone-800">Learning Analytics</h2>
                <div className="flex space-x-2">
                  {['skills', 'progress'].map((chart) => (
                    <button
                      key={chart}
                      onClick={() => setActiveChart(chart)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                        activeChart === chart
                          ? 'bg-teal-500 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {chart === 'skills' ? 'Skills' : 'Progress'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-72">
                <AnimatePresence mode="wait">
                  {activeChart === 'skills' ? (
                    <motion.div
                      key="skills"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      <Bar data={skillChartData} options={getChartOptions()} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="progress"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full"
                    >
                      <div className="flex justify-end mb-4 space-x-2">
                        {['weekly', 'monthly', 'yearly'].map((metric) => (
                          <button
                            key={metric}
                            onClick={() => setActiveMetric(metric)}
                            className={`px-2 py-1 text-xs font-medium rounded transition ${
                              activeMetric === metric
                                ? 'bg-teal-100 text-teal-700'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            {metric.charAt(0).toUpperCase() + metric.slice(1)}
                          </button>
                        ))}
                      </div>
                      <Line data={getProgressChartData(activeMetric)} options={getChartOptions()} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="p-6 bg-white rounded-xl border shadow-md border-stone-200/70 backdrop-blur-sm">
              <h2 className="flex items-center mb-6 text-xl font-bold text-stone-800">
                <Award className="mr-2 text-teal-500" />
                Recent Achievements
              </h2>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start p-4 rounded-lg transition-all bg-stone-50 hover:bg-stone-100"
                  >
                    <div className="flex justify-center items-center mr-4 w-10 h-10 bg-white rounded-full shadow-sm">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 font-semibold text-stone-800">{achievement.name}</h3>
                      <p className="mb-2 text-sm text-stone-600">{achievement.description}</p>
                      <span className="text-xs text-stone-500">{achievement.date}</span>
                    </div>
                    <div className="self-center">
                      <ChevronRight className="text-stone-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Learning Streak */}
            <div className="p-6 bg-white rounded-xl border shadow-md border-stone-200/70 backdrop-blur-sm">
              <h2 className="flex items-center mb-5 text-xl font-bold text-stone-800">
                <Calendar className="mr-2 text-teal-500" />
                Learning Streaks
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Current Streak', value: `${streakData.currentStreak} days` },
                  { label: 'Longest Streak', value: `${streakData.longestStreak} days` },
                  { label: 'This Week', value: `${streakData.thisWeek}/7 days` },
                  { label: 'Total Days', value: streakData.totalDays }
                ].map((item, index) => (
                  <div key={index} className="p-3 text-center rounded-lg bg-stone-50">
                    <p className="mb-1 text-xs font-medium text-stone-500">{item.label}</p>
                    <p className="text-xl font-bold text-stone-800">{item.value}</p>
                  </div>
                ))}
              </div>
              
              {/* Weekly Activity */}
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-medium text-stone-500">This Week's Activity</h3>
                <div className="grid grid-cols-7 gap-1">
                  {[5, 1, 3, 4, 2, 0, 0].map((intensity, i) => {
                    const colors = [
                      'bg-stone-200', // none
                      'bg-teal-100', // low
                      'bg-teal-200', // medium-low
                      'bg-teal-300', // medium
                      'bg-teal-400', // medium-high
                      'bg-teal-500' // high
                    ];
                    return (
                      <div
                        key={i}
                        className={`w-full h-8 rounded ${colors[intensity]}`}
                        title={`${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}: ${intensity > 0 ? intensity * 15 : 0} minutes`}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Learning Insights */}
            <div className="p-6 bg-white rounded-xl border shadow-md border-stone-200/70 backdrop-blur-sm">
              <h2 className="flex items-center mb-5 text-xl font-bold text-stone-800">
                <Lightbulb className="mr-2 text-teal-500" />
                Learning Insights
              </h2>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex p-3 rounded-lg bg-stone-50"
                  >
                    <div className="flex justify-center items-center mr-3 w-8 h-8 bg-white rounded-full shadow-sm">
                      {insight.icon}
                    </div>
                    <p className="text-sm text-stone-700">{insight.text}</p>
                  </motion.div>
                ))}
              </div>
              <button className="flex justify-center items-center py-2 mt-4 w-full text-sm font-medium rounded-lg transition-colors text-stone-600 bg-stone-100 hover:bg-stone-200">
                View All Insights
                <ChevronRight className="ml-1" />
              </button>
            </div>
            
            {/* Suggested Learning Paths */}
            <div className="p-6 bg-white rounded-xl border shadow-md border-stone-200/70 backdrop-blur-sm">
              <h2 className="mb-4 text-lg font-bold text-stone-800">Recommended Next Steps</h2>
              <div className="space-y-3">
                {[
                  { title: "Advanced React Patterns", level: "Intermediate", time: "2-3 hours" },
                  { title: "GraphQL Fundamentals", level: "Beginner", time: "4 hours" },
                  { title: "React Performance Optimization", level: "Advanced", time: "1-2 hours" }
                ].map((course, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                    className="flex items-center p-3 rounded-lg transition-all cursor-pointer bg-stone-50 hover:bg-teal-50"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-stone-800">{course.title}</h3>
                      <div className="flex mt-1 text-xs text-stone-500">
                        <span className="mr-2">{course.level}</span>
                        <span>•</span>
                        <span className="ml-2">{course.time}</span>
                      </div>
                    </div>
                    <button className="p-1.5 text-white bg-teal-500 rounded-full hover:bg-teal-600">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Progress;