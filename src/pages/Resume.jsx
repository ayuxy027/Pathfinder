import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BookOpen, Award, Briefcase, Download, X } from 'lucide-react';

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

// Custom ID generation function
const generateId = (() => {
  let counter = 0;
  return () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${randomStr}-${counter++}`;
  };
})();

const SimpleResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [formData, setFormData] = useState({
    about: { name: '', email: '', phone: '', location: '', summary: '', profession: '' },
    education: [{ id: generateId(), degree: '', institution: '', year: '' }],
    skills: [{ id: generateId(), name: '' }],
    experience: [{ id: generateId(), title: '', company: '', period: '', responsibilities: '' }]
  });
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

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
      if (!edu.year || isNaN(Number(edu.year))) newErrors[`education_${index}_year`] = 'Valid year is required';
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
          section === 'skills' ? { id: generateId(), name: '' } : 
          section === 'education' ? { id: generateId(), degree: '', institution: '', year: '' } : 
          { id: generateId(), title: '', company: '', period: '', responsibilities: '' }
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
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window');
      }

      const resumeContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume - ${formData.about.name}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            h1, h2 { color: #2c3e50; }
            .section { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>${formData.about.name}</h1>
          <p>Email: ${formData.about.email} | Phone: ${formData.about.phone} | Location: ${formData.about.location}</p>
          <p>Profession: ${formData.about.profession}</p>
          
          <div class="section">
            <h2>Professional Summary</h2>
            <p>${formData.about.summary}</p>
          </div>
          
          <div class="section">
            <h2>Education</h2>
            ${formData.education.map(edu => `
              <p>${edu.degree} - ${edu.institution} (${edu.year})</p>
            `).join('')}
          </div>
          
          <div class="section">
            <h2>Skills</h2>
            <p>${formData.skills.map(skill => skill.name).join(', ')}</p>
          </div>
          
          <div class="section">
            <h2>Experience</h2>
            ${formData.experience.map(exp => `
              <h3>${exp.title} at ${exp.company}</h3>
              <p>Period: ${exp.period}</p>
              <p>Responsibilities: ${exp.responsibilities}</p>
            `).join('')}
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(resumeContent);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }, [formData]);

  const TabButton = React.memo(({ id, label, icon: Icon, isActive, onClick }) => {
    return (
      <motion.button
        className={`flex items-center w-full p-3 mb-2 rounded-lg ${
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
          className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
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
          className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            error ? 'border-red-500' : 'border-teal-300'
          }`}
          rows={4}
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
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
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

  const DynamicSection = React.memo(({ data, onChange, onAdd, onRemove, renderFields, error }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {data.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4 mb-6 border border-teal-200 rounded-lg"
          >
            {renderFields(item, index)}
            <motion.button
              type="button"
              onClick={() => onRemove(index)}
              className="px-3 py-1 mt-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Remove
            </motion.button>
          </motion.div>
        ))}
        <motion.button
          type="button"
          onClick={onAdd}
          className="px-4 py-2 mt-2 text-teal-600 border border-teal-600 rounded hover:bg-teal-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
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
            <button onClick={onClose} className="text-teal-500 hover:text-teal-700">
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
              {Object.entries(item).map(([key, value]) => (
                key !== 'id' && <p key={key}><strong>{key}:</strong> {value}</p>
              ))}
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

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
        <div className="flex">
          <div className="w-1/4 p-6 bg-teal-50">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                {...tab}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
            <motion.button
              onClick={handleDownload}
              className="flex items-center w-full p-3 mt-4 text-white bg-teal-500 rounded-lg hover:bg-teal-600"
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
              {activeTab === 'about' && (
                <AboutSection
                  data={formData.about}
                  onChange={(field, value) => handleInputChange('about', field, value)}
                  errors={errors}
                />
              )}
              {activeTab === 'education' && (
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
                />
              )}
              {activeTab === 'skills' && (
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
                />
              )}
              {activeTab === 'experience' && (
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
                />
              )}
              <motion.button
                type="submit"
                className="px-6 py-3 mt-6 text-white bg-teal-500 rounded-lg shadow-md hover:bg-teal-600"
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
};

export default SimpleResumeBuilder;