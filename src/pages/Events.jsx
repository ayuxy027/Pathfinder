import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, User, BookOpen, Award, Briefcase, X, Download, Camera, Paperclip } from 'lucide-react';

const tabs = [
  { id: 'about', label: 'About', icon: User },
  { id: 'education', label: 'Education', icon: BookOpen },
  { id: 'skills', label: 'Skills', icon: Award },
  { id: 'experience', label: 'Experience', icon: Briefcase },
];

const professionCategories = [
  'Technology', 'Healthcare', 'Education', 'Finance', 'Arts & Entertainment',
  'Legal', 'Marketing', 'Engineering', 'Hospitality', 'Other'
];

export default function UniversalResumeBuilder() {
  const [activeTab, setActiveTab] = useState('about');
  const [formData, setFormData] = useState({
    about: { name: '', email: '', phone: '', location: '', summary: '', profession: '' },
    education: { degree: '', institution: '', year: '', achievements: '' },
    skills: { professional: '', personal: '', languages: '' },
    experience: { title: '', company: '', period: '', responsibilities: '', media: null }
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setFormData(prev => ({
        ...prev,
        experience: { ...prev.experience, media: file }
      }));
    } else {
      alert('Please upload a PDF or image file');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleDownload = () => {
    const resumeContent = JSON.stringify(formData, null, 2);
    const blob = new Blob([resumeContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-teal-50 p-6">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
            <motion.button
              onClick={handleDownload}
              className="flex items-center w-full p-3 mt-4 bg-teal-500 text-white rounded-lg transition-colors hover:bg-teal-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="mr-2" size={20} />
              Download Resume
            </motion.button>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4 p-8">
            <h2 className="text-3xl font-bold text-teal-700 mb-6">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h2>
            <form onSubmit={handleSubmit}>
              {activeTab === 'about' && (
                <AboutSection
                  data={formData.about}
                  onChange={(field, value) => handleInputChange('about', field, value)}
                />
              )}
              {activeTab === 'education' && (
                <EducationSection
                  data={formData.education}
                  onChange={(field, value) => handleInputChange('education', field, value)}
                />
              )}
              {activeTab === 'skills' && (
                <SkillsSection
                  data={formData.skills}
                  onChange={(field, value) => handleInputChange('skills', field, value)}
                />
              )}
              {activeTab === 'experience' && (
                <ExperienceSection
                  data={formData.experience}
                  onChange={(field, value) => handleInputChange('experience', field, value)}
                  onFileChange={handleFileChange}
                />
              )}
              <motion.button
                type="submit"
                className="mt-6 px-6 py-3 bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Preview Resume
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPreview && (
          <ResumePreview formData={formData} onClose={() => setShowPreview(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ id, label, icon: Icon, isActive, onClick }) {
  return (
    <motion.button
      className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${
        isActive ? 'bg-teal-500 text-white' : 'text-teal-700 hover:bg-teal-100'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="mr-2" size={20} />
      {label}
    </motion.button>
  );
}

function InputField({ label, type = 'text', value, onChange, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-teal-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        {...props}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-teal-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        rows="4"
        {...props}
      />
    </div>
  );
}

function AboutSection({ data, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <InputField label="Full Name" value={data.name} onChange={(value) => onChange('name', value)} placeholder="John Doe" />
      <InputField label="Email" type="email" value={data.email} onChange={(value) => onChange('email', value)} placeholder="john@example.com" />
      <InputField label="Phone" type="tel" value={data.phone} onChange={(value) => onChange('phone', value)} placeholder="+1 (555) 123-4567" />
      <InputField label="Location" value={data.location} onChange={(value) => onChange('location', value)} placeholder="New York, NY" />
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1">Profession Category</label>
        <select
          value={data.profession}
          onChange={(e) => onChange('profession', e.target.value)}
          className="w-full p-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Select a category</option>
          {professionCategories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <TextArea label="Professional Summary" value={data.summary} onChange={(value) => onChange('summary', value)} placeholder="Write a brief summary of your professional background and career objectives..." />
    </motion.div>
  );
}

function EducationSection({ data, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <InputField label="Degree/Certification" value={data.degree} onChange={(value) => onChange('degree', value)} placeholder="Bachelor of Arts in Communication" />
      <InputField label="Institution" value={data.institution} onChange={(value) => onChange('institution', value)} placeholder="University of Example" />
      <InputField label="Completion Year" type="number" value={data.year} onChange={(value) => onChange('year', value)} placeholder="2023" />
      <TextArea label="Achievements/Honors" value={data.achievements} onChange={(value) => onChange('achievements', value)} placeholder="List any academic achievements, honors, or relevant coursework..." />
    </motion.div>
  );
}

function SkillsSection({ data, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TextArea label="Professional Skills" value={data.professional} onChange={(value) => onChange('professional', value)} placeholder="List your professional skills relevant to your field..." />
      <TextArea label="Personal Skills" value={data.personal} onChange={(value) => onChange('personal', value)} placeholder="List your personal skills (e.g., communication, teamwork, problem-solving)..." />
      <TextArea label="Languages" value={data.languages} onChange={(value) => onChange('languages', value)} placeholder="List languages you speak and your proficiency level..." />
    </motion.div>
  );
}

function ExperienceSection({ data, onChange, onFileChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <InputField label="Job Title" value={data.title} onChange={(value) => onChange('title', value)} placeholder="Marketing Manager" />
      <InputField label="Company/Organization" value={data.company} onChange={(value) => onChange('company', value)} placeholder="Global Innovations Inc." />
      <InputField label="Employment Period" value={data.period} onChange={(value) => onChange('period', value)} placeholder="Jan 2020 - Present" />
      <TextArea label="Key Responsibilities" value={data.responsibilities} onChange={(value) => onChange('responsibilities', value)} placeholder="Describe your key responsibilities and achievements in this role..." />
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-teal-700 mb-2">Upload Additional Documents or Images</h3>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-teal-300 border-dashed rounded-lg cursor-pointer bg-teal-50 hover:bg-teal-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-teal-500" />
              <p className="mb-2 text-sm text-teal-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-teal-500">PDF or Image (MAX. 10MB)</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" accept=".pdf,image/*" onChange={onFileChange} />
          </label>
        </div>
        {data.media && (
          <p className="mt-2 text-sm text-teal-600">
            <Paperclip className="inline-block mr-1" size={16} />
            {data.media.name}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function ResumePreview({ formData, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-teal-700">Resume Preview</h2>
          <button onClick={onClose} className="text-teal-500 hover:text-teal-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-teal-600 mb-2">About</h3>
            <p><strong>Name:</strong> {formData.about.name}</p>
            <p><strong>Email:</strong> {formData.about.email}</p>
            <p><strong>Phone:</strong> {formData.about.phone}</p>
            <p><strong>Location:</strong> {formData.about.location}</p>
            <p><strong>Profession:</strong> {formData.about.profession}</p>
            <p><strong>Summary:</strong> {formData.about.summary}</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-teal-600 mb-2">Education</h3>
            <p><strong>Degree/Certification:</strong>   {formData.education.degree}</p>
            <p><strong>Institution:</strong> {formData.education.institution}</p>
            <p><strong>Year:</strong> {formData.education.year}</p>
            <p><strong>Achievements:</strong> {formData.education.achievements}</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-teal-600 mb-2">Skills</h3>
            <p><strong>Professional Skills:</strong> {formData.skills.professional}</p>
            <p><strong>Personal Skills:</strong> {formData.skills.personal}</p>
            <p><strong>Languages:</strong> {formData.skills.languages}</p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-teal-600 mb-2">Experience</h3>
            <p><strong>Job Title:</strong> {formData.experience.title}</p>
            <p><strong>Company/Organization:</strong> {formData.experience.company}</p>
            <p><strong>Period:</strong> {formData.experience.period}</p>
            <p><strong>Responsibilities:</strong> {formData.experience.responsibilities}</p>
            {formData.experience.media && (
              <div>
                <p><strong>Uploaded File:</strong> {formData.experience.media.name}</p>
                {formData.experience.media.type.startsWith('image/') && (
                  <img 
                    src={URL.createObjectURL(formData.experience.media)} 
                    alt="Uploaded content" 
                    className="mt-2 max-w-full h-auto rounded-lg shadow-md"
                  />
                )}
              </div>
            )}
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}