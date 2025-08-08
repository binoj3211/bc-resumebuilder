import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Eye, Star, Heart, Award } from 'lucide-react';

// Import actual templates
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import ExecutiveTemplate from '../templates/ExecutiveTemplate';
import ModernTemplateNew from '../templates/ModernTemplate_New';

const ResumeTemplateGallery = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample resume data for preview
  const sampleResumeData = {
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.com'
    },
    summary: 'Experienced professional with 5+ years in software development and project management. Proven track record of delivering high-quality solutions and leading cross-functional teams.',
    experience: [
      {
        id: 1,
        jobTitle: 'Senior Software Developer',
        company: 'Tech Solutions Inc.',
        location: 'New York, NY',
        startDate: '2021-01',
        endDate: '2024-01',
        current: false,
        description: 'Led development of web applications using React and Node.js. Managed a team of 5 developers and delivered 15+ successful projects.',
        responsibilities: ['Led development team', 'Architected scalable solutions', 'Mentored junior developers']
      },
      {
        id: 2,
        jobTitle: 'Software Developer',
        company: 'StartupXYZ',
        location: 'Boston, MA',
        startDate: '2019-06',
        endDate: '2021-01',
        current: false,
        description: 'Developed full-stack applications and collaborated with product teams to deliver user-focused solutions.',
        responsibilities: ['Full-stack development', 'Product collaboration', 'Code reviews']
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Massachusetts Institute of Technology',
        location: 'Cambridge, MA',
        graduationDate: '2019-05',
        gpa: '3.8'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'Git'],
    projects: [
      {
        id: 1,
        title: 'E-commerce Platform',
        description: 'Built a scalable e-commerce platform handling 10k+ daily users',
        technologies: ['React', 'Node.js', 'MongoDB'],
        link: 'github.com/johndoe/ecommerce'
      }
    ],
    certifications: [
      {
        id: 1,
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: '2023-01'
      }
    ]
  };

  const templates = [
    {
      id: 'modern',
      name: 'Modern Template',
      category: 'modern',
      component: ModernTemplate,
      description: 'Clean and modern design with blue accents',
      features: ['ATS-Friendly', 'Single Column', 'Modern Typography'],
      popular: true
    },
    {
      id: 'modern-new',
      name: 'Modern Enhanced',
      category: 'modern',
      component: ModernTemplateNew,
      description: 'Enhanced modern design with improved layout',
      features: ['Enhanced Layout', 'Professional', 'Clean Design'],
      popular: true
    },
    {
      id: 'classic',
      name: 'Classic Professional',
      category: 'classic',
      component: ClassicTemplate,
      description: 'Traditional layout perfect for corporate roles',
      features: ['Traditional Layout', 'Professional', 'Conservative'],
      popular: false
    },
    {
      id: 'creative',
      name: 'Creative Designer',
      category: 'creative',
      component: CreativeTemplate,
      description: 'Eye-catching design for creative professionals',
      features: ['Creative Layout', 'Visual Appeal', 'Portfolio Ready'],
      popular: true
    },
    {
      id: 'executive',
      name: 'Executive Premium',
      category: 'executive',
      component: ExecutiveTemplate,
      description: 'Premium design for executive positions',
      features: ['Executive Level', 'Premium Look', 'Leadership Focus'],
      popular: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'modern', name: 'Modern', count: templates.filter(t => t.category === 'modern').length },
    { id: 'classic', name: 'Classic', count: templates.filter(t => t.category === 'classic').length },
    { id: 'creative', name: 'Creative', count: templates.filter(t => t.category === 'creative').length },
    { id: 'executive', name: 'Executive', count: templates.filter(t => t.category === 'executive').length }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const handleUseTemplate = (templateId) => {
    // Navigate to resume builder with selected template
    navigate('/build', { state: { templateId } });
  };

  const handlePreviewTemplate = (templateId) => {
    // Navigate to preview page
    navigate('/preview', { state: { templateId } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resume Templates</h1>
              <p className="text-gray-600 mt-2">Choose from our collection of professional, ATS-friendly templates</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{templates.length}+</div>
            <div className="text-gray-600">Free Templates</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">100%</div>
            <div className="text-gray-600">ATS-Friendly</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">0$</div>
            <div className="text-gray-600">Always Free</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">10k+</div>
            <div className="text-gray-600">Downloads</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const TemplateComponent = template.component;
            return (
              <div key={template.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {/* Template Preview */}
                <div className="relative aspect-[3/4] bg-white rounded-t-lg overflow-hidden border">
                  <div className="absolute inset-0 scale-[0.4] origin-top-left overflow-hidden">
                    <div className="w-[250%] h-[250%] bg-white">
                      <TemplateComponent resumeData={sampleResumeData} />
                    </div>
                  </div>
                  
                  {/* Popular Badge */}
                  {template.popular && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      Popular
                    </div>
                  )}

                  {/* Action Buttons Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePreviewTemplate(template.id)}
                      className="bg-white text-gray-900 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-1"
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                    <button
                      onClick={() => handleUseTemplate(template.id)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.features.map((feature, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreviewTemplate(template.id)}
                      className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye size={14} />
                      Preview
                    </button>
                    <button
                      onClick={() => handleUseTemplate(template.id)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Can't find the perfect template?</h3>
          <p className="text-blue-100 mb-6">
            We're constantly adding new templates. Follow us for updates or request a custom template.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg transition-colors">
              Request Template
            </button>
            <button className="border border-blue-300 text-white hover:bg-white/10 font-medium px-6 py-3 rounded-lg transition-colors">
              Follow Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplateGallery;
