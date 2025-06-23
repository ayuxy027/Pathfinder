import React, { useState, useRef } from 'react';
import _ from 'lodash';
import { getAIResponse } from './aiRoadmap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, FileText, BookOpen, Link as LinkIcon, Code, Users, 
  Lightbulb, ChevronRight, Download, Save, Plus, X, Edit,
  Clipboard, CheckCircle, HelpCircle, PanelLeftOpen, Tag, Trash2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RoadmapNode, Resource } from '../types';

interface ProfessionTemplate {
  name: string;
  goals: string[];
}

interface RoadmapData {
  roadmap: RoadmapStage[];
  flashcards: Flashcard[];
}

interface RoadmapStage {
  stage: string;
  description: string;
  skills: string[];
  resources: RoadmapResource[];
}

interface RoadmapResource {
  name: string;
  type: string;
  link: string;
}

interface Flashcard {
  question: string;
  answer: string;
}

interface SavedRoadmap {
  id: number;
  date: string;
  profession: string;
  goal: string;
  data: RoadmapData;
}

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

// Common profession templates to help users get started quickly
const PROFESSION_TEMPLATES: ProfessionTemplate[] = [
  { name: 'Software Developer', goals: ['Frontend', 'Backend', 'Full-Stack', 'DevOps', 'Mobile'] },
  { name: 'Data Scientist', goals: ['Machine Learning', 'Big Data', 'NLP', 'Computer Vision', 'Analytics'] },
  { name: 'Designer', goals: ['UI/UX', 'Product Design', 'Graphic Design', 'Motion Graphics', 'Branding'] },
  { name: 'Project Manager', goals: ['Agile', 'Scrum', 'Waterfall', 'Product Management', 'Program Management'] },
  { name: 'Marketing Professional', goals: ['Digital Marketing', 'Content Marketing', 'SEO', 'Social Media', 'Analytics'] }
];

// Sample goal templates that can be quickly inserted
const GOAL_TEMPLATES: string[] = [
  'Advance to a senior position in my field',
  'Transition to a leadership role',
  'Learn the latest technologies',
  'Switch to a different specialization',
  'Prepare for freelance/consulting work',
  'Develop skills for remote work opportunities'
];

// Default skill categories to help users
const DEFAULT_SKILL_CATEGORIES: string[] = [
  'Technical Skills',
  'Soft Skills',
  'Industry Knowledge',
  'Tools & Technologies',
  'Leadership',
  'Communication',
  'Project Management'
];

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  return (
    <div className="inline-flex relative items-center" 
         onMouseEnter={() => setIsVisible(true)} 
         onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div className="absolute z-10 p-2 text-xs text-white rounded shadow-lg bg-gray-700/90 -top-8 min-w-[200px]">
          {content}
        </div>
      )}
    </div>
  );
};

const Roadmap: React.FC = () => {
  const [profession, setProfession] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ProfessionTemplate | null>(null);
  const [savedRoadmaps, setSavedRoadmaps] = useState<SavedRoadmap[]>(() => {
    const saved = localStorage.getItem('savedRoadmaps');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const roadmapRef = useRef<HTMLDivElement>(null);
  
  // Custom skill sections state
  const [skillSections, setSkillSections] = useState<string[]>([]);
  const [newSectionName, setNewSectionName] = useState<string>('');
  const [showSectionInput, setShowSectionInput] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRoadmapData(null);

    try {
      // Pass the skill sections to the AI prompt
      const response = await getAIResponse(userInput, profession, skillSections);
      console.log('Parsed API response:', response);

      if (!response || !response.roadmap || !response.flashcards) {
        throw new Error('Incomplete or invalid data received from AI');
      }
      if (!Array.isArray(response.roadmap) || !Array.isArray(response.flashcards)) {
        throw new Error('Invalid data format: roadmap or flashcards is not an array');
      }

      setRoadmapData(response);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setError(error.message || 'An unexpected error occurred while generating the roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (type?: string): React.ReactNode => {
    switch (type?.toLowerCase()) {
      case 'book': return <BookOpen className="mr-2 w-4 h-4 text-teal-600" />;
      case 'course': return <Code className="mr-2 w-4 h-4 text-purple-600" />;
      case 'website': return <LinkIcon className="mr-2 w-4 h-4 text-blue-600" />;
      case 'tool': return <Users className="mr-2 w-4 h-4 text-orange-600" />; 
      case 'conference': return <Users className="mr-2 w-4 h-4 text-red-600" />;
      default: return <FileText className="mr-2 w-4 h-4 text-gray-500" />;
    }
  };

  const selectProfessionTemplate = (template: ProfessionTemplate): void => {
    setProfession(template.name);
    setSelectedTemplate(template);
    setShowTemplates(false);
  };

  const insertGoal = (goal: string): void => {
    setUserInput(goal);
  };

  const addSkillSection = (): void => {
    if (newSectionName.trim() !== '') {
      setSkillSections([...skillSections, newSectionName.trim()]);
      setNewSectionName('');
      setShowSectionInput(false);
    }
  };

  const removeSkillSection = (index: number): void => {
    const updatedSections = [...skillSections];
    updatedSections.splice(index, 1);
    setSkillSections(updatedSections);
  };

  const addDefaultSkillSection = (section: string): void => {
    if (!skillSections.includes(section)) {
      setSkillSections([...skillSections, section]);
    }
  };

  const saveRoadmap = (): void => {
    if (!roadmapData || !profession) return;
    
    const newSavedRoadmap: SavedRoadmap = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      profession,
      goal: userInput,
      data: roadmapData
    };
    
    const updatedRoadmaps = [...savedRoadmaps, newSavedRoadmap];
    setSavedRoadmaps(updatedRoadmaps);
    localStorage.setItem('savedRoadmaps', JSON.stringify(updatedRoadmaps));
    
    // Show feedback
    alert('Roadmap saved successfully!');
  };

  const loadRoadmap = (savedRoadmap: SavedRoadmap): void => {
    setProfession(savedRoadmap.profession);
    setUserInput(savedRoadmap.goal);
    setRoadmapData(savedRoadmap.data);
  };

  const deleteSavedRoadmap = (id: number): void => {
    const updatedRoadmaps = savedRoadmaps.filter(roadmap => roadmap.id !== id);
    setSavedRoadmaps(updatedRoadmaps);
    localStorage.setItem('savedRoadmaps', JSON.stringify(updatedRoadmaps));
  };

  const copyToClipboard = (): void => {
    if (!roadmapData) return;
    
    const text = `Career Roadmap for ${profession}\nGoal: ${userInput}\n\n` + 
      roadmapData.roadmap.map((stage, i) => 
        `STAGE ${i+1}: ${stage.stage}\n${stage.description}\n\nSkills:\n` + 
        stage.skills.map(skill => `- ${skill}`).join('\n') + 
        `\n\nResources:\n` + 
        stage.resources.map(res => `- ${res.name} (${res.type}): ${res.link}`).join('\n')
      ).join('\n\n');
    
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const exportToPDF = async (): Promise<void> => {
    if (!roadmapRef.current) return;
    
    const canvas = await html2canvas(roadmapRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`roadmap_${profession.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  return (
    <motion.div 
      className="container px-4 py-10 mx-auto max-w-5xl font-sans bg-gradient-to-br from-stone-50 to-white min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1 
        className="mb-8 text-3xl font-bold tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-500 sm:text-4xl lg:text-5xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 80 }}
      >
        Career Roadmap Generator
        <span className="block mt-2 text-base font-medium text-gray-600 sm:text-lg">
          Create your personalized path to success
        </span>
      </motion.h1>
      
      {/* Saved Roadmaps Section with enhanced styling */}
      {savedRoadmaps.length > 0 && (
        <motion.div 
          className="p-6 mb-8 bg-white rounded-xl border shadow-md border-stone-200/70 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <details>
            <summary className="flex items-center text-sm font-medium text-teal-700 cursor-pointer hover:text-teal-600">
              <PanelLeftOpen className="mr-2 w-4 h-4" />
              Your Saved Roadmaps ({savedRoadmaps.length})
            </summary>
            <div className="mt-4 space-y-3">
              {savedRoadmaps.map(roadmap => (
                <motion.div 
                  key={roadmap.id} 
                  className="flex justify-between items-center p-4 rounded-lg border border-stone-200/70 bg-stone-50/50 hover:bg-stone-50 transition-all duration-200"
                  whileHover={{ scale: 1.01 }}
                >
                  <div>
                    <div className="text-sm font-medium text-gray-800">{roadmap.profession}</div>
                    <div className="text-xs text-stone-500">{roadmap.goal}</div>
                    <div className="text-xs text-stone-400">Saved on {roadmap.date}</div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button 
                      onClick={() => loadRoadmap(roadmap)}
                      className="p-2 text-teal-600 rounded-lg transition-colors hover:bg-teal-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FileText size={16} />
                    </motion.button>
                    <motion.button 
                      onClick={() => deleteSavedRoadmap(roadmap.id)}
                      className="p-2 text-rose-500 rounded-lg transition-colors hover:bg-rose-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </details>
        </motion.div>
      )}
      
      <motion.form 
        onSubmit={handleSubmit} 
        className="p-8 mb-12 space-y-6 bg-white rounded-xl border shadow-md border-stone-200/70 backdrop-blur-sm"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="relative">
          <div className="flex justify-between items-center">
            <label htmlFor="profession" className="block mb-2 text-sm font-medium text-stone-700">
              Your Profession:
              <Tooltip content="Enter your current role or the profession you're interested in">
                <HelpCircle className="inline-block ml-1 w-3.5 h-3.5 text-stone-400" />
              </Tooltip>
            </label>
            <button 
              type="button"
              className="px-2 py-1 text-xs font-medium text-teal-700 rounded-md transition-colors bg-teal-50/70 hover:bg-teal-100/80"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              {showTemplates ? 'Hide Templates' : 'Browse Templates'}
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              id="profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="px-3 py-2.5 w-full text-sm rounded-lg border shadow-sm transition duration-150 ease-in-out border-stone-200 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
              required
              placeholder="e.g., Software Engineer, Graphic Designer"
            />
            <AnimatePresence>
              {showTemplates && (
                <motion.div 
                  className="overflow-y-auto absolute z-10 p-2 mt-1 w-full max-h-48 bg-white rounded-md border shadow-md border-stone-200"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  {PROFESSION_TEMPLATES.map(template => (
                    <div 
                      key={template.name}
                      className="p-2 rounded-md cursor-pointer hover:bg-stone-50"
                      onClick={() => selectProfessionTemplate(template)}
                    >
                      <div className="text-sm font-medium text-stone-800">{template.name}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.goals.slice(0, 3).map(goal => (
                          <span key={goal} className="px-1.5 py-0.5 text-xs text-teal-700 rounded bg-teal-50/70">
                            {goal}
                          </span>
                        ))}
                        {template.goals.length > 3 && (
                          <span className="px-1.5 py-0.5 text-xs rounded bg-stone-100 text-stone-600">
                            +{template.goals.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <label htmlFor="userInput" className="block mb-2 text-sm font-medium text-stone-700">
            What are your career goals or areas of focus?
            <Tooltip content="Describe what you want to achieve or learn about your career path">
              <HelpCircle className="inline-block ml-1 w-3.5 h-3.5 text-stone-400" />
            </Tooltip>
          </label>
          <textarea
            id="userInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="px-3 py-2.5 w-full text-sm rounded-lg border shadow-sm transition duration-150 ease-in-out border-stone-200 focus:ring-1 focus:ring-teal-400 focus:border-teal-400 focus:outline-none"
            rows="3"
            required
            placeholder="e.g., 'Transition into AI/ML', 'Become a senior frontend developer', 'Improve project management skills'"
          ></textarea>
          
          <div className="mt-2">
            <p className="mb-1 text-xs font-medium text-stone-500">Quick templates:</p>
            <div className="flex flex-wrap gap-2">
              {(selectedTemplate?.goals || GOAL_TEMPLATES.slice(0, 4)).map(goal => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => insertGoal(goal)}
                  className="px-2 py-1 text-xs rounded-md transition-colors bg-stone-100 hover:bg-stone-200 text-stone-700"
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Skill Section Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-stone-700">
              Skill Categories You Want Included
              <Tooltip content="Add specific skill categories you'd like to see in your roadmap">
                <HelpCircle className="inline-block ml-1 w-3.5 h-3.5 text-stone-400" />
              </Tooltip>
            </label>
          </div>
          
          {/* Custom skill sections list */}
          <div className="flex flex-wrap gap-2 items-center mb-2">
            {skillSections.map((section, index) => (
              <div key={index} className="flex items-center px-2 py-1 text-xs text-teal-700 bg-teal-50 rounded-md">
                <Tag size={12} className="mr-1" />
                {section}
                <button
                  type="button"
                  onClick={() => removeSkillSection(index)}
                  className="ml-1.5 text-teal-500 hover:text-teal-700"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {/* Add section button or input field */}
            {showSectionInput ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="px-2 py-1 w-40 text-xs rounded-l-md border border-stone-200 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  placeholder="Category name..."
                />
                <button
                  type="button"
                  onClick={addSkillSection}
                  className="px-2 py-1 text-xs text-white bg-teal-600 rounded-r-md border border-teal-600 hover:bg-teal-700"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSectionInput(true)}
                className="flex items-center px-2 py-1 text-xs text-teal-600 bg-teal-50 rounded-md transition-colors hover:bg-teal-100"
              >
                <Plus size={12} className="mr-1" /> Add Category
              </button>
            )}
          </div>
          
          {/* Suggested skill categories */}
          <div className="mt-2">
            <p className="mb-1 text-xs font-medium text-stone-500">Suggested categories:</p>
            <div className="flex flex-wrap gap-1">
              {DEFAULT_SKILL_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => addDefaultSkillSection(category)}
                  disabled={skillSections.includes(category)}
                  className={`px-1.5 py-0.5 text-xs rounded ${
                    skillSections.includes(category)
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <motion.button 
          type="submit" 
          className={`w-full flex justify-center items-center px-4 py-2.5 text-sm font-medium text-white transition duration-300 ease-in-out rounded-lg shadow-sm ${loading ? 'bg-stone-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'}`}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Generating...
            </>
          ) : 'Generate Roadmap'}
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {error && (
          <motion.div 
            className="p-4 mb-8 text-sm text-red-800 bg-red-50 rounded-lg border-red-200 shadow-sm border-l-4"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {roadmapData && (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.08 }}
            ref={roadmapRef}
          >
            <div className="flex flex-col gap-3 justify-between items-center mb-5 sm:flex-row">
              <motion.h2 
                className="text-2xl font-medium text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-500 sm:text-2xl"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Your Personalized Career Roadmap
              </motion.h2>
              
              <div className="flex space-x-2">
                <Tooltip content="Save this roadmap for future reference">
                  <motion.button
                    onClick={saveRoadmap}
                    className="flex items-center px-2 py-1.5 text-xs font-medium text-blue-700 rounded-md transition-colors bg-blue-50/80 hover:bg-blue-100/90"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Save className="mr-1 w-3.5 h-3.5" /> Save
                  </motion.button>
                </Tooltip>
                
                <Tooltip content="Copy roadmap text to clipboard">
                  <motion.button
                    onClick={copyToClipboard}
                    className="flex items-center px-2 py-1.5 text-xs font-medium text-purple-700 rounded-md transition-colors bg-purple-50/80 hover:bg-purple-100/90"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isCopied ? (
                      <><CheckCircle className="mr-1 w-3.5 h-3.5" /> Copied!</>
                    ) : (
                      <><Clipboard className="mr-1 w-3.5 h-3.5" /> Copy</>
                    )}
                  </motion.button>
                </Tooltip>
                
                <Tooltip content="Export as PDF">
                  <motion.button
                    onClick={exportToPDF}
                    className="flex items-center px-2 py-1.5 text-xs font-medium text-green-700 rounded-md transition-colors bg-green-50/80 hover:bg-green-100/90"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Download className="mr-1 w-3.5 h-3.5" /> Export
                  </motion.button>
                </Tooltip>
              </div>
            </div>
            
            {/* Roadmap Stages */}
            <div className="space-y-5">
              {roadmapData.roadmap?.map((stage, index) => (
                <motion.div 
                  key={index} 
                  className="overflow-hidden bg-white rounded-lg border shadow-sm transition-shadow duration-200 border-stone-100 hover:shadow-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                >
                  <div className="p-4 bg-gradient-to-r from-teal-50/70 to-blue-50/50">
                     <h3 className="flex items-center mb-1 text-base font-medium text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-blue-600 sm:text-lg">
                       <span className="flex justify-center items-center mr-2 w-6 h-6 text-sm font-medium text-white rounded-full bg-teal-600/90">{index + 1}</span> {stage.stage || `Stage ${index + 1}`}
                     </h3>
                  </div>
                  <div className="p-4 space-y-3 text-sm">
                    <p className="text-stone-600">{stage.description || 'No description provided.'}</p>
                    
                    {stage.skills && stage.skills.length > 0 && (
                      <div>
                        <h4 className="flex items-center mb-1 text-sm font-medium text-teal-700"><Lightbulb className="mr-1.5 w-4 h-4"/>Skills to Develop:</h4>
                        <ul className="space-y-1 text-stone-600">
                          {stage.skills.map((skill, skillIndex) => (
                            <li key={skillIndex} className="flex items-center"><ChevronRight className="flex-shrink-0 mr-1 w-3.5 h-3.5 text-teal-500"/>{skill}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {stage.resources && stage.resources.length > 0 && (
                       <div>
                         <h4 className="flex items-center mb-1 text-sm font-medium text-teal-700"><BookOpen className="mr-1.5 w-4 h-4"/>Recommended Resources:</h4>
                         <ul className="space-y-1.5 text-stone-600">
                           {stage.resources.map((resource, resourceIndex) => (
                             <li key={resourceIndex} className="flex items-center">
                               {getResourceIcon(resource.type)}
                               <a 
                                 href={resource.link || '#'} 
                                 target="_blank" 
                                 rel="noopener noreferrer" 
                                 className="text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline"
                               >
                                 {resource.name || 'Unnamed Resource'} {resource.type ? `(${resource.type})` : ''}
                               </a>
                             </li>
                           ))}
                         </ul>
                       </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Flashcards Section */}
            {roadmapData.flashcards && roadmapData.flashcards.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + (roadmapData.roadmap?.length || 0) * 0.08 }}
              >
                <h2 className="mt-12 mb-5 text-xl font-medium text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-500 sm:text-2xl">Key Concept Flashcards</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {roadmapData.flashcards.map((flashcard, index) => (
                    <motion.div 
                      key={index} 
                      className="p-4 space-y-2 text-sm bg-white rounded-lg border shadow-sm transition-shadow duration-200 border-stone-100 hover:shadow-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (roadmapData.roadmap?.length || 0) * 0.08 + index * 0.04 }}
                    >
                      <div>
                         <h3 className="mb-1 text-xs font-medium tracking-wide text-teal-600 uppercase">Question:</h3>
                         <p className="text-stone-700">{flashcard.question || 'No question provided.'}</p>
                      </div>
                       <hr className="border-stone-100"/>
                      <div>
                         <h3 className="mb-1 text-xs font-medium tracking-wide text-teal-600 uppercase">Answer:</h3>
                         <p className="text-stone-500">{flashcard.answer || 'No answer provided.'}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Roadmap;