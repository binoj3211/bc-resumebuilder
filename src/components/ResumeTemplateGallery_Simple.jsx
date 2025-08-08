import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Users, Crown } from 'lucide-react';

const ResumeTemplateGallery = () => {
  const navigate = useNavigate();

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean and contemporary design with subtle colors',
      category: 'professional',
      rating: 4.8,
      users: '15k+',
      isPremium: false,
      preview: '/api/placeholder/400/500'
    },
    {
      id: 'classic',
      name: 'Classic Traditional',
      description: 'Timeless black and white layout',
      category: 'professional',
      rating: 4.7,
      users: '12k+',
      isPremium: false,
      preview: '/api/placeholder/400/500'
    },
    {
      id: 'creative',
      name: 'Creative Minimal',
      description: 'Bold design with creative elements',
      category: 'creative',
      rating: 4.9,
      users: '8k+',
      isPremium: false,
      preview: '/api/placeholder/400/500'
    },
    {
      id: 'executive',
      name: 'Executive Elegant',
      description: 'Sophisticated design for senior roles',
      category: 'professional',
      rating: 4.8,
      users: '6k+',
      isPremium: false,
      preview: '/api/placeholder/400/500'
    },
    {
      id: 'minimalist',
      name: 'Minimalist Clean',
      description: 'Simple and elegant design with focus on content',
      category: 'modern',
      rating: 4.6,
      users: '9k+',
      isPremium: false,
      preview: '/api/placeholder/400/500'
    },
    {
      id: 'tech',
      name: 'Tech Modern',
      description: 'Modern design tailored for technology professionals',
      category: 'modern',
      rating: 4.9,
      users: '11k+',
      isPremium: false,
      preview: '/api/placeholder/400/500'
    },
    {
      id: 'simple',
      name: 'Simple Professional',
      description: 'Clean and straightforward design for all industries',
      category: 'professional',
      rating: 4.5,
      users: '7k+',
      isPremium: false,
      preview: '/api/placeholder/400/500'
    },
    {
      id: 'elegant',
      name: 'Elegant Style',
      description: 'Refined design with elegant typography',
      category: 'creative',
      rating: 4.7,
      users: '5k+',
      isPremium: false,
      preview: '/api/placeholder/400/500'
    }
  ];

  const handleTemplateSelect = (templateId) => {
    console.log('Selected template:', templateId); // Debug log
    navigate(`/build?template=${templateId}`);
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Perfect{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Resume Template
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select from our collection of professionally designed, ATS-friendly resume templates
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            All Templates
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Professional
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Creative
          </button>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Modern
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Template Preview */}
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                {/* Simple template preview based on template ID */}
                <div className="absolute inset-0 p-4 text-xs">
                  {template.id === 'modern' && (
                    <div className="bg-white h-full border-l-4 border-blue-600 p-3">
                      <div className="h-4 bg-blue-600 w-20 mb-2"></div>
                      <div className="h-2 bg-gray-300 w-16 mb-1"></div>
                      <div className="h-1 bg-gray-200 w-12 mb-3"></div>
                      <div className="h-2 bg-gray-400 w-full mb-1"></div>
                      <div className="h-2 bg-gray-400 w-3/4 mb-3"></div>
                      <div className="h-1 bg-blue-500 w-10 mb-1"></div>
                      <div className="h-1 bg-gray-300 w-full mb-1"></div>
                      <div className="h-1 bg-gray-300 w-4/5"></div>
                    </div>
                  )}
                  {template.id === 'classic' && (
                    <div className="bg-white h-full p-3 border">
                      <div className="text-center mb-2">
                        <div className="h-3 bg-gray-700 w-16 mx-auto mb-1"></div>
                        <div className="h-1 bg-gray-400 w-12 mx-auto"></div>
                      </div>
                      <div className="h-1 bg-gray-600 w-8 mb-2"></div>
                      <div className="h-1 bg-gray-300 w-full mb-1"></div>
                      <div className="h-1 bg-gray-300 w-5/6 mb-2"></div>
                      <div className="h-1 bg-gray-600 w-10 mb-1"></div>
                      <div className="h-1 bg-gray-300 w-full"></div>
                    </div>
                  )}
                  {template.id === 'creative' && (
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 h-full p-3">
                      <div className="flex mb-2">
                        <div className="w-8 h-8 bg-purple-600 rounded-full mr-2"></div>
                        <div>
                          <div className="h-2 bg-purple-700 w-12 mb-1"></div>
                          <div className="h-1 bg-gray-500 w-10"></div>
                        </div>
                      </div>
                      <div className="h-2 bg-pink-600 w-12 mb-2"></div>
                      <div className="h-1 bg-gray-400 w-full mb-1"></div>
                      <div className="h-1 bg-gray-400 w-3/4"></div>
                    </div>
                  )}
                  {template.id === 'executive' && (
                    <div className="bg-white h-full border-t-4 border-gray-800 p-3">
                      <div className="h-4 bg-gray-800 w-24 mb-2"></div>
                      <div className="h-1 bg-gray-500 w-20 mb-3"></div>
                      <div className="flex justify-between mb-3">
                        <div className="w-1/2 pr-2">
                          <div className="h-1 bg-gray-700 w-12 mb-1"></div>
                          <div className="h-1 bg-gray-300 w-full mb-1"></div>
                          <div className="h-1 bg-gray-300 w-4/5 mb-1"></div>
                          <div className="h-1 bg-gray-300 w-3/4"></div>
                        </div>
                        <div className="w-1/3">
                          <div className="h-1 bg-gray-700 w-8 mb-1"></div>
                          <div className="h-1 bg-gray-300 w-full mb-1"></div>
                          <div className="h-1 bg-gray-300 w-3/4 mb-1"></div>
                          <div className="h-1 bg-gray-300 w-1/2"></div>
                        </div>
                      </div>
                      <div className="h-1 bg-gray-700 w-16 mb-1"></div>
                      <div className="h-1 bg-gray-300 w-full mb-1"></div>
                      <div className="h-1 bg-gray-300 w-5/6"></div>
                    </div>
                  )}
                  {template.id === 'minimalist' && (
                    <div className="bg-white h-full p-3 border">
                      <div className="h-4 bg-gray-900 w-20 mb-4"></div>
                      <div className="h-1 bg-gray-300 w-full mb-1"></div>
                      <div className="h-1 bg-gray-300 w-5/6 mb-4"></div>
                      <div className="h-2 bg-gray-700 w-16 mb-2"></div>
                      <div className="h-1 bg-gray-200 w-full mb-1"></div>
                      <div className="h-1 bg-gray-200 w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-700 w-12 mb-1"></div>
                      <div className="h-1 bg-gray-200 w-full mb-1"></div>
                      <div className="h-1 bg-gray-200 w-4/5"></div>
                    </div>
                  )}
                  {template.id === 'tech' && (
                    <div className="bg-gray-900 h-full p-3">
                      <div className="h-4 bg-green-400 w-16 mb-2"></div>
                      <div className="h-1 bg-gray-400 w-12 mb-3"></div>
                      <div className="h-2 bg-green-300 w-10 mb-2"></div>
                      <div className="h-1 bg-gray-300 w-full mb-1"></div>
                      <div className="h-1 bg-gray-300 w-4/5 mb-3"></div>
                      <div className="h-1 bg-blue-300 w-8 mb-2"></div>
                      <div className="flex space-x-1 mb-2">
                        <div className="h-2 bg-blue-400 w-6"></div>
                        <div className="h-2 bg-yellow-400 w-4"></div>
                        <div className="h-2 bg-red-400 w-5"></div>
                      </div>
                      <div className="h-1 bg-gray-300 w-full mb-1"></div>
                      <div className="h-1 bg-gray-300 w-3/4"></div>
                    </div>
                  )}
                  {template.id === 'simple' && (
                    <div className="bg-white h-full border p-3">
                      <div className="h-3 bg-gray-700 w-18 mb-2"></div>
                      <div className="h-1 bg-gray-400 w-14 mb-3"></div>
                      <div className="h-1 bg-gray-600 w-10 mb-2"></div>
                      <div className="h-1 bg-gray-300 w-full mb-1"></div>
                      <div className="h-1 bg-gray-300 w-5/6 mb-2"></div>
                      <div className="h-1 bg-gray-600 w-12 mb-1"></div>
                      <div className="h-1 bg-gray-300 w-full mb-1"></div>
                      <div className="h-1 bg-gray-300 w-3/4"></div>
                    </div>
                  )}
                  {template.id === 'elegant' && (
                    <div className="bg-gradient-to-b from-gray-50 to-white h-full border border-gray-300 p-3">
                      <div className="text-center mb-3">
                        <div className="h-3 bg-gray-800 w-20 mx-auto mb-1"></div>
                        <div className="h-1 bg-gray-500 w-16 mx-auto mb-2"></div>
                        <div className="w-8 h-px bg-gray-400 mx-auto"></div>
                      </div>
                      <div className="h-1 bg-gray-600 w-12 mb-2"></div>
                      <div className="h-1 bg-gray-300 w-full mb-1"></div>
                      <div className="h-1 bg-gray-300 w-4/5 mb-2"></div>
                      <div className="h-1 bg-gray-600 w-10 mb-1"></div>
                      <div className="h-1 bg-gray-300 w-full"></div>
                    </div>
                  )}
                  {/* Fallback preview for any template without specific preview */}
                  {!['modern', 'classic', 'creative', 'executive', 'minimalist', 'tech', 'simple', 'elegant'].includes(template.id) && (
                    <div className="bg-white h-full border p-3">
                      <div className="h-4 bg-gray-600 w-20 mb-2"></div>
                      <div className="h-1 bg-gray-400 w-16 mb-3"></div>
                      <div className="h-1 bg-gray-300 w-full mb-1"></div>
                      <div className="h-1 bg-gray-300 w-4/5 mb-2"></div>
                      <div className="h-1 bg-gray-600 w-12 mb-1"></div>
                      <div className="h-1 bg-gray-300 w-full mb-1"></div>
                      <div className="h-1 bg-gray-300 w-3/4"></div>
                    </div>
                  )}
                </div>
                {template.isPremium && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>PRO</span>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{template.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{template.users} used</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleTemplateSelect(template.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform group-hover:scale-105"
                >
                  Use This Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Can't decide? Choose from our most popular templates below
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleTemplateSelect('modern')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Start with Modern
            </button>
            <button
              onClick={() => handleTemplateSelect('classic')}
              className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              Start with Classic
            </button>
            <button
              onClick={() => handleTemplateSelect('creative')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
            >
              Start with Creative
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplateGallery;
