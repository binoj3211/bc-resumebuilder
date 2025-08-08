import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Zap, Target, Award, Download, Eye, Shield, Palette } from 'lucide-react'

const Features = () => {
  const navigate = useNavigate()
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Analysis',
      description: 'Get instant feedback on your resume with our intelligent ATS analysis engine.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Target,
      title: 'ATS Optimization',
      description: 'Ensure your resume passes through applicant tracking systems with high scores.',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Palette,
      title: 'Professional Templates',
      description: 'Choose from multiple clean, modern templates designed by HR professionals.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Eye,
      title: 'Real-time Preview',
      description: 'See your changes instantly with our live preview feature.',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Download,
      title: 'Multiple Formats',
      description: 'Export your resume as PDF, Word document, or plain text format.',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data stays on your device. We never store or share your personal information.',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
            Everything you need to land your dream job
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our comprehensive suite of tools helps you create, optimize, and perfect your resume
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div className={`${feature.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4 font-display">
              Ready to get started?
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Join thousands of job seekers who've successfully landed their dream jobs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/templates')}
                className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Create Your Resume
              </button>
              <button 
                onClick={() => navigate('/templates')}
                className="border border-blue-300 text-white hover:bg-white/10 font-medium px-8 py-3 rounded-lg transition-colors"
              >
                View Sample Resumes
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
