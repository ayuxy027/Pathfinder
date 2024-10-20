import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, Award, Briefcase, Download } from 'lucide-react';
import jsPDF from 'jspdf';

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

export default function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState('about');
  const [formData, setFormData] = useState({
    about: { name: '', email: '', phone: '', location: '', summary: '', profession: '' },
    education: [{ degree: '', institution: '', year: '' }],
    skills: [],
    experience: [{ title: '', company: '', period: '', responsibilities: '' }]
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (section, field, value, index = 0) => {
    setFormData(prev => ({
      ...prev,
      [section]: Array.isArray(prev[section])
        ? prev[section].map((item, i) => i === index ? { ...item, [field]: value } : item)
        : { ...prev[section], [field]: value }
    }));
  };

  const addItem = (section) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], section === 'skills' ? '' : {}]
    }));
  };

  const removeItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text(JSON.stringify(formData, null, 2), 10, 10);
    doc.save('resume.pdf');
  };

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
                      <InputField label="Degree" value={item.degree} onChange={(value) => handleInputChange('education', 'degree', value, index)} />
                      <InputField label="Institution" value={item.institution} onChange={(value) => handleInputChange('education', 'institution', value, index)} />
                      <InputField label="Year" type="number" value={item.year} onChange={(value) => handleInputChange('education', 'year', value, index)} />
                    </>
                  )}
                />
              )}
              {activeTab === 'skills' && (
                <DynamicSection
                  data={formData.skills}
                  onChange={(value, index) => handleInputChange('skills', index, value)}
                  onAdd={() => addItem('skills')}
                  onRemove={(index) => removeItem('skills', index)}
                  renderFields={(item, index) => (
                    <InputField label={`Skill ${index + 1}`} value={item} onChange={(value) => handleInputChange('skills', index, value)} />
                  )}
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
                      <InputField label="Job Title" value={item.title} onChange={(value) => handleInputChange('experience', 'title', value, index)} />
                      <InputField label="Company" value={item.company} onChange={(value) => handleInputChange('experience', 'company', value, index)} />
                      <InputField label="Period" value={item.period} onChange={(value) => handleInputChange('experience', 'period', value, index)} />
                      <TextArea label="Responsibilities" value={item.responsibilities} onChange={(value) => handleInputChange('experience', 'responsibilities', value, index)} />
                    </>
                  )}
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
      {showPreview && (
        <ResumePreview formData={formData} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

function TabButton({ id, label, icon: Icon, isActive, onClick }) {
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
}

function InputField({ label, type = 'text', value, onChange, ...props }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-teal-700">{label}</label>
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
      <label className="block mb-1 text-sm font-medium text-teal-700">{label}</label>
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
      <InputField label="Full Name" value={data.name} onChange={(value) => onChange('name', value)} />
      <InputField label="Email" type="email" value={data.email} onChange={(value) => onChange('email', value)} />
      <InputField label="Phone" type="tel" value={data.phone} onChange={(value) => onChange('phone', value)} />
      <InputField label="Location" value={data.location} onChange={(value) => onChange('location', value)} />
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-teal-700">Profession Category</label>
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
      <TextArea label="Professional Summary" value={data.summary} onChange={(value) => onChange('summary', value)} />
    </motion.div>
  );
}

function DynamicSection({ data, onChange, onAdd, onRemove, renderFields }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {data.map((item, index) => (
        <div key={index} className="p-4 mb-6 border border-teal-200 rounded-lg">
          {renderFields(item, index)}
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="px-3 py-1 mt-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-100"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="px-4 py-2 mt-2 text-teal-600 border border-teal-600 rounded hover:bg-teal-100"
      >
        Add New
      </button>
    </motion.div>
  );
}

function ResumePreview({ formData, onClose }) {
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
            &times;
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
}

function PreviewSection({ title, data }) {
  return (
    <section>
      <h3 className="mb-2 text-xl font-semibold text-teal-600">{title}</h3>
      {Array.isArray(data) ? (
        data.map((item, index) => (
          <div key={index} className="mb-2">
            {Object.entries(item).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
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
}