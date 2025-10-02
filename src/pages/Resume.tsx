import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, BookOpen, Award, Briefcase, Download, X, Plus, Trash2,
  Settings, Eye, Image, Lightbulb
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ErrorBoundary } from 'react-error-boundary';
import { v4 as uuidv4 } from 'uuid';

// Constants
const MAX_NAME_LENGTH = 100;
const MAX_SUMMARY_LENGTH = 500;
const MAX_SKILLS = 20;
const MAX_EXPERIENCES = 10;
const MAX_EDUCATION = 5;

interface ResumeTemplate {
  id: string;
  name: string;
  color: string;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

interface Link {
  id: string;
  title: string;
  url: string;
}

type Achievement = string;

interface FormDataType {
  about: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    profession: string;
    photo: string | null;
    links: Link[];
  };
  education: {
    id: string;
    degree: string;
    institution: string;
    year: string;
    location?: string;
    description: string;
  }[];
  skills: {
    id: string;
    name: string;
    level: string;
  }[];
  experience: {
    id: string;
    title: string;
    company: string;
    period: string;
    current: boolean;
    location: string;
    responsibilities: string;
    achievements: Achievement[];
  }[];
}

interface Errors {
  [key: string]: string;
}

const RESUME_TEMPLATES: ResumeTemplate[] = [
  { id: 'modern', name: 'Modern', color: 'teal' },
  { id: 'professional', name: 'Professional', color: 'blue' },
  { id: 'creative', name: 'Creative', color: 'purple' },
  { id: 'minimal', name: 'Minimal', color: 'gray' },
];

const tabs: Tab[] = [
  { id: 'about', label: 'About', icon: User },
  { id: 'education', label: 'Education', icon: BookOpen },
  { id: 'skills', label: 'Skills', icon: Award },
  { id: 'experience', label: 'Experience', icon: Briefcase },
];

const professionCategories: string[] = [
  'Technology', 'Healthcare', 'Education', 'Finance', 'Arts & Entertainment',
  'Legal', 'Marketing', 'Engineering', 'Hospitality', 'Other'
];

// Utility functions
const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone: string): boolean => /^\+?[\d\s-]{10,14}$/.test(phone);
const sanitizeInput = (input: unknown): string => {
  if (typeof input === 'string') {
    return input.replace(/[<>&'"]/g, (char) => {
      const map: { [key: string]: string } = { '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;', '&': '&amp;' };
      return map[char] ?? char;
    });
  }
  return String(input);
};

const ResumeBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('about');
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(RESUME_TEMPLATES[0]);
  const [formData, setFormData] = useState<FormDataType>({
    about: {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      profession: '',
      photo: null,
      links: []
    },
    education: [{ id: uuidv4(), degree: '', institution: '', year: '', description: '' }],
    skills: [{ id: uuidv4(), name: '', level: 'Intermediate' }],
    experience: [{
      id: uuidv4(),
      title: '',
      company: '',
      period: '',
      current: false,
      location: '',
      responsibilities: '',
      achievements: []
    }]
  });

  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: Errors = {};

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

  const handleInputChange = useCallback(
    (
      section: keyof FormDataType,
      field: string,
      value: unknown,
      index: number = 0
    ): void => {
      const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
      setFormData((prev) => {
        if (Array.isArray(prev[section])) {
          return {
            ...prev,
            [section]: (prev[section] as any[]).map((item, i) =>
              i === index ? { ...item, [field]: sanitizedValue } : item
            )
          };
        }
        return {
          ...prev,
          [section]: { ...(prev[section] as object), [field]: sanitizedValue }
        };
      });
    },
    []
  );

  const updateAboutLinks = useCallback((newLinks: Link[]) => {
    handleInputChange('about', 'links', newLinks);
  }, [handleInputChange]);

  const addItem = useCallback((section: keyof FormDataType): void => {
    setFormData((prev) => {
      if (
        (section === 'education' && prev.education.length >= MAX_EDUCATION) ||
        (section === 'experience' && prev.experience.length >= MAX_EXPERIENCES) ||
        (section === 'skills' && prev.skills.length >= MAX_SKILLS)
      ) {
        return prev;
      }
      let newItem: any;
      switch (section) {
        case 'skills':
          newItem = { id: uuidv4(), name: '', level: 'Intermediate' };
          break;
        case 'education':
          newItem = { id: uuidv4(), degree: '', institution: '', year: '', description: '' };
          break;
        case 'experience':
          newItem = {
            id: uuidv4(),
            title: '',
            company: '',
            period: '',
            current: false,
            location: '',
            responsibilities: '',
            achievements: []
          };
          break;
        default:
          return prev;
      }
      return {
        ...prev,
        [section]: [...(prev[section] as any[]), newItem]
      };
    });
  }, []);

  const addSuggestedSkill = useCallback((skill: string): void => {
    if (formData.skills.length >= MAX_SKILLS) return;
    const newSkill = { id: uuidv4(), name: skill, level: 'Intermediate' };
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  }, [formData.skills.length]);

  const removeItem = useCallback((section: keyof FormDataType, index: number): void => {
    setFormData((prev) => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((_: any, i: number) => i !== index)
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent): void => {
    e.preventDefault();
    if (validateForm()) {
      setShowPreview(true);
    }
  }, [validateForm]);

  const handleDownload = useCallback((): void => {
    try {
      const doc = new jsPDF();
      const { about, education, skills, experience } = formData;
      let yPos = 20;
      const pageMargin = 15;
      const pageWidth = doc.internal.pageSize.getWidth() - 2 * pageMargin;
      const sectionSpacing = 12;
      const itemSpacing = 7;

      // Header & Contact Info
      doc.setFontSize(22).setFont('bold');
      doc.text(about.name, pageMargin, yPos);
      yPos += itemSpacing;
      doc.setFontSize(10).setFont('normal');
      let contactLine = `${about.email} | ${about.phone} | ${about.location}`;
      if (about.profession) contactLine = `${about.profession} | ${contactLine}`;
      doc.text(contactLine, pageMargin, yPos);
      yPos += itemSpacing;
      if (about.links && about.links.length > 0) {
        about.links.forEach(link => {
          if (link.title && link.url) {
            (doc as any).setTextColor(40, 116, 166);
            if (typeof (doc as any).textWithLink === 'function') {
              (doc as any).textWithLink(link.title, pageMargin, yPos, { url: link.url });
            } else {
              doc.text(link.title, pageMargin, yPos);
            }
            (doc as any).setTextColor(0, 0, 0);
            yPos += 5;
          }
        });
      }
      yPos += sectionSpacing / 2;

      // Professional Summary
      if (about.summary) {
        doc.setFontSize(14).setFont('bold');
        doc.text('Professional Summary', pageMargin, yPos);
        yPos += itemSpacing;
        doc.setFontSize(10).setFont('normal');
        const summaryLines = doc.splitTextToSize(about.summary, pageWidth);
        doc.text(summaryLines, pageMargin, yPos);
        yPos += (summaryLines.length as number) * 5 + sectionSpacing;
      }

      // Skills
      if (skills.length > 0) {
        doc.setFontSize(14).setFont('bold');
        doc.text('Skills', pageMargin, yPos);
        yPos += itemSpacing;
        doc.setFontSize(10).setFont('normal');
        const skillText = skills.map(s => `${s.name} (${s.level})`).join('  •  ');
        const skillLines = doc.splitTextToSize(skillText, pageWidth);
        doc.text(skillLines, pageMargin, yPos);
        yPos += (skillLines.length as number) * 5 + sectionSpacing;
      }

      // Experience
      if (experience.length > 0) {
        doc.setFontSize(14).setFont('bold');
        doc.text('Experience', pageMargin, yPos);
        yPos += itemSpacing;
        doc.setFontSize(10).setFont('normal');
        experience.forEach(exp => {
          if (yPos > doc.internal.pageSize.getHeight() - 30) {
            doc.addPage();
            yPos = pageMargin;
          }
          doc.setFontSize(11).setFont('bold');
          doc.text(exp.title, pageMargin, yPos);
          doc.setFontSize(10).setFont('normal');
          doc.text(`${exp.company} | ${exp.period} | ${exp.location}`, pageMargin, yPos + 5);
          yPos += 10;
          const respLines = doc.splitTextToSize(exp.responsibilities, pageWidth - 5);
          doc.text(respLines, pageMargin + 5, yPos);
          yPos += respLines.length * 5 + 2;
          if (exp.achievements && exp.achievements.length > 0) {
            doc.setFontSize(10).setFont('italic');
            exp.achievements.forEach(ach => {
              if (yPos > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); yPos = pageMargin; }
              const achLines = doc.splitTextToSize(`• ${ach}`, pageWidth - 10);
              doc.text(achLines, pageMargin + 10, yPos);
              yPos += achLines.length * 5;
            });
          }
          yPos += itemSpacing;
        });
        yPos += sectionSpacing / 2;
      }

      // Education
      if (education.length > 0) {
        doc.setFontSize(14).setFont('bold');
        doc.text('Education', pageMargin, yPos);
        yPos += itemSpacing;
        doc.setFontSize(10).setFont('normal');
        education.forEach(edu => {
          if (yPos > doc.internal.pageSize.getHeight() - 30) { doc.addPage(); yPos = pageMargin; }
          doc.setFontSize(11).setFont('bold');
          doc.text(edu.degree, pageMargin, yPos);
          doc.setFontSize(10).setFont('normal');
          doc.text(`${edu.institution} | ${edu.year}`, pageMargin, yPos + 5);
          yPos += 10;
          if (edu.description) {
            const descLines = doc.splitTextToSize(edu.description, pageWidth - 5);
            doc.text(descLines, pageMargin + 5, yPos);
            yPos += descLines.length * 5;
          }
          yPos += itemSpacing;
        });
      }

      doc.save('resume.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert('Failed to generate PDF. Please try again. Error: ' + errorMessage);
    }
  }, [formData]);

  const aboutHandlers = useMemo(() => ({
    onChange: (field: string, value: string | Link[] | null) => handleInputChange('about', field, value),
    onUpdateLinks: updateAboutLinks
  }), [handleInputChange, updateAboutLinks]);

  const memoizedAboutSection = useMemo(() => (
    <AboutSection
      data={formData.about}
      handlers={aboutHandlers}
      errors={errors}
    />
  ), [formData.about, aboutHandlers, errors]);

  const memoizedEducationSection = useMemo(() => (
    <EducationSection
      data={formData.education}
      onChange={(field, value, index) => handleInputChange('education', field, value, index)}
      onAdd={() => addItem('education')}
      onRemove={(index) => removeItem('education', index)}
      errors={errors}
    />
  ), [formData.education, handleInputChange, addItem, removeItem, errors]);

  const memoizedSkillsSection = useMemo(() => (
    <SkillsSection
      data={formData.skills}
      onChange={(field, value, index) => handleInputChange('skills', field, value, index)}
      onAdd={() => addItem('skills')}
      onAddSuggested={addSuggestedSkill}
      onRemove={(index) => removeItem('skills', index)}
      errors={errors}
    />
  ), [formData.skills, handleInputChange, addItem, addSuggestedSkill, removeItem, errors]);

  const memoizedExperienceSection = useMemo(() => (
    <ExperienceSection
      data={formData.experience}
      onChange={(field, value, index) => handleInputChange('experience', field, value, index)}
      onAdd={() => addItem('experience')}
      onRemove={(index) => removeItem('experience', index)}
      errors={errors}
    />
  ), [formData.experience, handleInputChange, addItem, removeItem, errors]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="p-6 min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 sm:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-teal-500 lg:text-5xl">
              Professional Resume Builder
            </h1>
            <p className="mt-3 text-gray-600 md:text-lg">
              Create a stunning resume that stands out and gets you hired
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Sidebar */}
            <motion.div
              className="space-y-6 lg:col-span-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Template Selection */}
              <div className="p-6 bg-white rounded-xl border shadow-md backdrop-blur-sm border-stone-200/70">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Choose Template</h3>
                <div className="grid grid-cols-2 gap-3">
                  {RESUME_TEMPLATES.map((template) => (
                    <motion.button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 text-sm rounded-lg border-2 transition-all duration-200 ${selectedTemplate.id === template.id
                        ? `border-${template.color}-500 bg-${template.color}-50 text-${template.color}-700`
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {template.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Navigation */} 
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <TabButton
                    key={tab.id}
                    {...tab}
                    isActive={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  />
                ))}
              </nav>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={() => setShowPreview(true)}
                  className="flex justify-center items-center p-3 w-full text-white bg-gradient-to-r from-teal-600 to-teal-500 rounded-lg shadow-md transition-all duration-200 hover:from-teal-700 hover:to-teal-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye className="mr-2 w-5 h-5" />
                  Preview Resume
                </motion.button>

                <motion.button
                  onClick={handleDownload}
                  className="flex justify-center items-center p-3 w-full text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="mr-2 w-5 h-5" />
                  Download PDF
                </motion.button>

                <motion.button
                  onClick={() => { }}
                  className="flex justify-center items-center p-3 w-full text-gray-700 bg-white rounded-lg border border-gray-200 shadow-md transition-all duration-200 hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Settings className="mr-2 w-5 h-5" />
                  Settings
                </motion.button>
              </div>
            </motion.div>

            {/* Main Form Area */}
            <motion.div
              className="lg:col-span-9"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="p-8 bg-white rounded-xl border shadow-md backdrop-blur-sm border-stone-200/70">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {activeTab === 'about' && memoizedAboutSection}
                  {activeTab === 'education' && memoizedEducationSection}
                  {activeTab === 'skills' && memoizedSkillsSection}
                  {activeTab === 'experience' && memoizedExperienceSection}
                </form>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Preview Modal */}
        <AnimatePresence>
          {showPreview && (
            <ResumePreview
              formData={formData}
              template={selectedTemplate}
              onClose={() => setShowPreview(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
};

const TabButton: React.FC<Tab & { isActive: boolean; onClick: () => void }> = React.memo(({ label, icon: Icon, isActive, onClick }) => (
  <motion.button
    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${isActive
      ? 'text-white bg-gradient-to-r from-teal-600 to-teal-500 shadow-md'
      : 'text-gray-700 hover:bg-teal-50'
      }`}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Icon className="mr-2" size={20} />
    {label}
  </motion.button>
));

interface InputFieldProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = React.memo(({ label, type = 'text', value, onChange, error, placeholder, className = '', ...props }) => (
  <div className="mb-4">
    {label && <label className="block mb-1.5 text-sm font-medium text-gray-700">{label}</label>}
    <motion.input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full p-2.5 bg-white rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${className} ${error ? 'border-red-300' : 'border-stone-200'
        }`}
      whileFocus={{ scale: 1.01 }}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
));

interface AboutHandlers {
  onChange: (field: string, value: string | Link[] | null) => void;
  onUpdateLinks: (links: Link[]) => void;
}

interface AboutSectionProps {
  data: FormDataType['about'];
  handlers: AboutHandlers;
  errors: Errors;
}

const AboutSection: React.FC<AboutSectionProps> = React.memo(({ data, handlers, errors }) => {
  const { onChange, onUpdateLinks } = handlers;
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const handleAddLink = useCallback(() => {
    onUpdateLinks([...(data.links || []), { id: uuidv4(), title: '', url: '' }]);
  }, [data.links, onUpdateLinks]);

  const handleRemoveLink = useCallback((id: string) => {
    onUpdateLinks(data.links.filter(link => link.id !== id));
  }, [data.links, onUpdateLinks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Photo Upload */}
      <div className="flex items-start space-x-6">
        <div className="flex-shrink-0">
          <div className="relative w-32 h-32">
            {data.photo ? (
              <img
                src={data.photo}
                alt="Profile"
                className="object-cover w-full h-full rounded-lg"
              />
            ) : (
              <div className="flex justify-center items-center w-full h-full text-gray-400 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed">
                <Image className="w-8 h-8" />
              </div>
            )}
            <button
              type="button"
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="absolute right-2 bottom-2 p-1.5 text-gray-700 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
            </button>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex-grow space-y-4">
          <InputField
            label="Full Name"
            value={data.name}
            onChange={(value) => onChange('name', value)}
            error={errors.name}
            placeholder="John Doe"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Email"
              type="email"
              value={data.email}
              onChange={(value) => onChange('email', value)}
              error={errors.email}
              placeholder="john@example.com"
            />
            <InputField
              label="Phone"
              type="tel"
              value={data.phone}
              onChange={(value) => onChange('phone', value)}
              error={errors.phone}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Location"
          value={data.location}
          onChange={(value) => onChange('location', value)}
          error={errors.location}
          placeholder="City, Country"
        />
        <div>
          <label className="block mb-1.5 text-sm font-medium text-gray-700">Profession Category</label>
          <select
            value={data.profession}
            onChange={(e) => onChange('profession', e.target.value)}
            className={`w-full p-2.5 bg-white rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.profession ? 'border-red-300' : 'border-stone-200'
              }`}
          >
            <option value="">Select a category</option>
            {professionCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.profession && <p className="mt-1 text-sm text-red-500">{errors.profession}</p>}
        </div>
      </div>

      <div>
        <label className="block mb-1.5 text-sm font-medium text-gray-700">Professional Summary</label>
        <textarea
          value={data.summary}
          onChange={(e) => onChange('summary', e.target.value)}
          rows={4}
          className={`w-full p-2.5 bg-white rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.summary ? 'border-red-300' : 'border-stone-200'
            }`}
          placeholder="Write a compelling summary of your professional background and goals..."
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            {data.summary.length}/{MAX_SUMMARY_LENGTH} characters
          </p>
          {errors.summary && <p className="text-sm text-red-500">{errors.summary}</p>}
        </div>
      </div>

      {/* Social Links */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-gray-700">Social Links & Portfolio</label>
          <button
            type="button"
            onClick={handleAddLink}
            className="flex items-center px-2 py-1 text-sm text-teal-600 rounded hover:bg-teal-50"
          >
            <Plus className="mr-1 w-4 h-4" /> Add Link
          </button>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {data.links?.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex space-x-3"
              >
                <InputField
                  value={link.title}
                  onChange={(value) => {
                    const newLinks = [...data.links];
                    newLinks[index].title = value;
                    onUpdateLinks(newLinks);
                  }}
                  placeholder="Title (e.g., LinkedIn, Portfolio)"
                  className="flex-1"
                />
                <InputField
                  value={link.url}
                  onChange={(value) => {
                    const newLinks = [...data.links];
                    newLinks[index].url = value;
                    onUpdateLinks(newLinks);
                  }}
                  placeholder="URL"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveLink(link.id)}
                  className="self-start p-2 text-red-500 rounded hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
});

interface SectionProps<T> {
  data: T;
  onChange: (field: string, value: unknown, index: number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  errors: Errors;
}

const EducationSection: React.FC<SectionProps<FormDataType['education']>> = React.memo(({ data, onChange, onAdd, onRemove, errors }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-6"
  >
    <AnimatePresence>
      {data.map((edu, index) => (
        <motion.div
          key={edu.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="p-6 bg-white rounded-xl border-2 transition-all duration-200 border-stone-200 hover:border-teal-200"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-gray-800">Education #{index + 1}</h3>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="p-1 text-red-500 rounded hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              label="Degree/Certificate"
              value={edu.degree}
              onChange={(value) => onChange('degree', value, index)}
              error={errors[`education_${index}_degree`]}
              placeholder="Bachelor of Science in Computer Science"
            />
            <InputField
              label="Institution"
              value={edu.institution}
              onChange={(value) => onChange('institution', value, index)}
              error={errors[`education_${index}_institution`]}
              placeholder="University Name"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
            <InputField
              label="Year"
              type="text"
              value={edu.year}
              onChange={(value) => onChange('year', value, index)}
              error={errors[`education_${index}_year`]}
              placeholder="2020 - 2024"
            />
            <InputField
              label="Location (Optional)"
              value={edu.location || ''}
              onChange={(value) => onChange('location', value, index)}
              placeholder="City, Country"
            />
          </div>

          <div className="mt-4">
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              value={edu.description || ''}
              onChange={(e) => onChange('description', e.target.value, index)}
              rows={3}
              className="p-2.5 w-full bg-white rounded-lg border-2 transition-all duration-200 border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Notable achievements, activities, or relevant coursework..."
            />
          </div>
        </motion.div>
      ))}
    </AnimatePresence>

    {data.length < MAX_EDUCATION && (
      <motion.button
        type="button"
        onClick={onAdd}
        className="flex justify-center items-center p-4 w-full text-teal-600 bg-teal-50 rounded-xl border-2 border-teal-200 border-dashed transition-all duration-200 hover:bg-teal-100/50"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Plus className="mr-2 w-5 h-5" />
        Add Education
      </motion.button>
    )}
  </motion.div>
));

interface SkillsSectionProps extends SectionProps<FormDataType['skills']> {
  onAddSuggested: (skill: string) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = React.memo(({ data, onChange, onAdd, onAddSuggested, onRemove, errors }) => {
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
  const skillCategories = [
    'Programming Languages',
    'Frameworks & Libraries',
    'Tools & Technologies',
    'Soft Skills',
    'Languages',
    'Other'
  ] as const;

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const suggestedSkills = {
    'Programming Languages': ['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'PHP'],
    'Frameworks & Libraries': ['React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask'],
    'Tools & Technologies': ['Git', 'Docker', 'AWS', 'Linux', 'SQL', 'MongoDB'],
    'Soft Skills': ['Communication', 'Leadership', 'Problem Solving', 'Teamwork'],
    'Languages': ['English', 'Spanish', 'French', 'German', 'Mandarin'],
    'Other': []
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {data.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative p-4 bg-white rounded-xl border-2 transition-all duration-200 group border-stone-200 hover:border-teal-200"
            >
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-1 text-red-500 rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </button>

              <InputField
                value={skill.name}
                onChange={(value) => onChange('name', value, index)}
                error={errors[`skill_${index}`]}
                placeholder="Skill name"
                className="mb-2"
              />

              <select
                value={skill.level}
                onChange={(e) => onChange('level', e.target.value, index)}
                className="p-2 w-full text-sm bg-gray-50 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {data.length < MAX_SKILLS && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 p-2.5 text-sm bg-white rounded-lg border-2 border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select a skill category</option>
              {skillCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <motion.button
              type="button"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="p-2.5 text-teal-600 bg-teal-50 rounded-lg transition-colors duration-200 hover:bg-teal-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Lightbulb className="w-5 h-5" />
            </motion.button>
          </div>

          <AnimatePresence>
            {showSuggestions && selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-white rounded-xl border border-stone-200"
              >
                <h4 className="mb-3 text-sm font-medium text-gray-700">Suggested {selectedCategory}</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills[selectedCategory as keyof typeof suggestedSkills]?.map(skill => (
                    <motion.button
                      key={skill}
                      type="button"
                      onClick={() => onAddSuggested(skill)}
                      className="px-3 py-1.5 text-sm text-teal-600 bg-teal-50 rounded-lg transition-colors duration-200 hover:bg-teal-100"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {skill}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={onAdd}
            className="flex justify-center items-center p-4 w-full text-teal-600 bg-teal-50 rounded-xl border-2 border-teal-200 border-dashed transition-all duration-200 hover:bg-teal-100/50"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Plus className="mr-2 w-5 h-5" />
            Add Skill
          </motion.button>
        </div>
      )}
    </motion.div>
  );
});

const ExperienceSection: React.FC<SectionProps<FormDataType['experience']>> = React.memo(({ data, onChange, onAdd, onRemove, errors }) => {
  const handleAddAchievement = useCallback((index: number) => {
    const achievements = [...(data[index].achievements || []), ''];
    onChange('achievements', achievements, index);
  }, [data, onChange]);

  const handleUpdateAchievement = useCallback((expIndex: number, achievementIndex: number, value: string) => {
    const achievements = [...(data[expIndex].achievements || [])];
    achievements[achievementIndex] = value;
    onChange('achievements', achievements, expIndex);
  }, [data, onChange]);

  const handleRemoveAchievement = useCallback((expIndex: number, achievementIndex: number) => {
    const achievements = [...(data[expIndex].achievements || [])];
    achievements.splice(achievementIndex, 1);
    onChange('achievements', achievements, expIndex);
  }, [data, onChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {data.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-white rounded-xl border-2 transition-all duration-200 border-stone-200 hover:border-teal-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-800">Experience #{index + 1}</h3>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-1 text-red-500 rounded hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Job Title"
                value={exp.title}
                onChange={(value) => onChange('title', value, index)}
                error={errors[`experience_${index}_title`]}
                placeholder="Senior Software Engineer"
              />
              <InputField
                label="Company"
                value={exp.company}
                onChange={(value) => onChange('company', value, index)}
                error={errors[`experience_${index}_company`]}
                placeholder="Company Name"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
              <div className="sm:col-span-2 md:col-span-1">
                <InputField
                  label="Period"
                  value={exp.period}
                  onChange={(value) => onChange('period', value, index)}
                  error={errors[`experience_${index}_period`]}
                  placeholder="Jan 2020 - Present"
                />
                <div className="mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => onChange('current', e.target.checked, index)}
                      className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-600">I currently work here</span>
                  </label>
                </div>
              </div>
              <InputField
                label="Location"
                value={exp.location}
                onChange={(value) => onChange('location', value, index)}
                placeholder="City, Country"
              />
            </div>

            <div className="mt-4">
              <label className="block mb-1.5 text-sm font-medium text-gray-700">
                Job Description
              </label>
              <textarea
                value={exp.responsibilities}
                onChange={(e) => onChange('responsibilities', e.target.value, index)}
                rows={3}
                className="p-2.5 w-full bg-white rounded-lg border-2 transition-all duration-200 border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Describe your role, responsibilities, and key contributions..."
              />
            </div>

            {/* Key Achievements */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Key Achievements</label>
                <button
                  type="button"
                  onClick={() => handleAddAchievement(index)}
                  className="flex items-center px-2 py-1 text-sm text-teal-600 rounded hover:bg-teal-50"
                >
                  <Plus className="mr-1 w-4 h-4" /> Add Achievement
                </button>
              </div>
              <AnimatePresence>
                {exp.achievements?.map((achievement, achievementIndex) => (
                  <motion.div
                    key={achievementIndex}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleUpdateAchievement(index, achievementIndex, e.target.value)}
                      className="flex-1 p-2 text-sm bg-white rounded-lg border-2 border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Describe a specific achievement or accomplishment"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(index, achievementIndex)}
                      className="p-1 text-red-500 rounded hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {data.length < MAX_EXPERIENCES && (
        <motion.button
          type="button"
          onClick={onAdd}
          className="flex justify-center items-center p-4 w-full text-teal-600 bg-teal-50 rounded-xl border-2 border-teal-200 border-dashed transition-all duration-200 hover:bg-teal-100/50"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Plus className="mr-2 w-5 h-5" />
          Add Experience
        </motion.button>
      )}
    </motion.div>
  );
});

interface ResumePreviewProps {
  formData: FormDataType;
  template: ResumeTemplate;
  onClose: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = React.memo(({ formData, template, onClose }) => {
  const [activeSection, setActiveSection] = useState<'all' | 'about' | 'education' | 'skills' | 'experience'>('all');
  const sections = ['all', 'about', 'education', 'skills', 'experience'] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Resume Preview</h2>
            <p className="text-sm text-gray-500">Preview how your resume will look</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 rounded-full transition-colors hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex overflow-x-auto p-4 space-x-2 bg-gray-50 border-b">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeSection === section
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-gray-600 hover:bg-white/50'
                }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
          <div className={`space-y-8 ${template.id === 'modern' ? 'font-sans' : 'font-serif'}`}>
            {/* About Section */}
            {(activeSection === 'all' || activeSection === 'about') && (
              <div className="space-y-4">
                <div className="flex items-center space-x-6">
                  {formData.about.photo && (
                    <img
                      src={formData.about.photo}
                      alt={formData.about.name}
                      className="object-cover w-24 h-24 rounded-full"
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{formData.about.name}</h1>
                    <p className="text-lg text-gray-600">{formData.about.profession}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">📧 {formData.about.email}</p>
                    <p className="text-gray-600">📱 {formData.about.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">📍 {formData.about.location}</p>
                    {formData.about.links?.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-teal-600 hover:underline"
                      >
                        🔗 {link.title}
                      </a>
                    ))}
                  </div>
                </div>
                {formData.about.summary && <p className="text-gray-700">{formData.about.summary}</p>}
              </div>
            )}

            {/* Skills Section */}
            {(activeSection === 'all' || activeSection === 'skills') && formData.skills.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900">Skills</h2>
                <div className="grid grid-cols-2 gap-4">
                  {formData.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span className="font-medium text-gray-700">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {(activeSection === 'all' || activeSection === 'education') && formData.education.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900">Education</h2>
                <div className="space-y-4">
                  {formData.education.map((edu) => (
                    <div key={edu.id} className="pl-4 border-l-2 border-teal-500">
                      <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                      {edu.description && (
                        <p className="mt-2 text-sm text-gray-600">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {(activeSection === 'all' || activeSection === 'experience') && formData.experience.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold text-gray-900">Experience</h2>
                <div className="space-y-6">
                  {formData.experience.map((exp) => (
                    <div key={exp.id} className="pl-4 border-l-2 border-teal-500">
                      <h3 className="font-bold text-gray-800">{exp.title}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {exp.period} • {exp.location}
                      </p>
                      {exp.responsibilities && <p className="mt-2 text-gray-700">{exp.responsibilities}</p>}
                      {exp.achievements?.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="text-sm text-gray-600">
                              • {achievement}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 rounded-lg transition-colors hover:bg-gray-100"
          >
            Close Preview
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
});

const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div role="alert" className="p-4 text-red-700 bg-red-100 rounded border border-red-400">
    <h2 className="mb-2 text-lg font-semibold">Oops! Something went wrong:</h2>
    <pre className="mb-4 text-sm whitespace-pre-wrap">{error.message}</pre>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 text-white bg-red-500 rounded transition-colors duration-200 hover:bg-red-600"
    >
      Reload page
    </button>
  </div>
);

export default ResumeBuilder;