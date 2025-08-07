import React, { useState, useRef } from 'react';
import { ChevronDown, Download, Edit3, X } from 'lucide-react';
import { 
  ModernTemplate, 
  ClassicTemplate, 
  MinimalTemplate, 
  ExecutiveTemplate, 
  CreativeTemplate 
} from './ResumeTemplates';

const ATSGeneratorPage = ({ extractedData = null }) => {
  // Template configurations
  const templates = {
    modern: {
      name: 'Modern',
      component: ModernTemplate,
      description: 'Clean, contemporary design with blue accents'
    },
    classic: {
      name: 'Classic',
      component: ClassicTemplate,
      description: 'Traditional, professional layout with serif fonts'
    },
    minimal: {
      name: 'Minimal',
      component: MinimalTemplate,
      description: 'Simple, clean design focusing on content'
    },
    executive: {
      name: 'Executive',
      component: ExecutiveTemplate,
      description: 'Premium design for senior-level positions'
    },
    creative: {
      name: 'Creative',
      component: CreativeTemplate,
      description: 'Visual sidebar design for creative fields'
    }
  };

  // State management
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isEditing, setIsEditing] = useState(false);
  const [resumeData, setResumeData] = useState(
    extractedData || {
      personalInfo: {
        fullName: 'Your Name',
        email: 'your.email@example.com',
        phone: '(555) 123-4567',
        location: 'City, State',
        linkedin: 'linkedin.com/in/yourprofile',
        portfolio: 'yourportfolio.com'
      },
      summary: 'Professional summary highlighting your key skills and experience...',
      experience: [
        {
          company: 'Company Name',
          position: 'Job Title',
          duration: 'MM/YYYY - MM/YYYY',
          location: 'City, State',
          achievements: [
            'Achievement or responsibility 1',
            'Achievement or responsibility 2'
          ]
        }
      ],
      education: [
        {
          institution: 'University Name',
          degree: 'Degree Title',
          field: 'Field of Study',
          year: 'YYYY',
          location: 'City, State'
        }
      ],
      skills: [
        { category: 'Technical', items: ['Skill 1', 'Skill 2', 'Skill 3'] },
        { category: 'Software', items: ['Tool 1', 'Tool 2', 'Tool 3'] }
      ],
      projects: [
        {
          name: 'Project Name',
          description: 'Brief description of the project and your role',
          technologies: ['Tech 1', 'Tech 2']
        }
      ],
      certifications: [
        'Certification Name - Issuing Organization (Year)'
      ]
    }
  );

  const resumeRef = useRef(null);

  // Export to PDF function
  const exportToPDF = async () => {
    if (!resumeRef.current) return;

    try {
      // Dynamic import to reduce bundle size
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Update resume data function
  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  // Get current template component
  const TemplateComponent = templates[selectedTemplate].component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ATS Resume Generator</h1>
              <p className="text-gray-600">Create professional, ATS-friendly resumes</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Template Selector */}
              <div className="relative">
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                >
                  {Object.entries(templates).map(([key, template]) => (
                    <option key={key} value={key}>
                      {template.name} - {template.description}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  isEditing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                <span>{isEditing ? 'Done' : 'Edit'}</span>
              </button>

              <button
                onClick={exportToPDF}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div ref={resumeRef}>
            <TemplateComponent 
              data={resumeData} 
              isEditing={isEditing}
              onUpdate={updateResumeData}
            />
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            {templates[selectedTemplate].name} Template
          </h3>
          <p className="text-blue-800">
            {templates[selectedTemplate].description}
          </p>
          <div className="mt-3 text-sm text-blue-700">
            <p><strong>ATS Features:</strong> Clean structure, standard headings, readable fonts, keyword optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSGeneratorPage;
