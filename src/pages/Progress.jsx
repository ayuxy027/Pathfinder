import React, { useState, useEffect, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import CountUp from 'react-countup';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaTrophy, FaUsers, FaStar, FaSpinner, FaLightbulb } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const preGeneratedInsights = [
  "Great progress in web development! Consider diving into advanced React concepts next.",
  "Your consistent effort is paying off! Maybe explore some DevOps tools to round out your skillset.",
  "Impressive growth in data science! How about tackling a machine learning project to apply your skills?",
  "You're on fire with mobile development! Have you considered learning about cross-platform frameworks?",
  "Solid advancement across the board! It might be time to specialize in an area that excites you most."
];

const ImprovedDashboard = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiInsight, setAiInsight] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        // Simulating API call with fake data
        const response = await new Promise(resolve => 
          setTimeout(() => resolve({
            coursesCompleted: 12,
            currentLevel: 'Advanced',
            peopleAhead: 256,
            totalPoints: 3750,
            learningProgress: {
              'Web Dev': { hoursSpent: 120, projectsCompleted: 15 },
              'Data Sci': { hoursSpent: 80, projectsCompleted: 8 },
              'Mobile': { hoursSpent: 60, projectsCompleted: 6 },
              'DevOps': { hoursSpent: 40, projectsCompleted: 4 },
            },
            skillDistribution: { Beginner: 20, Intermediate: 45, Advanced: 35 },
            monthlyProgress: [25, 40, 60, 80, 85, 95],
            skills: {
              JavaScript: 85,
              React: 80,
              'Node.js': 75,
              Python: 70,
              SQL: 65,
              Git: 90,
            }
          }), 1500)
        );
        setUserData(response);
        setAiInsight(preGeneratedInsights[Math.floor(Math.random() * preGeneratedInsights.length)]);
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [isAuthenticated]);

  const stats = useMemo(() => [
    { title: 'Courses Completed', value: userData?.coursesCompleted, icon: FaGraduationCap },
    { title: 'Current Level', value: userData?.currentLevel, icon: FaTrophy },
    { title: 'My Rank', value: userData?.peopleAhead, icon: FaUsers },
    { title: 'Total Points', value: userData?.totalPoints, icon: FaStar },
  ], [userData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: { size: 10 },
          color: '#333'
        }
      }
    },
    scales: {
      x: { ticks: { color: '#333' } },
      y: { ticks: { color: '#333' } }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  const barChartData = useMemo(() => ({
    labels: Object.keys(userData?.learningProgress || {}),
    datasets: [
      {
        label: 'Hours',
        data: Object.values(userData?.learningProgress || {}).map(p => p.hoursSpent),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Projects',
        data: Object.values(userData?.learningProgress || {}).map(p => p.projectsCompleted),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  }), [userData]);

  const doughnutChartData = useMemo(() => ({
    labels: Object.keys(userData?.skillDistribution || {}),
    datasets: [
      {
        data: Object.values(userData?.skillDistribution || {}),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  }), [userData]);

  const lineChartData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Progress',
        data: userData?.monthlyProgress || [],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  }), [userData]);

  if (authLoading || isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-screen bg-white"
      >
        <FaSpinner className="text-6xl text-gray-400 animate-spin" />
      </motion.div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center justify-center h-screen bg-white"
      >
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-proj">Please log in to view your dashboard.</h1>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-screen min-h-screen p-4 overflow-auto bg-white"
    >
      <div className="mx-auto max-w-7xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-4xl font-bold text-center text-transparent bg-clip-text bg-proj"
        >
          Welcome, {user.name}!
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 transition-all duration-300 transform bg-white border border-gray-200 rounded-lg shadow-lg hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-600">{stat.title}</h2>
                <stat.icon className="text-2xl text-transparent bg-clip-text bg-proj" />
              </div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-proj">
                <CountUp end={typeof stat.value === 'number' ? stat.value : 0} duration={2} />
                {typeof stat.value === 'string' && stat.value}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <div className="flex mb-4 space-x-2">
            {['overview', 'progress', 'skills'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm rounded-full transition ${
                  activeTab === tab ? 'bg-proj text-white font-bold' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
          
          <div className="h-80">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid h-full grid-cols-1 gap-4 md:grid-cols-2"
                >
                  <div className="h-full">
                    <Bar data={barChartData} options={chartOptions} />
                  </div>
                  <div className="h-full">
                    <Doughnut data={doughnutChartData} options={chartOptions} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'progress' && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Line data={lineChartData} options={chartOptions} />
                </motion.div>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3"
                >
                  {Object.entries(userData?.skills || {}).map(([skill, level], index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-white border border-gray-200 rounded-lg shadow"
                    >
                      <h3 className="mb-2 text-sm font-semibold text-gray-700">{skill}</h3>
                      <div className="w-full h-3 bg-gray-200 rounded-full">
                        <motion.div
                          className="h-3 rounded-full bg-proj"
                          initial={{ width: 0 }}
                          animate={{ width: `${level}%` }}
                          transition={{ duration: 1, ease: "easeInOut" }}
                        ></motion.div>
                      </div>
                      <span className="text-xs text-gray-600">{level}%</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg"
        >
          <div className="flex items-center mb-4">
            <FaLightbulb className="mr-3 text-2xl text-yellow-400" />
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-proj">AI Generated Learning Insight</h2>
          </div>
          <p className="text-lg italic text-gray-700">{aiInsight}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ImprovedDashboard;