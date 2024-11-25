import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BookOpen, Award, Briefcase, Download, X, Plus, Trash2 } from 'react-feather';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ErrorBoundary } from 'react-error-boundary';
import { v4 as uuidv4 } from 'uuid';
import autoAnimate from '@formkit/auto-animate';

// Constants
const MAX_NAME_LENGTH = 100;
const MAX_SUMMARY_LENGTH = 500;
const MAX_SKILLS = 20;
const MAX_EXPERIENCES = 10;
const MAX_EDUCATION = 5;

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

// Utility functions
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^\+?[\d\s-]{10,14}$/.test(phone);
const sanitizeInput = (input) => input.replace(/[<>&'"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;', '&': '&amp;' }[char]));

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [formData, setFormData] = useState({
    about: { name: '', email: '', phone: '', location: '', summary: '', profession: '' },
    education: [{ id: uuidv4(), degree: '', institution: '', year: '' }],
    skills: [{ id: uuidv4(), name: '' }],
    experience: [{ id: uuidv4(), title: '', company: '', period: '', responsibilities: '' }]
  });
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const dragItem = useRef();
  const dragOverItem = useRef();

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validate About section
    if (!formData.about.name.trim()) newErrors.name = 'Name is required';
    if (formData.about.name.length > MAX_NAME_LENGTH) newErrors.name = `Name must be ${MAX_NAME_LENGTH} characters or less`;
    if (!isValidEmail(formData.about.email)) newErrors.email = 'Invalid email format';
    if (!isValidPhone(formData.about.phone)) newErrors.phone = 'Invalid phone number';
    if (formData.about.summary.length > MAX_SUMMARY_LENGTH) newErrors.summary = `Summary must be ${MAX_SUMMARY_LENGTH} characters or less`;
    if (!formData.about.profession) newErrors.profession = 'Profession is required';

    // Validate Education section
    if (formData.education.length > MAX_EDUCATION) newErrors.education = `Maximum of ${MAX_EDUCATION} education entries allowed`;
    formData.education.forEach((edu, index) => {
      if (!edu.degree.trim()) newErrors[`education_${index}_degree`] = 'Degree is required';
      if (!edu.institution.trim()) newErrors[`education_${index}_institution`] = 'Institution is required';
      if (!edu.year || isNaN(edu.year)) newErrors[`education_${index}_year`] = 'Valid year is required';
    });

    // Validate Skills section
    if (formData.skills.length > MAX_SKILLS) newErrors.skills = `Maximum of ${MAX_SKILLS} skills allowed`;
    formData.skills.forEach((skill, index) => {
      if (!skill.name.trim()) newErrors[`skill_${index}`] = 'Skill name is required';
    });

    // Validate Experience section
    if (formData.experience.length > MAX_EXPERIENCES) newErrors.experience = `Maximum of ${MAX_EXPERIENCES} experience entries allowed`;
    formData.experience.forEach((exp, index) => {
      if (!exp.title.trim()) newErrors[`experience_${index}_title`] = 'Job title is required';
      if (!exp.company.trim()) newErrors[`experience_${index}_company`] = 'Company is required';
      if (!exp.period.trim()) newErrors[`experience_${index}_period`] = 'Period is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((section, field, value, index = 0) => {
    setFormData(prev => ({
      ...prev,
      [section]: Array.isArray(prev[section])
        ? prev[section].map((item, i) => {
            if (i === index) {
              return { ...item, [field]: sanitizeInput(value) };
            }
            return item;
          })
        : { ...prev[section], [field]: sanitizeInput(value) }
    }));
  }, []);

  const addItem = useCallback((section) => {
    setFormData(prev => {
      if (
        (section === 'education' && prev.education.length >= MAX_EDUCATION) ||
        (section === 'experience' && prev.experience.length >= MAX_EXPERIENCES) ||
        (section === 'skills' && prev.skills.length >= MAX_SKILLS)
      ) {
        return prev; // Do not add if maximum limit reached
      }
      return {
        ...prev,
        [section]: [...prev[section], 
          section === 'skills' ? { id: uuidv4(), name: '' } : 
          section === 'education' ? { id: uuidv4(), degree: '', institution: '', year: '' } : 
          { id: uuidv4(), title: '', company: '', period: '', responsibilities: '' }
        ]
      };
    });
  }, []);

  const removeItem = useCallback((section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPreview(true);
    }
  }, [validateForm]);

  const handleDownload = useCallback(() => {
    try {
      const doc = new jsPDF();
      
      // Add content to PDF
      doc.setFontSize(20);
      doc.text('Resume', 105, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`${formData.about.name}`, 20, 30);
      doc.text(`Email: ${formData.about.email}`, 20, 40);
      doc.text(`Phone: ${formData.about.phone}`, 20, 50);
      doc.text(`Location: ${formData.about.location}`, 20, 60);
      doc.text(`Profession: ${formData.about.profession}`, 20, 70);
      
      doc.setFontSize(16);
      doc.text('Professional Summary', 20, 85);
      doc.setFontSize(12);
      const splitSummary = doc.splitTextToSize(formData.about.summary, 170);
      doc.text(splitSummary, 20, 95);

      let yPos = 95 + splitSummary.length * 7;

      // Add Education section
      doc.setFontSize(16);
      doc.text('Education', 20, yPos);
      yPos += 10;
      doc.setFontSize(12);
      formData.education.forEach((edu) => {
        doc.text(`${edu.degree} - ${edu.institution} (${edu.year})`, 20, yPos);
        yPos += 10;
      });

      // Add Skills section
      yPos += 10;
      doc.setFontSize(16);
      doc.text('Skills', 20, yPos);
      yPos += 10;
      doc.setFontSize(12);
      const skillsText = formData.skills.map(skill => skill.name).join(', ');
      const splitSkills = doc.splitTextToSize(skillsText, 170);
      doc.text(splitSkills, 20, yPos);
      yPos += splitSkills.length * 7;

      // Add Experience section
      yPos += 10;
      doc.setFontSize(16);
      doc.text('Experience', 20, yPos);
      yPos += 10;
      doc.setFontSize(12);
      formData.experience.forEach((exp) => {
        doc.text(`${exp.title} at ${exp.company}`, 20, yPos);
        yPos += 7;
        doc.text(`Period: ${exp.period}`, 20, yPos);
        yPos += 7;
        const splitResp = doc.splitTextToSize(`Responsibilities: ${exp.responsibilities}`, 170);
        doc.text(splitResp, 20, yPos);
        yPos += splitResp.length * 7 + 10;
      });

      doc.save('resume.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      // Show user-friendly error message
      alert('Failed to generate PDF. Please try again.');
    }
  }, [formData]);

  const dragStart = (e, position) => {
    dragItem.current = position;
    setIsDragging(true);
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const drop = (section) => {
    const copyListItems = [...formData[section]];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setFormData(prev => ({
      ...prev,
      [section]: copyListItems
    }));
    setIsDragging(false);
  };

  const memoizedAboutSection = useMemo(() => (
    <AboutSection
      data={formData.about}
      onChange={(field, value) => handleInputChange('about', field, value)}
      errors={errors}
    />
  ), [formData.about, handleInputChange, errors]);

  const memoizedEducationSection = useMemo(() => (
    <DynamicSection
      data={formData.education}
      onChange={(field, value, index) => handleInputChange('education', field, value, index)}
      onAdd={() => addItem('education')}
      onRemove={(index) => removeItem('education', index)}
      renderFields={(item, index) => (
        <>
          <InputField label="Degree" value={item.degree} onChange={(value) => handleInputChange('education', 'degree', value, index)} error={errors[`education_${index}_degree`]} />
          <InputField label="Institution" value={item.institution} onChange={(value) => handleInputChange('education', 'institution', value, index)} error={errors[`education_${index}_institution`]} />
          <InputField label="Year" type="number" value={item.year} onChange={(value) => handleInputChange('education', 'year', value, index)} error={errors[`education_${index}_year`]} />
        </>
      )}
      error={errors.education}
      onDragStart={dragStart}
      onDragEnter={dragEnter}
      onDrop={() => drop('education')}
      isDragging={isDragging}
    />
  ), [formData.education, handleInputChange, addItem, removeItem, errors, isDragging]);

  const memoizedSkillsSection = useMemo(() => (
    <DynamicSection
      data={formData.skills}
      onChange={(field, value, index) => handleInputChange('skills', field, value, index)}
      onAdd={() => addItem('skills')}
      onRemove={(index) => removeItem('skills', index)}
      renderFields={(item, index) => (
        <InputField 
          label={`Skill ${index + 1}`} 
          value={item.name} 
          onChange={(value) => handleInputChange('skills', 'name', value, index)} 
          error={errors[`skill_${index}`]}
        />
      )}
      error={errors.skills}
      onDragStart={dragStart}
      onDragEnter={dragEnter}
      onDrop={() => drop('skills')}
      isDragging={isDragging}
    />
  ), [formData.skills, handleInputChange, addItem, removeItem, errors, isDragging]);

  const memoizedExperienceSection = useMemo(() => (
    <DynamicSection
      data={formData.experience}
      onChange={(field, value, index) => handleInputChange('experience', field, value, index)}
      onAdd={() => addItem('experience')}
      onRemove={(index) => removeItem('experience', index)}
      renderFields={(item, index) => (
        <>
          <InputField label="Job Title" value={item.title} onChange={(value) => handleInputChange('experience', 'title', value, index)} error={errors[`experience_${index}_title`]} />
          <InputField label="Company" value={item.company} onChange={(value) => handleInputChange('experience', 'company', value, index)} error={errors[`experience_${index}_company`]} />
          <InputField label="Period" value={item.period} onChange={(value) => handleInputChange('experience', 'period', value, index)} error={errors[`experience_${index}_period`]} />
          <TextArea label="Responsibilities" value={item.responsibilities} onChange={(value) => handleInputChange('experience', 'responsibilities', value, index)} />
        </>
      )}
      error={errors.experience}
      onDragStart={dragStart}
      onDragEnter={dragEnter}
      onDrop={() => drop('experience')}
      isDragging={isDragging}
    />
  ), [formData.experience, handleInputChange, addItem, removeItem, errors, isDragging]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen p-8 bg-gradient-to-br from-teal-100 to-blue-100">
        <div className="max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="flex">
            <div className="w-1/4 p-6 bg-teal-50">
              {tabs.map((tab) =>
<TabButton
                  key={tab.id}
                  {...tab}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              )}
              <motion.button
                onClick={handleDownload}
                className="flex items-center w-full p-3 mt-4 text-white transition-colors duration-200 bg-teal-500 rounded-lg hover:bg-teal-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="mr-2" size={20} />
                Download PDF
              </motion.button>
            </div>
            <div className="w-3/4 p-8">
              <h2 className="mb-6 text-3xl font-bold text-teal-700">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
              <form onSubmit={handleSubmit}>
                {activeTab === 'about' && memoizedAboutSection}
                {activeTab === 'education' && memoizedEducationSection}
                {activeTab === 'skills' && memoizedSkillsSection}
                {activeTab === 'experience' && memoizedExperienceSection}
                <motion.button
                  type="submit"
                  className="px-6 py-3 mt-6 text-white transition-colors duration-200 bg-teal-500 rounded-lg shadow-md hover:bg-teal-600"
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
    </ErrorBoundary>
  );
};

const TabButton = React.memo(({ id, label, icon: Icon, isActive, onClick }) => {
  return (
    <motion.button
      className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors duration-200 ${
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
});

const InputField = React.memo(({ label, type = 'text', value, onChange, error, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-teal-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 ${
          error ? 'border-red-500' : 'border-teal-300'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

const TextArea = React.memo(({ label, value, onChange, error, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-teal-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 ${
          error ? 'border-red-500' : 'border-teal-300'
        }`}
        rows="4"
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

const AboutSection = React.memo(({ data, onChange, errors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <InputField label="Full Name" value={data.name} onChange={(value) => onChange('name', value)} error={errors.name} />
      <InputField label="Email" type="email" value={data.email} onChange={(value) => onChange('email', value)} error={errors.email} />
      <InputField label="Phone" type="tel" value={data.phone} onChange={(value) => onChange('phone', value)} error={errors.phone} />
      <InputField label="Location" value={data.location} onChange={(value) => onChange('location', value)} error={errors.location} />
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-teal-700">Profession Category</label>
        <select
          value={data.profession}
          onChange={(e) => onChange('profession', e.target.value)}
          className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 ${
            errors.profession ? 'border-red-500' : 'border-teal-300'
          }`}
        >
          <option value="">Select a category</option>
          {professionCategories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.profession && <p className="mt-1 text-sm text-red-500">{errors.profession}</p>}
      </div>
      <TextArea label="Professional Summary" value={data.summary} onChange={(value) => onChange('summary', value)} error={errors.summary} />
    </motion.div>
  );
});

const DynamicSection = React.memo(({ data, onChange, onAdd, onRemove, renderFields, error, onDragStart, onDragEnter, onDrop, isDragging }) => {
  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      ref={parent}
    >
      {data.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`p-4 mb-6 border border-teal-200 rounded-lg ${isDragging ? 'cursor-move' : ''}`}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragEnter={(e) => onDragEnter(e, index)}
          onDragEnd={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {renderFields(item, index)}
          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="px-3 py-1 text-sm text-red-600 transition-colors duration-200 border border-red-600 rounded hover:bg-red-100"
            >
              <Trash2 size={16} />
            </button>
            <div className="cursor-move">
              &#8942;&#8942;
            </div>
          </div>
        </motion.div>
      ))}
      <motion.button
        type="button"
        onClick={onAdd}
        className="flex items-center px-4 py-2 mt-2 text-teal-600 transition-colors duration-200 border border-teal-600 rounded hover:bg-teal-100"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus size={16} className="mr-2" />
        Add New
      </motion.button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </motion.div>
  );
});

const ResumePreview = React.memo(({ formData, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-teal-700">Resume Preview</h2>
          <button onClick={onClose} className="text-teal-500 transition-colors duration-200 hover:text-teal-700">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-6">
          <PreviewSection title="About" data={formData.about} />
          <PreviewSection title="Education" data={formData.education} />
          <PreviewSection title="Skills" data={formData.skills} />
          <PreviewSection title="Experience" data={formData.experience} />
        </div>
      </motion.div>
    </motion.div>
  );
});

const PreviewSection = React.memo(({ title, data }) => {
  return (
    <section>
      <h3 className="mb-2 text-xl font-semibold text-teal-600">{title}</h3>
      {Array.isArray(data) ? (
        data.map((item, index) => (
          <div key={item.id || index} className="mb-2">
            {typeof item === 'string' ? (
              <p>{item}</p>
            ) : (
              Object.entries(item).map(([key, value]) => (
                key !== 'id' && <p key={key}><strong>{key}:</strong> {value}</p>
              ))
            )}
          </div>
        ))
      ) : (
        Object.entries(data).map(([key, value]) => (
          <p key={key}><strong>{key}:</strong> {value}</p>
        ))
      )}
    </section>
  );
});

function ErrorFallback({error}) {
  return (
    <div role="alert" className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">
      <h2 className="mb-2 text-lg font-semibold">Oops! Something went wrong:</h2>
      <p className="mb-4">{error.message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 text-white transition-colors duration-200 bg-red-500 rounded hover:bg-red-600"
      >
        Reload page
      </button>
    </div>
  )
}

export default ResumeBuilder; 