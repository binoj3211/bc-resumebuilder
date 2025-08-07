// ATS Resume Analyzer Utility Functions with AI-Powered Analysis
import * as pdfjsLib from 'pdfjs-dist'
import Tesseract from 'tesseract.js'
import { enhancedParsePDFContent } from './backendExtractor.js'

// Configure PDF.js worker properly for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString()

console.log('PDF.js worker configured:', pdfjsLib.GlobalWorkerOptions.workerSrc)

// AI-powered analysis engine
class ResumeAI {
  constructor() {
    this.industryPatterns = {
      technology: {
        keywords: ['javascript', 'python', 'react', 'node.js', 'aws', 'docker', 'kubernetes', 'api', 'database', 'agile', 'software', 'development', 'programming', 'coding', 'git', 'frontend', 'backend', 'fullstack'],
        skills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Git', 'SQL', 'MongoDB', 'TypeScript'],
        roles: ['software engineer', 'developer', 'programmer', 'architect', 'devops', 'full stack']
      },
      design: {
        keywords: ['design', 'ui', 'ux', 'figma', 'adobe', 'photoshop', 'illustrator', 'creative', 'visual', 'branding', 'prototype', 'wireframe'],
        skills: ['Figma', 'Adobe Creative Suite', 'Sketch', 'InVision', 'Prototyping', 'User Research', 'UI Design', 'UX Design'],
        roles: ['designer', 'ui designer', 'ux designer', 'creative director', 'visual designer']
      },
      marketing: {
        keywords: ['marketing', 'seo', 'sem', 'social media', 'analytics', 'campaign', 'roi', 'conversion', 'brand', 'digital marketing', 'content'],
        skills: ['Google Analytics', 'SEO', 'SEM', 'Social Media Marketing', 'Content Strategy', 'Email Marketing', 'PPC', 'Marketing Automation'],
        roles: ['marketing manager', 'digital marketer', 'marketing specialist', 'brand manager', 'growth hacker']
      },
      management: {
        keywords: ['management', 'leadership', 'strategy', 'team lead', 'project management', 'operations', 'director', 'executive', 'stakeholder'],
        skills: ['Leadership', 'Project Management', 'Strategic Planning', 'Team Management', 'Budget Management', 'Stakeholder Management'],
        roles: ['manager', 'director', 'executive', 'team lead', 'project manager', 'operations manager']
      },
      finance: {
        keywords: ['finance', 'accounting', 'financial analysis', 'budgeting', 'investment', 'excel', 'financial modeling', 'audit', 'compliance'],
        skills: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Budgeting', 'Risk Management', 'Compliance', 'Audit'],
        roles: ['financial analyst', 'accountant', 'finance manager', 'investment analyst', 'controller']
      }
    }
    
    this.strengthIndicators = {
      quantifiedAchievements: /(\d+%|\$\d+|\d+\+|increased|decreased|improved|reduced|grew|generated|saved)/gi,
      actionVerbs: /^(achieved|managed|led|developed|created|implemented|improved|increased|decreased|optimized|streamlined|coordinated|analyzed|designed|built|launched|delivered|executed|supervised|trained)/gim,
      technicalSkills: /\b(javascript|python|react|node\.js|aws|docker|sql|mongodb|git|figma|photoshop|excel|salesforce|hubspot|google analytics)\b/gi,
      educationLevel: /(bachelor|master|phd|doctorate|mba|certification)/gi
    }
  }

  // Detect industry based on resume content
  detectIndustry(resumeData) {
    const allText = JSON.stringify(resumeData).toLowerCase()
    const industryScores = {}
    
    Object.entries(this.industryPatterns).forEach(([industry, patterns]) => {
      let score = 0
      
      // Check keywords
      patterns.keywords.forEach(keyword => {
        const matches = (allText.match(new RegExp(keyword, 'gi')) || []).length
        score += matches * 2
      })
      
      // Check skills
      if (resumeData.skills) {
        patterns.skills.forEach(skill => {
          if (resumeData.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
            score += 5
          }
        })
      }
      
      // Check roles in experience
      if (resumeData.experience) {
        resumeData.experience.forEach(exp => {
          patterns.roles.forEach(role => {
            if (exp.position && exp.position.toLowerCase().includes(role)) {
              score += 10
            }
          })
        })
      }
      
      industryScores[industry] = score
    })
    
    const detectedIndustry = Object.entries(industryScores).reduce((a, b) => 
      industryScores[a[0]] > industryScores[b[0]] ? a : b
    )[0]
    
    return {
      primary: detectedIndustry,
      confidence: Math.min(industryScores[detectedIndustry] / 20, 100),
      scores: industryScores
    }
  }

  // Analyze resume strengths using AI patterns
  analyzeStrengths(resumeData) {
    const strengths = []
    const allText = JSON.stringify(resumeData).toLowerCase()
    
    // Check for quantified achievements
    const quantifiedMatches = (allText.match(this.strengthIndicators.quantifiedAchievements) || []).length
    if (quantifiedMatches >= 3) {
      strengths.push({
        type: 'quantified_achievements',
        title: 'Strong Quantified Results',
        description: `Found ${quantifiedMatches} quantified achievements - excellent for ATS and recruiters`,
        impact: 'high',
        examples: this.extractQuantifiedExamples(allText)
      })
    }
    
    // Check for strong action verbs
    const actionVerbMatches = (allText.match(this.strengthIndicators.actionVerbs) || []).length
    if (actionVerbMatches >= 5) {
      strengths.push({
        type: 'action_verbs',
        title: 'Effective Action Verbs',
        description: `Uses ${actionVerbMatches} strong action verbs to describe achievements`,
        impact: 'medium'
      })
    }
    
    // Check technical skills relevance
    const industry = this.detectIndustry(resumeData)
    if (resumeData.skills && resumeData.skills.length >= 8) {
      const relevantSkills = this.analyzeSkillRelevance(resumeData.skills, industry.primary)
      if (relevantSkills.relevantCount >= 6) {
        strengths.push({
          type: 'relevant_skills',
          title: 'Industry-Relevant Skills',
          description: `${relevantSkills.relevantCount} skills align well with ${industry.primary} industry`,
          impact: 'high',
          details: relevantSkills
        })
      }
    }
    
    // Check experience progression
    if (resumeData.experience && resumeData.experience.length >= 2) {
      const progression = this.analyzeCareerProgression(resumeData.experience)
      if (progression.showsGrowth) {
        strengths.push({
          type: 'career_progression',
          title: 'Clear Career Progression',
          description: progression.analysis,
          impact: 'medium'
        })
      }
    }
    
    return strengths
  }

  // AI-powered improvement suggestions
  generateImprovements(resumeData) {
    const improvements = []
    const industry = this.detectIndustry(resumeData)
    const allText = JSON.stringify(resumeData).toLowerCase()
    
    // Missing quantified achievements
    const quantifiedMatches = (allText.match(this.strengthIndicators.quantifiedAchievements) || []).length
    if (quantifiedMatches < 3) {
      improvements.push({
        type: 'quantified_achievements',
        priority: 'high',
        title: 'Add More Quantified Results',
        description: 'Include specific numbers, percentages, and metrics to demonstrate impact',
        examples: [
          'Instead of: "Improved team productivity" → "Improved team productivity by 35%"',
          'Instead of: "Managed budget" → "Managed $2.5M annual budget"',
          'Instead of: "Led project team" → "Led cross-functional team of 12 members"'
        ],
        aiSuggestion: this.generateQuantificationSuggestions(resumeData, industry.primary)
      })
    }
    
    // Weak action verbs
    const actionVerbMatches = (allText.match(this.strengthIndicators.actionVerbs) || []).length
    if (actionVerbMatches < 5) {
      improvements.push({
        type: 'action_verbs',
        priority: 'medium',
        title: 'Use Stronger Action Verbs',
        description: 'Replace weak verbs with powerful action words that demonstrate leadership and impact',
        suggestions: this.getActionVerbSuggestions(industry.primary),
        aiSuggestion: 'Focus on verbs that show leadership, innovation, and measurable impact'
      })
    }
    
    // Missing industry keywords
    const keywordGaps = this.analyzeKeywordGaps(resumeData, industry.primary)
    if (keywordGaps.missingKeywords.length > 0) {
      improvements.push({
        type: 'industry_keywords',
        priority: 'high',
        title: `Add ${industry.primary.charAt(0).toUpperCase() + industry.primary.slice(1)} Keywords`,
        description: `Missing important keywords for ${industry.primary} roles`,
        missingKeywords: keywordGaps.missingKeywords.slice(0, 8),
        aiSuggestion: `Incorporate these keywords naturally into your experience descriptions and skills section`
      })
    }
    
    // Skills gap analysis
    if (resumeData.skills) {
      const skillsAnalysis = this.analyzeSkillRelevance(resumeData.skills, industry.primary)
      if (skillsAnalysis.missingCritical.length > 0) {
        improvements.push({
          type: 'critical_skills',
          priority: 'high',
          title: 'Add Critical Skills',
          description: `Missing key skills commonly required for ${industry.primary} roles`,
          missingSkills: skillsAnalysis.missingCritical.slice(0, 6),
          aiSuggestion: 'Consider adding these skills if you have experience with them, or plan to learn them'
        })
      }
    }
    
    // Resume length optimization
    const wordCount = allText.split(' ').length
    if (wordCount < 300) {
      improvements.push({
        type: 'content_length',
        priority: 'medium',
        title: 'Expand Resume Content',
        description: `Resume appears brief (${wordCount} words). Consider adding more detail to experience sections`,
        aiSuggestion: 'Add 2-3 bullet points per role with specific achievements and responsibilities'
      })
    } else if (wordCount > 800) {
      improvements.push({
        type: 'content_length',
        priority: 'low',
        title: 'Consider Condensing Content',
        description: `Resume is quite detailed (${wordCount} words). Consider focusing on most relevant achievements`,
        aiSuggestion: 'Keep the most impactful 3-4 bullet points per role, focusing on recent and relevant experience'
      })
    }
    
    return improvements.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  // Generate personalized optimization suggestions
  generateOptimizationPlan(resumeData) {
    const industry = this.detectIndustry(resumeData)
    const strengths = this.analyzeStrengths(resumeData)
    const improvements = this.generateImprovements(resumeData)
    
    return {
      industryFocus: industry,
      overallScore: this.calculateAIScore(resumeData, industry),
      strengths: strengths,
      improvements: improvements,
      actionPlan: this.createActionPlan(improvements),
      personalizedTips: this.getPersonalizedTips(resumeData, industry)
    }
  }

  // Helper methods for AI analysis
  extractQuantifiedExamples(text) {
    const examples = []
    const quantifiedRegex = /([^.]*?)(\d+%|\$\d+[km]?|\d+\+|increased[^.]*\d+|decreased[^.]*\d+|improved[^.]*\d+)([^.]*?\.)/gi
    let match
    while ((match = quantifiedRegex.exec(text)) !== null && examples.length < 3) {
      examples.push(match[0].trim())
    }
    return examples
  }

  analyzeSkillRelevance(skills, industry) {
    const industrySkills = this.industryPatterns[industry]?.skills || []
    const relevantSkills = skills.filter(skill => 
      industrySkills.some(indSkill => 
        skill.toLowerCase().includes(indSkill.toLowerCase()) ||
        indSkill.toLowerCase().includes(skill.toLowerCase())
      )
    )
    
    const missingCritical = industrySkills.filter(indSkill => 
      !skills.some(skill => 
        skill.toLowerCase().includes(indSkill.toLowerCase()) ||
        indSkill.toLowerCase().includes(skill.toLowerCase())
      )
    ).slice(0, 6)
    
    return {
      relevantCount: relevantSkills.length,
      relevantSkills,
      missingCritical,
      relevancePercentage: Math.round((relevantSkills.length / skills.length) * 100)
    }
  }

  analyzeCareerProgression(experiences) {
    if (experiences.length < 2) return { showsGrowth: false }
    
    // Sort by start date (most recent first)
    const sortedExp = [...experiences].sort((a, b) => 
      new Date(b.startDate) - new Date(a.startDate)
    )
    
    let progressionScore = 0
    let analysis = ''
    
    // Check for title progression
    const hasProgressionKeywords = sortedExp.some(exp => 
      /senior|lead|director|manager|principal|head of/i.test(exp.position)
    )
    
    if (hasProgressionKeywords) {
      progressionScore += 2
      analysis += 'Shows advancement to senior/leadership roles. '
    }
    
    // Check for company progression
    const companies = sortedExp.map(exp => exp.company).filter(Boolean)
    if (new Set(companies).size >= 2) {
      progressionScore += 1
      analysis += 'Experience across multiple organizations. '
    }
    
    return {
      showsGrowth: progressionScore >= 2,
      analysis: analysis || 'Career progression could be more clearly highlighted',
      score: progressionScore
    }
  }

  analyzeKeywordGaps(resumeData, industry) {
    const allText = JSON.stringify(resumeData).toLowerCase()
    const industryKeywords = this.industryPatterns[industry]?.keywords || []
    
    const missingKeywords = industryKeywords.filter(keyword => 
      !allText.includes(keyword.toLowerCase())
    )
    
    const presentKeywords = industryKeywords.filter(keyword => 
      allText.includes(keyword.toLowerCase())
    )
    
    return {
      missingKeywords,
      presentKeywords,
      coverage: Math.round((presentKeywords.length / industryKeywords.length) * 100)
    }
  }

  getActionVerbSuggestions(industry) {
    const actionVerbs = {
      technology: ['Architected', 'Engineered', 'Optimized', 'Deployed', 'Automated', 'Debugged', 'Refactored'],
      design: ['Conceptualized', 'Prototyped', 'Redesigned', 'Visualized', 'Crafted', 'Collaborated'],
      marketing: ['Amplified', 'Converted', 'Targeted', 'Segmented', 'Optimized', 'Grew', 'Acquired'],
      management: ['Spearheaded', 'Orchestrated', 'Transformed', 'Streamlined', 'Mentored', 'Aligned'],
      finance: ['Analyzed', 'Forecasted', 'Optimized', 'Reconciled', 'Budgeted', 'Audited']
    }
    
    return actionVerbs[industry] || actionVerbs.management
  }

  calculateAIScore(resumeData, industry) {
    let score = 0
    const maxScore = 100
    
    // Industry alignment (25 points)
    score += Math.min(industry.confidence / 4, 25)
    
    // Content quality (25 points)
    const allText = JSON.stringify(resumeData).toLowerCase()
    const quantified = (allText.match(this.strengthIndicators.quantifiedAchievements) || []).length
    score += Math.min(quantified * 3, 25)
    
    // Skills relevance (25 points)
    if (resumeData.skills) {
      const skillsAnalysis = this.analyzeSkillRelevance(resumeData.skills, industry.primary)
      score += Math.min((skillsAnalysis.relevancePercentage / 4), 25)
    }
    
    // Completeness (25 points)
    let completenessScore = 0
    if (resumeData.personalInfo?.email) completenessScore += 5
    if (resumeData.personalInfo?.phone) completenessScore += 5
    if (resumeData.summary) completenessScore += 5
    if (resumeData.experience?.length > 0) completenessScore += 5
    if (resumeData.skills?.length >= 5) completenessScore += 5
    score += completenessScore
    
    return Math.min(Math.round(score), maxScore)
  }

  // Comprehensive section-by-section analysis
  analyzeSectionBySection(resumeData) {
    console.log('🔍 Starting comprehensive section analysis...')
    
    const sectionAnalysis = {
      personalInfo: this.analyzePersonalInfo(resumeData.personalInfo),
      summary: this.analyzeSummary(resumeData.summary),
      experience: this.analyzeExperience(resumeData.experience),
      education: this.analyzeEducation(resumeData.education),
      skills: this.analyzeSkills(resumeData.skills),
      projects: this.analyzeProjects(resumeData.projects),
      languages: this.analyzeLanguages(resumeData.languages),
      hobbies: this.analyzeHobbies(resumeData.hobbies),
      certifications: this.analyzeCertifications(resumeData.certifications),
      overall: this.analyzeOverallStructure(resumeData)
    }
    
    return sectionAnalysis
  }

  analyzePersonalInfo(personalInfo) {
    const analysis = {
      score: 0,
      maxScore: 100,
      strengths: [],
      improvements: [],
      completeness: 0,
      details: {}
    }

    if (!personalInfo) {
      analysis.improvements.push('Personal information section is missing')
      return analysis
    }

    // Name Analysis
    if (personalInfo.fullName) {
      analysis.score += 25
      analysis.completeness += 20
      analysis.strengths.push('Full name provided')
      
      const nameWords = personalInfo.fullName.trim().split(/\s+/)
      if (nameWords.length >= 2) {
        analysis.strengths.push('Complete name with first and last name')
        analysis.details.nameFormat = 'Complete'
      } else {
        analysis.improvements.push('Consider using full name (first and last)')
        analysis.details.nameFormat = 'Incomplete'
      }
    } else {
      analysis.improvements.push('Name is missing - critical for identification')
    }

    // Email Analysis
    if (personalInfo.email) {
      analysis.score += 25
      analysis.completeness += 20
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(personalInfo.email)) {
        analysis.strengths.push('Valid email format provided')
        analysis.details.emailValid = true
        
        // Professional email analysis
        const domain = personalInfo.email.split('@')[1]
        const professionalDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com']
        const personalDomains = ['aol.com', 'msn.com', 'live.com']
        
        if (professionalDomains.includes(domain)) {
          analysis.strengths.push('Professional email domain')
          analysis.details.emailProfessionalism = 'High'
        } else if (personalDomains.includes(domain)) {
          analysis.details.emailProfessionalism = 'Medium'
        } else if (!domain.includes('.edu') && !domain.includes('.org')) {
          analysis.strengths.push('Custom domain email (very professional)')
          analysis.details.emailProfessionalism = 'Very High'
        }
      } else {
        analysis.improvements.push('Email format appears invalid')
        analysis.details.emailValid = false
      }
    } else {
      analysis.improvements.push('Email address is missing - essential for contact')
    }

    // Phone Analysis
    if (personalInfo.phone) {
      analysis.score += 20
      analysis.completeness += 15
      analysis.strengths.push('Phone number provided')
      
      const phoneClean = personalInfo.phone.replace(/\D/g, '')
      if (phoneClean.length >= 10) {
        analysis.strengths.push('Complete phone number format')
        analysis.details.phoneComplete = true
      } else {
        analysis.improvements.push('Phone number may be incomplete')
        analysis.details.phoneComplete = false
      }
    } else {
      analysis.improvements.push('Phone number missing - important for direct contact')
    }

    // Location Analysis
    if (personalInfo.location) {
      analysis.score += 15
      analysis.completeness += 15
      analysis.strengths.push('Location information provided')
      
      if (personalInfo.location.includes(',')) {
        analysis.strengths.push('Detailed location format (City, State)')
        analysis.details.locationDetail = 'High'
      } else {
        analysis.details.locationDetail = 'Basic'
      }
    } else {
      analysis.improvements.push('Location missing - helps with local job opportunities')
    }

    // LinkedIn Analysis
    if (personalInfo.linkedin) {
      analysis.score += 10
      analysis.completeness += 15
      analysis.strengths.push('LinkedIn profile provided')
      
      if (personalInfo.linkedin.includes('linkedin.com/in/')) {
        analysis.strengths.push('Valid LinkedIn URL format')
        analysis.details.linkedinValid = true
      } else {
        analysis.improvements.push('LinkedIn URL format may be incorrect')
        analysis.details.linkedinValid = false
      }
    } else {
      analysis.improvements.push('LinkedIn profile missing - important for professional networking')
    }

    // Website/Portfolio Analysis
    if (personalInfo.website) {
      analysis.score += 5
      analysis.completeness += 15
      analysis.strengths.push('Personal website/portfolio provided')
      analysis.details.hasPortfolio = true
    } else {
      analysis.improvements.push('Consider adding a portfolio website to showcase your work')
      analysis.details.hasPortfolio = false
    }

    return analysis
  }

  analyzeSummary(summary) {
    const analysis = {
      score: 0,
      maxScore: 100,
      strengths: [],
      improvements: [],
      details: {}
    }

    if (!summary || summary.trim().length === 0) {
      analysis.improvements.push('Professional summary is missing - this is crucial for ATS and recruiters')
      analysis.improvements.push('Add a 2-4 sentence summary highlighting your key qualifications')
      return analysis
    }

    const wordCount = summary.trim().split(/\s+/).length
    const charCount = summary.length
    
    // Length Analysis
    if (wordCount >= 20 && wordCount <= 60) {
      analysis.score += 30
      analysis.strengths.push(`Optimal summary length (${wordCount} words)`)
      analysis.details.lengthOptimal = true
    } else if (wordCount < 20) {
      analysis.improvements.push(`Summary is too short (${wordCount} words) - aim for 20-60 words`)
      analysis.details.lengthOptimal = false
    } else {
      analysis.improvements.push(`Summary is too long (${wordCount} words) - aim for 20-60 words`)
      analysis.details.lengthOptimal = false
    }

    // Content Quality Analysis
    const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 0)
    if (sentences.length >= 2 && sentences.length <= 4) {
      analysis.score += 20
      analysis.strengths.push(`Good sentence structure (${sentences.length} sentences)`)
    }

    // Keyword Analysis
    const professionalKeywords = [
      'experienced', 'skilled', 'expertise', 'proficient', 'specialist', 'professional',
      'results-driven', 'detail-oriented', 'team-oriented', 'collaborative', 'innovative',
      'strategic', 'analytical', 'creative', 'leadership', 'management'
    ]
    
    const foundKeywords = professionalKeywords.filter(keyword => 
      summary.toLowerCase().includes(keyword.toLowerCase())
    )
    
    if (foundKeywords.length >= 2) {
      analysis.score += 25
      analysis.strengths.push(`Contains professional keywords (${foundKeywords.join(', ')})`)
      analysis.details.hasKeywords = true
    } else {
      analysis.improvements.push('Add more professional keywords to strengthen impact')
      analysis.details.hasKeywords = false
    }

    // Action Words Analysis
    const actionWords = [
      'achieved', 'accomplished', 'delivered', 'developed', 'created', 'improved',
      'managed', 'led', 'coordinated', 'implemented', 'optimized', 'increased'
    ]
    
    const foundActions = actionWords.filter(action => 
      summary.toLowerCase().includes(action.toLowerCase())
    )
    
    if (foundActions.length >= 1) {
      analysis.score += 15
      analysis.strengths.push('Uses action-oriented language')
      analysis.details.hasActionWords = true
    } else {
      analysis.improvements.push('Include action words to demonstrate achievements')
      analysis.details.hasActionWords = false
    }

    // Quantified Results
    const numberPattern = /\b\d+(\.\d+)?[%]?|\b(hundred|thousand|million|billion)\b/gi
    const hasNumbers = numberPattern.test(summary)
    
    if (hasNumbers) {
      analysis.score += 10
      analysis.strengths.push('Includes quantified achievements')
      analysis.details.hasQuantification = true
    } else {
      analysis.improvements.push('Consider adding specific numbers or percentages')
      analysis.details.hasQuantification = false
    }

    analysis.details.wordCount = wordCount
    analysis.details.sentenceCount = sentences.length
    analysis.details.keywordCount = foundKeywords.length

    return analysis
  }

  analyzeExperience(experience) {
    const analysis = {
      score: 0,
      maxScore: 100,
      strengths: [],
      improvements: [],
      details: {
        positions: [],
        totalExperience: experience?.length || 0
      }
    }

    if (!experience || experience.length === 0) {
      analysis.improvements.push('Work experience section is missing - this is critical')
      analysis.improvements.push('Add at least 2-3 relevant work experiences')
      return analysis
    }

    // Number of positions
    if (experience.length >= 3) {
      analysis.score += 20
      analysis.strengths.push(`Good number of positions (${experience.length})`)
    } else if (experience.length >= 2) {
      analysis.score += 15
      analysis.strengths.push(`Adequate number of positions (${experience.length})`)
    } else {
      analysis.improvements.push(`Only ${experience.length} position listed - consider adding more relevant experience`)
    }

    let totalDescriptionScore = 0
    let positionsWithQuantification = 0
    let positionsWithActionWords = 0
    let currentPositions = 0

    experience.forEach((job, index) => {
      const jobAnalysis = {
        position: index + 1,
        title: job.position || 'Not specified',
        company: job.company || 'Not specified',
        score: 0,
        issues: []
      }

      // Basic information completeness
      if (job.position && job.company) {
        jobAnalysis.score += 20
      } else {
        jobAnalysis.issues.push('Missing position title or company name')
      }

      if (job.startDate && job.endDate) {
        jobAnalysis.score += 15
        
        if (job.current) {
          currentPositions++
          jobAnalysis.score += 5 // Bonus for current position
        }
      } else {
        jobAnalysis.issues.push('Missing employment dates')
      }

      // Description Analysis
      if (job.description && job.description.trim().length > 0) {
        const bullets = job.description.split('\n').filter(line => line.trim().length > 0)
        
        if (bullets.length >= 3) {
          jobAnalysis.score += 25
        } else if (bullets.length >= 2) {
          jobAnalysis.score += 20
        } else {
          jobAnalysis.issues.push('Add more bullet points (aim for 3-5 per position)')
        }

        // Action words analysis
        const actionWords = [
          'achieved', 'accomplished', 'managed', 'led', 'developed', 'created',
          'improved', 'increased', 'decreased', 'implemented', 'coordinated',
          'supervised', 'trained', 'designed', 'built', 'optimized'
        ]
        
        const hasActionWords = actionWords.some(action => 
          job.description.toLowerCase().includes(action.toLowerCase())
        )
        
        if (hasActionWords) {
          jobAnalysis.score += 20
          positionsWithActionWords++
        } else {
          jobAnalysis.issues.push('Start bullet points with strong action verbs')
        }

        // Quantification analysis
        const numberPattern = /\b\d+(\.\d+)?[%$]?|\b(hundred|thousand|million|billion)\b/gi
        const hasNumbers = numberPattern.test(job.description)
        
        if (hasNumbers) {
          jobAnalysis.score += 20
          positionsWithQuantification++
        } else {
          jobAnalysis.issues.push('Add specific numbers, percentages, or metrics')
        }
      } else {
        jobAnalysis.issues.push('Missing job description - critical for ATS')
      }

      totalDescriptionScore += jobAnalysis.score
      analysis.details.positions.push(jobAnalysis)
    })

    // Overall experience analysis
    const avgScore = totalDescriptionScore / experience.length
    analysis.score = Math.round(avgScore)

    // Summary insights
    if (positionsWithQuantification >= Math.ceil(experience.length / 2)) {
      analysis.strengths.push('Good use of quantified achievements across positions')
    } else {
      analysis.improvements.push('Add more specific metrics and numbers to demonstrate impact')
    }

    if (positionsWithActionWords >= Math.ceil(experience.length / 2)) {
      analysis.strengths.push('Strong action-oriented language throughout experience')
    } else {
      analysis.improvements.push('Use more powerful action verbs to start bullet points')
    }

    if (currentPositions > 1) {
      analysis.improvements.push('Multiple current positions detected - verify employment dates')
    }

    analysis.details.positionsWithMetrics = positionsWithQuantification
    analysis.details.positionsWithActionWords = positionsWithActionWords
    analysis.details.currentPositions = currentPositions

    return analysis
  }

  analyzeEducation(education) {
    const analysis = {
      score: 0,
      maxScore: 100,
      strengths: [],
      improvements: [],
      details: {
        degrees: education?.length || 0,
        institutions: []
      }
    }

    if (!education || education.length === 0) {
      analysis.improvements.push('Education section is missing')
      analysis.improvements.push('Add your highest degree and institution')
      return analysis
    }

    education.forEach((edu, index) => {
      const eduAnalysis = {
        degree: edu.degree || 'Not specified',
        school: edu.school || 'Not specified',
        score: 0,
        issues: []
      }

      // Basic completeness
      if (edu.degree && edu.school) {
        analysis.score += 40
        eduAnalysis.score += 40
      } else {
        eduAnalysis.issues.push('Missing degree title or institution name')
      }

      if (edu.field) {
        analysis.score += 15
        eduAnalysis.score += 15
      } else {
        eduAnalysis.issues.push('Add field of study for clarity')
      }

      if (edu.graduationDate) {
        analysis.score += 15
        eduAnalysis.score += 15
      } else {
        eduAnalysis.issues.push('Add graduation date or expected graduation')
      }

      if (edu.location) {
        analysis.score += 10
        eduAnalysis.score += 10
      }

      // GPA Analysis
      if (edu.gpa) {
        const gpaNum = parseFloat(edu.gpa)
        if (gpaNum >= 3.5) {
          analysis.score += 20
          analysis.strengths.push(`Strong GPA (${edu.gpa}) - excellent academic performance`)
          eduAnalysis.score += 20
        } else if (gpaNum >= 3.0) {
          analysis.score += 10
          eduAnalysis.score += 10
        } else if (gpaNum < 3.0) {
          analysis.improvements.push('Consider omitting GPA below 3.0 unless required')
        }
      } else if (index === 0) { // Only suggest for primary degree
        analysis.improvements.push('Consider adding GPA if 3.5 or higher')
      }

      analysis.details.institutions.push(eduAnalysis)
    })

    // Education level analysis
    const degreeTypes = education.map(edu => edu.degree?.toLowerCase() || '').join(' ')
    
    if (degreeTypes.includes('phd') || degreeTypes.includes('doctorate')) {
      analysis.strengths.push('Doctoral degree demonstrates advanced expertise')
      analysis.details.highestLevel = 'Doctorate'
    } else if (degreeTypes.includes('master') || degreeTypes.includes('mba')) {
      analysis.strengths.push('Advanced degree enhances qualifications')
      analysis.details.highestLevel = 'Masters'
    } else if (degreeTypes.includes('bachelor')) {
      analysis.strengths.push('Bachelor\'s degree meets basic requirements')
      analysis.details.highestLevel = 'Bachelors'
    } else {
      analysis.details.highestLevel = 'Other'
    }

    // Normalize score based on number of entries
    if (education.length > 0) {
      analysis.score = Math.min(analysis.score / education.length, 100)
    }

    return analysis
  }

  analyzeSkills(skills) {
    const analysis = {
      score: 0,
      maxScore: 100,
      strengths: [],
      improvements: [],
      details: {
        totalSkills: skills?.length || 0,
        categories: {},
        skillTypes: {}
      }
    }

    if (!skills || skills.length === 0) {
      analysis.improvements.push('Skills section is missing - critical for ATS matching')
      analysis.improvements.push('Add 8-12 relevant technical and soft skills')
      return analysis
    }

    // Skill count analysis
    const skillCount = skills.length
    
    if (skillCount >= 8 && skillCount <= 15) {
      analysis.score += 30
      analysis.strengths.push(`Optimal number of skills (${skillCount})`)
    } else if (skillCount >= 5 && skillCount <= 20) {
      analysis.score += 20
      analysis.strengths.push(`Good number of skills (${skillCount})`)
    } else if (skillCount < 5) {
      analysis.improvements.push(`Too few skills (${skillCount}) - add more relevant skills`)
    } else {
      analysis.improvements.push(`Too many skills (${skillCount}) - focus on most relevant ones`)
    }

    // Categorize skills
    const technicalKeywords = [
      'programming', 'javascript', 'python', 'java', 'react', 'node', 'sql', 'database',
      'html', 'css', 'php', 'ruby', 'swift', 'kotlin', 'android', 'ios', 'web development',
      'software', 'coding', 'development', 'api', 'framework', 'library', 'git', 'github',
      'cloud', 'aws', 'azure', 'docker', 'kubernetes', 'devops', 'ci/cd', 'agile', 'scrum'
    ]
    
    const softSkillsKeywords = [
      'communication', 'leadership', 'teamwork', 'problem solving', 'analytical',
      'critical thinking', 'creativity', 'adaptability', 'time management', 'organization',
      'presentation', 'negotiation', 'project management', 'collaboration', 'interpersonal'
    ]
    
    const toolsKeywords = [
      'microsoft office', 'excel', 'powerpoint', 'word', 'photoshop', 'illustrator',
      'figma', 'sketch', 'jira', 'confluence', 'slack', 'trello', 'asana', 'salesforce',
      'hubspot', 'google analytics', 'tableau', 'power bi'
    ]

    let technicalSkills = 0
    let softSkills = 0
    let toolSkills = 0

    skills.forEach(skill => {
      const skillName = (typeof skill === 'string' ? skill : skill.name || skill).toLowerCase()
      
      if (technicalKeywords.some(keyword => skillName.includes(keyword))) {
        technicalSkills++
      } else if (softSkillsKeywords.some(keyword => skillName.includes(keyword))) {
        softSkills++
      } else if (toolsKeywords.some(keyword => skillName.includes(keyword))) {
        toolSkills++
      }
    })

    analysis.details.skillTypes = {
      technical: technicalSkills,
      soft: softSkills,
      tools: toolSkills
    }

    // Balance analysis
    if (technicalSkills > 0 && softSkills > 0) {
      analysis.score += 25
      analysis.strengths.push('Good balance of technical and soft skills')
    } else if (technicalSkills === 0) {
      analysis.improvements.push('Add relevant technical skills for your field')
    } else if (softSkills === 0) {
      analysis.improvements.push('Include important soft skills like communication and leadership')
    }

    // Industry relevance (would need to be enhanced based on detected industry)
    if (technicalSkills >= 4) {
      analysis.score += 20
      analysis.strengths.push('Strong technical skill set')
    }

    if (softSkills >= 2) {
      analysis.score += 15
      analysis.strengths.push('Includes valuable soft skills')
    }

    if (toolSkills >= 2) {
      analysis.score += 10
      analysis.strengths.push('Demonstrates tool proficiency')
    }

    return analysis
  }

  analyzeProjects(projects) {
    const analysis = {
      score: 0,
      maxScore: 100,
      strengths: [],
      improvements: [],
      details: {
        totalProjects: projects?.length || 0,
        projectTypes: []
      }
    }

    if (!projects || projects.length === 0) {
      analysis.improvements.push('Projects section missing - adds significant value')
      analysis.improvements.push('Include 2-4 relevant projects to showcase practical experience')
      return analysis
    }

    // Project count
    if (projects.length >= 2 && projects.length <= 5) {
      analysis.score += 30
      analysis.strengths.push(`Good number of projects (${projects.length})`)
    } else if (projects.length === 1) {
      analysis.score += 20
      analysis.improvements.push('Consider adding 1-2 more projects')
    } else if (projects.length > 5) {
      analysis.improvements.push('Too many projects - focus on most impactful ones')
    }

    let projectsWithLinks = 0
    let projectsWithDescriptions = 0
    let projectsWithTechnologies = 0

    projects.forEach((project, index) => {
      const projAnalysis = {
        name: project.name || `Project ${index + 1}`,
        score: 0,
        issues: []
      }

      // Basic information
      if (project.name && project.description) {
        analysis.score += 20
        projectsWithDescriptions++
      } else {
        projAnalysis.issues.push('Missing project name or description')
      }

      // Links and demos
      if (project.link || project.demo || project.github) {
        analysis.score += 15
        projectsWithLinks++
      } else {
        projAnalysis.issues.push('Add project link or demo for verification')
      }

      // Technologies used
      if (project.technologies && project.technologies.length > 0) {
        analysis.score += 15
        projectsWithTechnologies++
      } else {
        projAnalysis.issues.push('List technologies/tools used')
      }

      analysis.details.projectTypes.push(projAnalysis)
    })

    // Overall project quality
    if (projectsWithLinks >= Math.ceil(projects.length / 2)) {
      analysis.strengths.push('Projects include verifiable links/demos')
    } else {
      analysis.improvements.push('Add links or demos to more projects')
    }

    if (projectsWithTechnologies >= Math.ceil(projects.length / 2)) {
      analysis.strengths.push('Projects showcase relevant technologies')
    } else {
      analysis.improvements.push('Include technology stack for each project')
    }

    analysis.score = Math.min(analysis.score / Math.max(projects.length, 1), 100)

    return analysis
  }

  analyzeLanguages(languages) {
    const analysis = {
      score: 0,
      maxScore: 100,
      strengths: [],
      improvements: [],
      details: {
        totalLanguages: languages?.length || 0,
        proficiencyLevels: {}
      }
    }

    if (!languages || languages.length === 0) {
      analysis.improvements.push('Languages section could add value in global market')
      analysis.improvements.push('Include native language and any additional languages')
      return analysis
    }

    // Language count
    if (languages.length >= 2) {
      analysis.score += 40
      analysis.strengths.push(`Multilingual advantage (${languages.length} languages)`)
    } else {
      analysis.score += 20
      analysis.strengths.push('Language information provided')
    }

    let nativeLanguages = 0
    let fluentLanguages = 0
    let conversationalLanguages = 0

    languages.forEach(lang => {
      const proficiency = (lang.proficiency || '').toLowerCase()
      
      if (proficiency.includes('native')) {
        nativeLanguages++
        analysis.score += 20
      } else if (proficiency.includes('fluent')) {
        fluentLanguages++
        analysis.score += 15
      } else if (proficiency.includes('conversational') || proficiency.includes('intermediate')) {
        conversationalLanguages++
        analysis.score += 10
      } else if (proficiency.includes('basic') || proficiency.includes('beginner')) {
        analysis.score += 5
      }
    })

    analysis.details.proficiencyLevels = {
      native: nativeLanguages,
      fluent: fluentLanguages,
      conversational: conversationalLanguages
    }

    if (fluentLanguages >= 1) {
      analysis.strengths.push('Fluent in multiple languages - valuable for global roles')
    }

    analysis.score = Math.min(analysis.score, 100)

    return analysis
  }

  analyzeHobbies(hobbies) {
    const analysis = {
      score: 0,
      maxScore: 100,
      strengths: [],
      improvements: [],
      details: {
        totalHobbies: hobbies?.length || 0,
        categories: {}
      }
    }

    if (!hobbies || hobbies.length === 0) {
      analysis.improvements.push('Hobbies section can help show personality and culture fit')
      analysis.improvements.push('Add 2-4 relevant interests that complement your professional profile')
      return analysis
    }

    // Hobby count
    if (hobbies.length >= 2 && hobbies.length <= 5) {
      analysis.score += 40
      analysis.strengths.push(`Good variety of interests (${hobbies.length})`)
    } else if (hobbies.length === 1) {
      analysis.score += 20
      analysis.improvements.push('Add 1-2 more hobbies for better personality showcase')
    } else if (hobbies.length > 5) {
      analysis.improvements.push('Too many hobbies - keep most relevant ones')
    }

    // Categorize hobbies
    const professionalHobbies = ['reading', 'writing', 'blogging', 'learning', 'courses', 'networking']
    const creativeHobbies = ['photography', 'design', 'art', 'music', 'drawing', 'crafting']
    const activeHobbies = ['sports', 'running', 'hiking', 'cycling', 'fitness', 'yoga']
    const socialHobbies = ['volunteering', 'mentoring', 'community', 'teaching', 'coaching']
    const techHobbies = ['coding', 'programming', 'gaming', 'robotics', 'electronics']

    let categories = {
      professional: 0,
      creative: 0,
      active: 0,
      social: 0,
      technical: 0
    }

    hobbies.forEach(hobby => {
      const hobbyText = (typeof hobby === 'string' ? hobby : hobby.hobby || '').toLowerCase()
      
      if (professionalHobbies.some(ph => hobbyText.includes(ph))) {
        categories.professional++
      } else if (creativeHobbies.some(ch => hobbyText.includes(ch))) {
        categories.creative++
      } else if (activeHobbies.some(ah => hobbyText.includes(ah))) {
        categories.active++
      } else if (socialHobbies.some(sh => hobbyText.includes(sh))) {
        categories.social++
      } else if (techHobbies.some(th => hobbyText.includes(th))) {
        categories.technical++
      }
    })

    analysis.details.categories = categories

    // Quality analysis
    if (categories.professional > 0) {
      analysis.score += 20
      analysis.strengths.push('Includes professional development interests')
    }

    if (categories.social > 0) {
      analysis.score += 15
      analysis.strengths.push('Shows community involvement and leadership')
    }

    if (categories.creative + categories.active + categories.technical > 0) {
      analysis.score += 15
      analysis.strengths.push('Demonstrates well-rounded personality')
    }

    return analysis
  }

  analyzeCertifications(certifications) {
    const analysis = {
      score: 0,
      maxScore: 100,
      strengths: [],
      improvements: [],
      details: {
        totalCertifications: certifications?.length || 0,
        currentCertifications: 0,
        expiredCertifications: 0
      }
    }

    if (!certifications || certifications.length === 0) {
      analysis.improvements.push('Certifications can significantly boost your profile')
      analysis.improvements.push('Consider industry-relevant certifications to demonstrate expertise')
      return analysis
    }

    // Certification count
    if (certifications.length >= 3) {
      analysis.score += 40
      analysis.strengths.push(`Strong certification portfolio (${certifications.length} certifications)`)
    } else if (certifications.length >= 1) {
      analysis.score += 25
      analysis.strengths.push('Professional certifications enhance credibility')
    }

    certifications.forEach(cert => {
      // Check if certification is current
      if (cert.issueDate || cert.expirationDate) {
        analysis.score += 15
        
        // If expiration date exists and is in the future, it's current
        if (cert.expirationDate) {
          const expDate = new Date(cert.expirationDate)
          const today = new Date()
          
          if (expDate > today) {
            analysis.details.currentCertifications++
            analysis.score += 10
          } else {
            analysis.details.expiredCertifications++
            analysis.improvements.push(`${cert.name || 'Certification'} appears to be expired - consider renewal`)
          }
        } else {
          analysis.details.currentCertifications++
        }
      }

      // Authority/credibility check
      if (cert.issuer) {
        analysis.score += 10
      } else {
        analysis.improvements.push('Include issuing organization for each certification')
      }
    })

    if (analysis.details.currentCertifications > 0) {
      analysis.strengths.push(`${analysis.details.currentCertifications} current certifications`)
    }

    analysis.score = Math.min(analysis.score / Math.max(certifications.length, 1), 100)

    return analysis
  }

  analyzeOverallStructure(resumeData) {
    const analysis = {
      score: 0,
      maxScore: 100,
      strengths: [],
      improvements: [],
      details: {
        sectionsPresent: [],
        sectionsOptional: [],
        sectionsMissing: []
      }
    }

    const coreSection = {
      personalInfo: !!resumeData.personalInfo,
      summary: !!resumeData.summary,
      experience: !!(resumeData.experience && resumeData.experience.length > 0),
      education: !!(resumeData.education && resumeData.education.length > 0),
      skills: !!(resumeData.skills && resumeData.skills.length > 0)
    }

    const optionalSections = {
      projects: !!(resumeData.projects && resumeData.projects.length > 0),
      languages: !!(resumeData.languages && resumeData.languages.length > 0),
      hobbies: !!(resumeData.hobbies && resumeData.hobbies.length > 0),
      certifications: !!(resumeData.certifications && resumeData.certifications.length > 0)
    }

    // Core sections analysis
    const presentCore = Object.entries(coreSection).filter(([key, present]) => present)
    const missingCore = Object.entries(coreSection).filter(([key, present]) => !present)

    analysis.details.sectionsPresent = presentCore.map(([key]) => key)
    analysis.details.sectionsMissing = missingCore.map(([key]) => key)

    // Score based on core sections
    const coreScore = (presentCore.length / Object.keys(coreSection).length) * 80
    analysis.score += coreScore

    // Optional sections bonus
    const presentOptional = Object.entries(optionalSections).filter(([key, present]) => present)
    analysis.details.sectionsOptional = presentOptional.map(([key]) => key)
    
    const optionalBonus = Math.min(presentOptional.length * 5, 20)
    analysis.score += optionalBonus

    // Overall structure feedback
    if (presentCore.length === 5) {
      analysis.strengths.push('All core resume sections are present')
    } else {
      analysis.improvements.push(`Missing core sections: ${missingCore.map(([key]) => key).join(', ')}`)
    }

    if (presentOptional.length >= 2) {
      analysis.strengths.push('Good use of optional sections to showcase personality and skills')
    } else if (presentOptional.length === 1) {
      analysis.improvements.push('Consider adding 1-2 more optional sections (projects, languages, certifications)')
    } else {
      analysis.improvements.push('Add optional sections like projects or certifications to stand out')
    }

    // Section order recommendations
    const idealOrder = ['personalInfo', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'hobbies']
    analysis.details.recommendedOrder = idealOrder

    return analysis
  }

  createActionPlan(improvements) {
    const plan = {
      immediate: [],
      shortTerm: [],
      longTerm: []
    }
    
    improvements.forEach(improvement => {
      if (improvement.priority === 'high') {
        plan.immediate.push({
          action: improvement.title,
          description: improvement.description,
          timeEstimate: '15-30 minutes'
        })
      } else if (improvement.priority === 'medium') {
        plan.shortTerm.push({
          action: improvement.title,
          description: improvement.description,
          timeEstimate: '30-60 minutes'
        })
      } else {
        plan.longTerm.push({
          action: improvement.title,
          description: improvement.description,
          timeEstimate: '1-2 hours'
        })
      }
    })
    
    return plan
  }

  // Helper methods for section analysis integration
  extractSectionStrengths(sectionAnalysis) {
    const strengths = []
    
    Object.entries(sectionAnalysis).forEach(([sectionName, analysis]) => {
      if (analysis.strengths && Array.isArray(analysis.strengths)) {
        analysis.strengths.forEach(strength => {
          strengths.push(`${this.formatSectionName(sectionName)}: ${strength}`)
        })
      }
    })
    
    return strengths.slice(0, 10) // Limit to top 10 strengths
  }

  extractSectionImprovements(sectionAnalysis) {
    const improvements = []
    
    Object.entries(sectionAnalysis).forEach(([sectionName, analysis]) => {
      if (analysis.improvements && Array.isArray(analysis.improvements)) {
        analysis.improvements.forEach(improvement => {
          improvements.push(`${this.formatSectionName(sectionName)}: ${improvement}`)
        })
      }
    })
    
    return improvements.slice(0, 15) // Limit to top 15 improvements
  }

  formatSectionName(sectionName) {
    const nameMap = {
      personalInfo: 'Contact Info',
      summary: 'Summary',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      projects: 'Projects',
      languages: 'Languages',
      hobbies: 'Interests',
      certifications: 'Certifications',
      overall: 'Structure'
    }
    
    return nameMap[sectionName] || sectionName
  }

  getPersonalizedTips(resumeData, industry) {
    const tips = []
    
    // Industry-specific tips
    const industryTips = {
      technology: [
        'Highlight specific programming languages and frameworks',
        'Mention any open-source contributions or personal projects',
        'Include relevant certifications (AWS, Google Cloud, etc.)'
      ],
      design: [
        'Include a link to your portfolio',
        'Mention specific design tools and software',
        'Highlight user research and testing experience'
      ],
      marketing: [
        'Include campaign results and ROI metrics',
        'Mention specific marketing tools and platforms',
        'Highlight cross-channel campaign experience'
      ]
    }
    
    const specificTips = industryTips[industry.primary] || [
      'Tailor your resume to each job application',
      'Use industry-specific terminology',
      'Highlight transferable skills'
    ]
    
    return [...specificTips, ...this.getUniversalTips(resumeData)]
  }

  getUniversalTips(resumeData) {
    return [
      'Use consistent formatting throughout your resume',
      'Proofread carefully for grammar and spelling errors',
      'Keep your resume to 1-2 pages maximum',
      'Use bullet points for easy scanning',
      'Include relevant keywords from job descriptions'
    ]
  }

  generateQuantificationSuggestions(resumeData, industry) {
    const suggestions = {
      technology: [
        'Performance improvements (e.g., "Reduced page load time by 40%")',
        'Code quality metrics (e.g., "Decreased bug reports by 25%")',
        'Team or project sizes (e.g., "Led development team of 8 engineers")'
      ],
      marketing: [
        'ROI and conversion metrics (e.g., "Increased conversion rate by 15%")',
        'Audience growth (e.g., "Grew social media following by 200%")',
        'Campaign reach (e.g., "Managed campaigns reaching 50K+ users")'
      ],
      management: [
        'Team sizes (e.g., "Managed team of 15 professionals")',
        'Budget figures (e.g., "Oversaw $2M annual budget")',
        'Efficiency gains (e.g., "Improved process efficiency by 30%")'
      ]
    }
    
    return suggestions[industry] || [
      'Include specific numbers and percentages',
      'Mention budget sizes or cost savings',
      'Quantify team sizes and project scope'
    ]
  }
}

// Initialize AI engine
const resumeAI = new ResumeAI()

// Keywords commonly searched for by ATS systems
const COMMON_ATS_KEYWORDS = [
  'experience', 'skills', 'education', 'management', 'leadership', 'development',
  'project', 'team', 'customer', 'sales', 'marketing', 'technical', 'software',
  'analysis', 'communication', 'problem-solving', 'strategic', 'operational'
]

// Industry-specific keywords (simplified)
const INDUSTRY_KEYWORDS = {
  technology: ['javascript', 'python', 'react', 'node.js', 'aws', 'docker', 'kubernetes', 'api', 'database', 'agile'],
  marketing: ['seo', 'ppc', 'social media', 'analytics', 'campaign', 'roi', 'conversion', 'brand', 'digital marketing'],
  finance: ['financial analysis', 'budgeting', 'forecasting', 'compliance', 'audit', 'risk management', 'excel', 'sql'],
  healthcare: ['patient care', 'medical', 'clinical', 'hipaa', 'healthcare', 'treatment', 'diagnosis', 'pharmacy'],
  sales: ['crm', 'lead generation', 'closing', 'quota', 'pipeline', 'prospect', 'client relationship', 'revenue']
}

// Action verbs that ATS systems favor
const ACTION_VERBS = [
  'achieved', 'managed', 'led', 'developed', 'created', 'implemented', 'improved',
  'increased', 'decreased', 'optimized', 'streamlined', 'coordinated', 'analyzed',
  'designed', 'built', 'launched', 'delivered', 'executed', 'supervised', 'trained'
]

// Analyze resume content for ATS compatibility
export const analyzeResumeContent = (resumeData) => {
  if (!resumeData) return 0

  let score = 0
  const feedback = {
    strengths: [],
    improvements: [],
    criticalIssues: []
  }

  // Personal Information Check (20 points)
  const personalInfo = resumeData.personalInfo || {}
  if (personalInfo.fullName) score += 5
  if (personalInfo.email) score += 5
  if (personalInfo.phone) score += 5
  if (personalInfo.location) score += 5

  if (score >= 15) {
    feedback.strengths.push('Complete contact information provided')
  } else {
    feedback.criticalIssues.push('Missing essential contact information')
  }

  // Professional Summary Check (15 points)
  if (resumeData.summary) {
    const summaryWords = resumeData.summary.toLowerCase().split(/\s+/)
    if (summaryWords.length >= 50 && summaryWords.length <= 150) {
      score += 15
      feedback.strengths.push('Professional summary is well-sized (50-150 words)')
    } else if (summaryWords.length > 0) {
      score += 8
      if (summaryWords.length < 50) {
        feedback.improvements.push('Professional summary could be more detailed (aim for 50-150 words)')
      } else {
        feedback.improvements.push('Professional summary is too long (aim for 50-150 words)')
      }
    }
  } else {
    feedback.criticalIssues.push('Missing professional summary section')
  }

  // Experience Section Check (25 points)
  const experience = resumeData.experience || []
  if (experience.length > 0) {
    score += 10
    
    let experienceScore = 0
    experience.forEach(exp => {
      if (exp.position && exp.company) experienceScore += 2
      if (exp.startDate) experienceScore += 1
      if (exp.description) experienceScore += 2
    })
    
    const maxExperienceScore = Math.min(experienceScore, 15)
    score += maxExperienceScore
    
    if (maxExperienceScore >= 12) {
      feedback.strengths.push('Well-detailed work experience with dates and descriptions')
    } else {
      feedback.improvements.push('Add more details to work experience (job descriptions, dates)')
    }
  } else {
    feedback.criticalIssues.push('No work experience listed')
  }

  // Skills Section Check (15 points)
  const skills = resumeData.skills || []
  if (skills.length >= 5) {
    score += 15
    feedback.strengths.push(`Listed ${skills.length} skills - good variety`)
  } else if (skills.length > 0) {
    score += Math.floor(skills.length * 3)
    feedback.improvements.push('Add more relevant skills (aim for at least 5-10)')
  } else {
    feedback.improvements.push('Missing skills section')
  }

  // Education Check (10 points)
  const education = resumeData.education || []
  if (education.length > 0) {
    score += 10
    feedback.strengths.push('Education information provided')
  } else {
    feedback.improvements.push('Consider adding education information')
  }

  // Keywords Analysis (10 points)
  const allText = JSON.stringify(resumeData).toLowerCase()
  let keywordScore = 0
  
  COMMON_ATS_KEYWORDS.forEach(keyword => {
    if (allText.includes(keyword.toLowerCase())) {
      keywordScore += 0.5
    }
  })
  
  ACTION_VERBS.forEach(verb => {
    if (allText.includes(verb)) {
      keywordScore += 0.3
    }
  })
  
  keywordScore = Math.min(keywordScore, 10)
  score += keywordScore
  
  if (keywordScore >= 7) {
    feedback.strengths.push('Good use of ATS-friendly keywords and action verbs')
  } else {
    feedback.improvements.push('Include more industry keywords and action verbs in descriptions')
  }

  // Format and Structure Check (5 points)
  let structureScore = 0
  if (resumeData.personalInfo?.fullName) structureScore += 1
  if (resumeData.summary) structureScore += 1
  if (resumeData.experience?.length > 0) structureScore += 1
  if (resumeData.education?.length > 0) structureScore += 1
  if (resumeData.skills?.length > 0) structureScore += 1
  
  score += structureScore
  if (structureScore >= 4) {
    feedback.strengths.push('Well-structured resume with key sections')
  }

  return Math.min(Math.round(score), 100)
}

// Enhanced PDF content extraction with proper text parsing
const parsePDFContent = async (file) => {
  try {
    console.log('🔍 Starting enhanced PDF parsing with PDF.js...')
    console.log('📁 File info:', {
      name: file.name,
      type: file.type,
      size: file.size + ' bytes'
    })
    
    let usedOCR = false
    
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer()
    console.log('📄 PDF file loaded, size:', arrayBuffer.byteLength, 'bytes')
    
    // Load the PDF document with better error handling
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/',
      verbosity: 0 // Reduce console noise
    })
    
    const pdf = await loadingTask.promise
    console.log('📖 PDF loaded successfully, pages:', pdf.numPages)
    
    if (pdf.numPages === 0) {
      throw new Error('PDF has no pages')
    }
    
    let fullText = ''
    let extractedLines = []
    
    // Extract text from each page with better structure preservation and error handling
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        console.log(`🔍 Processing page ${pageNum}...`)
        
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent({
          normalizeWhitespace: true,
          disableCombineTextItems: false
        })
        
        console.log(`📄 Page ${pageNum} has ${textContent.items.length} text items`)
        
        // If no text content, skip this page
        if (!textContent.items || textContent.items.length === 0) {
          console.log(`⚠️ Page ${pageNum} has no text content`)
          continue
        }
        
        // Sort text items by position to maintain reading order
        const sortedItems = textContent.items
          .filter(item => item.str && item.str.trim()) // Filter out empty items
          .sort((a, b) => {
            // Sort by Y position (top to bottom), then X position (left to right)
            const yDiff = Math.abs(a.transform[5] - b.transform[5])
            if (yDiff < 5) { // Same line (within 5 units)
              return a.transform[4] - b.transform[4] // Sort by X position
            }
            return b.transform[5] - a.transform[5] // Sort by Y position (descending)
          })
        
        console.log(`📝 Page ${pageNum} has ${sortedItems.length} valid text items after filtering`)
        
        // Group text items into lines
        let currentLine = ''
        let currentY = null
        let lineThreshold = 5 // Pixels to consider same line
        
        for (const item of sortedItems) {
          const itemY = item.transform[5]
          const itemText = item.str.trim()
          
          if (!itemText) continue
          
          // Check if this is a new line
          if (currentY === null || Math.abs(currentY - itemY) > lineThreshold) {
            // Start new line
            if (currentLine.trim()) {
              extractedLines.push(currentLine.trim())
              fullText += currentLine.trim() + '\n'
            }
            currentLine = itemText
            currentY = itemY
          } else {
            // Same line - add space if needed
            if (currentLine && !currentLine.endsWith(' ') && !itemText.startsWith(' ')) {
              currentLine += ' '
            }
            currentLine += itemText
          }
        }
        
        // Add the last line
        if (currentLine.trim()) {
          extractedLines.push(currentLine.trim())
          fullText += currentLine.trim() + '\n'
        }
        
        console.log(`✅ Page ${pageNum} processed, extracted ${sortedItems.length} text items`)
        
      } catch (pageError) {
        console.error(`❌ Error processing page ${pageNum}:`, pageError)
        console.log(`⏭️ Skipping page ${pageNum} and continuing...`)
        // Continue with next page instead of failing completely
        continue
      }
    }

    // If no text extracted, fallback to OCR on first page
    if (!fullText.trim() || fullText.length < 10) {
      console.log('⚠️ Little or no text extracted from PDF, running OCR fallback...')
      try {
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 2.0 }) // Higher scale for better OCR
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const context = canvas.getContext('2d')
        
        console.log('🖼️ Rendering PDF page to canvas for OCR...')
        await page.render({ 
          canvasContext: context, 
          viewport,
          intent: 'print' // Better quality for OCR
        }).promise
        
        console.log('🔍 Running OCR analysis...')
        const ocrResult = await Tesseract.recognize(canvas, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
            }
          }
        })
        
        if (ocrResult.data.text && ocrResult.data.text.length > 10) {
          fullText = ocrResult.data.text
          extractedLines = fullText.split('\n').filter(line => line.trim())
          usedOCR = true
          console.log('✅ OCR completed successfully, text length:', fullText.length)
        } else {
          console.log('⚠️ OCR produced minimal results')
        }
      } catch (ocrError) {
        console.error('❌ OCR fallback failed:', ocrError)
        console.log('📝 Continuing with any text that was extracted...')
      }
    }

    console.log('🎯 PDF parsing complete!')
    console.log('📊 Final results:', {
      totalTextLength: fullText.length,
      linesExtracted: extractedLines.length,
      usedOCR: usedOCR,
      extractionSuccess: fullText.length > 5
    })
    console.log('👀 First few lines preview:', extractedLines.slice(0, 3))

    return {
      fullText: fullText.trim(),
      lines: extractedLines.filter(line => line.trim()), // Filter empty lines
      extractedSuccessfully: fullText.trim().length > 5, // Lower threshold for success
      pagesProcessed: pdf.numPages,
      usedOCR
    }
    
  } catch (error) {
    console.error('❌ PDF parsing error:', error)
    console.log('⚠️ Falling back to filename-based analysis')
    
    return {
      fullText: '',
      lines: [],
      extractedSuccessfully: false,
      error: error.message
    }
  }
}

// Enhanced resume data extraction with AI-powered analysis
const extractResumeDataFromText = (pdfResult, fileName) => {
  console.log('🤖 Starting AI-powered resume data extraction...')
  console.log('📊 Input data:', {
    textLength: pdfResult?.fullText?.length || 0,
    linesCount: pdfResult?.lines?.length || 0,
    extractedSuccessfully: pdfResult?.extractedSuccessfully || false
  })
  
  // Use the structured lines for better parsing
  const text = pdfResult?.fullText || ''
  const lines = pdfResult?.lines || []
  const lowerText = text.toLowerCase()
  
  const extractedData = {
    personalInfo: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
    hobbies: [],
    certifications: [],
    _rawText: text,
    _usedOCR: pdfResult?.usedOCR || false
  }

  // If no text was extracted, create intelligent defaults based on filename
  if (!pdfResult?.extractedSuccessfully || text.length < 50) {
    console.log('⚠️ PDF text extraction failed, using intelligent filename analysis')
    return createIntelligentPDFDefaults(fileName)
  }
  
  console.log('🔍 Analyzing extracted text with AI patterns...')

  // ENHANCED NAME EXTRACTION with multiple strategies
  const extractName = () => {
    console.log('👤 Extracting name...')
    
    // Strategy 1: Look for name patterns in first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim()
      
      // Skip email, phone, address lines
      if (line.match(/@|phone|tel|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|linkedin|github/i)) {
        continue
      }
      
      // Look for name patterns
      const namePatterns = [
        /^([A-Z][a-z]+(?:\s+[A-Z][a-z]*)*\s+[A-Z][a-z]+)$/, // First Last, First Middle Last
        /^([A-Z][A-Z\s]+)$/, // ALL CAPS name
        /^([A-Z][a-z]+\s+[A-Z]\.\s+[A-Z][a-z]+)$/, // First M. Last
      ]
      
      for (const pattern of namePatterns) {
        const match = line.match(pattern)
        if (match && match[1].length < 50 && match[1].split(' ').length <= 4) {
          console.log('✅ Name found:', match[1])
          return match[1]
        }
      }
      
      // If line looks like a name (2-4 words, proper case, not too long)
      const words = line.split(/\s+/)
      if (words.length >= 2 && words.length <= 4 && 
          words.every(word => /^[A-Z][a-z]*$/.test(word)) &&
          line.length < 40) {
        console.log('✅ Name found (heuristic):', line)
        return line
      }
    }
    
    // Strategy 2: Extract from filename as fallback
    return extractNameFromFilename(fileName)
  }

  // ENHANCED EMAIL EXTRACTION
  const extractEmail = () => {
    console.log('📧 Extracting email...')
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const emails = text.match(emailPattern) || []
    
    // Filter out obvious non-personal emails
    const personalEmails = emails.filter(email => 
      !email.includes('noreply') && 
      !email.includes('example.com') &&
      !email.includes('company.com')
    )
    
    if (personalEmails.length > 0) {
      console.log('✅ Email found:', personalEmails[0])
      return personalEmails[0]
    }
    return null
  }

  // ENHANCED PHONE EXTRACTION
  const extractPhone = () => {
    console.log('📱 Extracting phone...')
    const phonePatterns = [
      /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
      /(\+?[0-9]{1,3}[-.\s]?)?([0-9]{3,4})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{4})/g
    ]
    
    for (const pattern of phonePatterns) {
      const matches = [...text.matchAll(pattern)]
      if (matches.length > 0) {
        const phone = matches[0][0].trim()
        console.log('✅ Phone found:', phone)
        return phone
      }
    }
    return null
  }

  // ENHANCED LOCATION EXTRACTION
  const extractLocation = () => {
    console.log('📍 Extracting location...')
    const locationPatterns = [
      /([A-Z][a-z]+,?\s+[A-Z]{2}(\s+\d{5})?)/g, // City, ST ZIP
      /([A-Z][a-z]+\s+[A-Z][a-z]+,?\s+[A-Z]{2}(\s+\d{5})?)/g, // City Name, ST ZIP
      /([A-Z][a-z]+,\s+[A-Z][a-z]+)/g, // City, Country
    ]
    
    for (const pattern of locationPatterns) {
      const matches = [...text.matchAll(pattern)]
      if (matches.length > 0) {
        const location = matches[0][1] || matches[0][0]
        console.log('✅ Location found:', location)
        return location
      }
    }
    return null
  }

  // ENHANCED SUMMARY EXTRACTION
  const extractSummary = () => {
    console.log('📝 Extracting summary/objective...')
    const summaryKeywords = [
      'professional summary', 'summary', 'objective', 'profile', 
      'about me', 'overview', 'career objective', 'personal statement'
    ]
    
    for (const keyword of summaryKeywords) {
      const keywordIndex = lowerText.indexOf(keyword)
      if (keywordIndex !== -1) {
        // Find text after the keyword until next section
        const afterKeyword = text.substring(keywordIndex + keyword.length)
        const nextSectionMatch = afterKeyword.match(/\n\s*(?:experience|education|skills|work history|employment|projects|certifications)/i)
        const sectionEnd = nextSectionMatch ? nextSectionMatch.index : 400
        
        let summaryText = afterKeyword.substring(0, sectionEnd)
          .replace(/^\W+/, '') // Remove leading punctuation
          .trim()
        
        // Clean up the summary text
        summaryText = summaryText.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join(' ')
          .replace(/\s+/g, ' ')
        
        if (summaryText.length > 30 && summaryText.length < 600) {
          console.log('✅ Summary found:', summaryText.substring(0, 100) + '...')
          return summaryText
        }
      }
    }
    return null
  }

  // ENHANCED SKILLS EXTRACTION with AI categorization
  const extractSkills = () => {
    console.log('🛠️ Extracting skills...')
    const skillsKeywords = ['skills', 'technical skills', 'core competencies', 'technologies', 'expertise', 'proficiencies']
    const extractedSkills = new Set()
    
    for (const keyword of skillsKeywords) {
      const keywordIndex = lowerText.indexOf(keyword)
      if (keywordIndex !== -1) {
        const afterSkills = text.substring(keywordIndex)
        const nextSectionMatch = afterSkills.match(/\n\s*(?:experience|education|work history|employment|projects|certifications)/i)
        const sectionEnd = nextSectionMatch ? nextSectionMatch.index : 500
        const skillsText = afterSkills.substring(0, sectionEnd)
        
        console.log('🔍 Found skills section, analyzing...')
        
        // Multiple extraction patterns
        const skillPatterns = [
          /•\s*([^•\n]+)/g, // Bullet points
          /,\s*([^,\n]+)/g, // Comma separated
          /\|\s*([^|\n]+)/g, // Pipe separated
          /\n\s*([A-Za-z+#.\s]{2,25})\s*(?:\n|$)/g // Line separated
        ]
        
        for (const pattern of skillPatterns) {
          const matches = [...skillsText.matchAll(pattern)]
          matches.forEach(match => {
            const skill = match[1]?.trim()
            if (skill && 
                skill.length > 1 && 
                skill.length < 30 && 
                !/^\d+$/.test(skill) &&
                !skill.includes('experience') &&
                !skill.includes('education')) {
              extractedSkills.add(skill)
            }
          })
        }
        break
      }
    }
    
    // Also look for skills mentioned in experience descriptions
    const techSkillsPattern = /\b(?:JavaScript|Python|React|Node\.js|Java|C\+\+|HTML|CSS|SQL|MongoDB|AWS|Docker|Git|TypeScript|Angular|Vue|PHP|Ruby|Go|Kotlin|Swift|Figma|Photoshop|Excel|Salesforce|HubSpot|Google Analytics|SEO|PPC|Agile|Scrum)\b/gi
    const techMatches = [...text.matchAll(techSkillsPattern)]
    techMatches.forEach(match => extractedSkills.add(match[0]))
    
    const skillsArray = [...extractedSkills].slice(0, 20) // Limit to top 20
    console.log('✅ Skills extracted:', skillsArray.length, 'skills')
    return skillsArray
  }

  // ENHANCED EXPERIENCE EXTRACTION
  const extractExperience = () => {
    console.log('💼 Extracting work experience...')
    const experienceKeywords = ['experience', 'work history', 'employment', 'professional experience', 'career history']
    
    for (const keyword of experienceKeywords) {
      const keywordIndex = lowerText.indexOf(keyword)
      if (keywordIndex !== -1) {
        const afterExp = text.substring(keywordIndex)
        const nextSectionMatch = afterExp.match(/\n\s*(?:education|skills|projects|certifications)/i)
        const sectionEnd = nextSectionMatch ? nextSectionMatch.index : 1000
        const expText = afterExp.substring(0, sectionEnd)
        
        console.log('🔍 Found experience section, parsing jobs...')
        
        // Look for job entries with dates
        const jobEntries = []
        const jobPattern = /([A-Z][A-Za-z\s&,.-]{2,50})\s*(?:at|@|,|\n)\s*([A-Z][A-Za-z\s&,.-]{2,50})\s*.*?(\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/gi
        const jobMatches = [...expText.matchAll(jobPattern)]
        
        for (let i = 0; i < Math.min(jobMatches.length, 5); i++) {
          const match = jobMatches[i]
          if (match && match[1] && match[2]) {
            const position = match[1].trim()
            const company = match[2].trim()
            
            // Skip if position or company seems invalid
            if (position.length > 3 && company.length > 3 &&
                !position.toLowerCase().includes('experience') &&
                !company.toLowerCase().includes('experience')) {
              
              jobEntries.push({
                id: i + 1,
                position: position,
                company: company,
                location: extractedData.personalInfo.location || 'Location',
                startDate: '2022-01',
                endDate: i === 0 ? 'Present' : '2023-12',
                current: i === 0,
                description: this.generateJobDescription(position, company)
              })
            }
          }
        }
        
        if (jobEntries.length > 0) {
          console.log('✅ Experience extracted:', jobEntries.length, 'positions')
          return jobEntries
        }
      }
    }
    
    return []
  }

  // Apply extraction functions
  extractedData.personalInfo.fullName = extractName()
  extractedData.personalInfo.email = extractEmail()
  extractedData.personalInfo.phone = extractPhone()
  extractedData.personalInfo.location = extractLocation()
  extractedData.personalInfo.linkedin = text.match(/linkedin\.com\/in\/[\w-]+/i)?.[0] ? 
    'https://' + text.match(/linkedin\.com\/in\/[\w-]+/i)[0] : null
  extractedData.summary = extractSummary()
  extractedData.skills = extractSkills()
  extractedData.experience = extractExperience()
  
  // Extract education, languages, hobbies (simplified for now)
  extractedData.education = extractEducation(text, lowerText)
  extractedData.languages = extractLanguages(text, lowerText)
  extractedData.hobbies = extractHobbies(text, lowerText)
  
  console.log('🎯 AI-powered extraction complete!')
  console.log('📊 Extracted data summary:', {
    name: extractedData.personalInfo.fullName ? '✅' : '❌',
    email: extractedData.personalInfo.email ? '✅' : '❌',
    phone: extractedData.personalInfo.phone ? '✅' : '❌',
    summary: extractedData.summary ? '✅' : '❌',
    skills: extractedData.skills.length,
    experience: extractedData.experience.length
  })

  return extractedData

  // Helper function to extract name from filename
  function extractNameFromFilename(fileName) {
    const namePatterns = [
      /([a-z]+)[_\s-]+([a-z]+)[_\s-]*resume/i,
      /resume[_\s-]+([a-z]+)[_\s-]+([a-z]+)/i,
      /([a-z]+)[_\s-]+([a-z]+)/i
    ]
    
    for (const pattern of namePatterns) {
      const match = fileName.match(pattern)
      if (match && match[1] && match[2]) {
        const firstName = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase()
        const lastName = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase()
        return `${firstName} ${lastName}`
      }
    }
    
    return 'Professional Candidate'
  }

  // Helper function to generate realistic job descriptions
  function generateJobDescription(position, company) {
    const positionLower = position.toLowerCase()
    
    if (positionLower.includes('developer') || positionLower.includes('engineer') || positionLower.includes('programmer')) {
      return `• Developed and maintained software applications using modern technologies and best practices
• Collaborated with cross-functional teams to deliver high-quality solutions on time and within budget
• Implemented automated testing and deployment processes to improve code quality and delivery speed
• Participated in code reviews and technical discussions to ensure adherence to coding standards`
    } else if (positionLower.includes('designer') || positionLower.includes('ux') || positionLower.includes('ui')) {
      return `• Designed user interfaces and experiences for web and mobile applications
• Conducted user research and usability testing to inform design decisions
• Created wireframes, prototypes, and design systems to guide development
• Collaborated with product managers and developers to ensure design feasibility`
    } else if (positionLower.includes('manager') || positionLower.includes('director') || positionLower.includes('lead')) {
      return `• Led and managed a team of professionals to achieve departmental goals and objectives
• Developed and implemented strategic initiatives that improved operational efficiency
• Collaborated with stakeholders to identify opportunities for process improvement
• Mentored team members and fostered a positive work environment`
    } else if (positionLower.includes('marketing') || positionLower.includes('digital')) {
      return `• Developed and executed marketing campaigns that increased brand awareness and customer engagement
• Analyzed marketing metrics and ROI to optimize campaign performance
• Managed social media presence and content strategy across multiple platforms
• Collaborated with sales teams to generate qualified leads and support revenue growth`
    } else {
      return `• Contributed to key projects and initiatives that supported organizational objectives
• Collaborated with team members to deliver high-quality results on time
• Implemented process improvements that enhanced efficiency and productivity
• Maintained high standards of professionalism and attention to detail`
    }
  }
}

// Helper functions for enhanced data extraction
const extractEducation = (text, lowerText) => {
  console.log('🎓 Extracting education...')
  const educationKeywords = ['education', 'academic background', 'qualifications']
  
  for (const keyword of educationKeywords) {
    const eduIndex = lowerText.indexOf(keyword)
    if (eduIndex !== -1) {
      const afterEdu = text.substring(eduIndex + keyword.length)
      const sectionEnd = afterEdu.search(/\n\s*(experience|skills|projects|work history)/i)
      const eduText = (sectionEnd > 0 ? afterEdu.substring(0, sectionEnd) : afterEdu.substring(0, 400))
      
      // Look for degree patterns
      const degreePatterns = [
        /(bachelor|master|phd|doctorate|associate|diploma|certificate).*?(?:in|of)?\s*([a-z\s]+).*?(university|college|institute|school)\s*([a-z\s]+)/gi,
        /(b\.?[as]\.?|m\.?[as]\.?|ph\.?d\.?).*?([a-z\s]+).*?(university|college|institute|school)/gi
      ]
      
      for (const pattern of degreePatterns) {
        const degreeMatch = eduText.match(pattern)
        if (degreeMatch) {
          const fullMatch = degreeMatch[0]
          const parts = fullMatch.split(/(university|college|institute|school)/i)
          
          return [{
            id: 1,
            degree: parts[0]?.trim() || 'Bachelor\'s Degree',
            field: 'Field of Study',
            school: parts[2]?.trim() || 'University Name',
            location: 'Location',
            graduationDate: '2020',
            gpa: ''
          }]
        }
      }
    }
  }
  
  return [{
    id: 1,
    degree: 'Bachelor\'s Degree',
    field: 'Field of Study',
    school: 'University Name',
    location: 'Location',
    graduationDate: '2020',
    gpa: ''
  }]
}

const extractLanguages = (text, lowerText) => {
  console.log('🌐 Extracting languages...')
  const languageKeywords = ['languages', 'language skills']
  
  for (const keyword of languageKeywords) {
    const langIndex = lowerText.indexOf(keyword)
    if (langIndex !== -1) {
      const afterLang = text.substring(langIndex + keyword.length, langIndex + keyword.length + 200)
      const commonLanguages = ['english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'korean', 'arabic', 'portuguese', 'russian', 'italian', 'hindi', 'mandarin']
      const foundLanguages = commonLanguages.filter(lang => afterLang.toLowerCase().includes(lang))
      
      if (foundLanguages.length > 0) {
        return foundLanguages.map((lang, index) => ({
          id: index + 1,
          language: lang.charAt(0).toUpperCase() + lang.slice(1),
          proficiency: index === 0 ? 'Native' : 'Fluent'
        }))
      }
    }
  }
  
  return [
    { id: 1, language: 'English', proficiency: 'Native' }
  ]
}

const extractHobbies = (text, lowerText) => {
  console.log('🎨 Extracting hobbies/interests...')
  const hobbyKeywords = ['hobbies', 'interests', 'activities', 'personal interests']
  
  for (const keyword of hobbyKeywords) {
    const hobbyIndex = lowerText.indexOf(keyword)
    if (hobbyIndex !== -1) {
      const afterHobby = text.substring(hobbyIndex + keyword.length, hobbyIndex + keyword.length + 300)
      
      // Try to extract hobbies using multiple patterns
      const hobbyPatterns = [
        /•\s*([^•\n]+)/g, // Bullet points
        /,\s*([^,\n]+)/g, // Comma separated
        /\n\s*([A-Za-z\s]{3,25})\s*(?:\n|$)/g // Line separated
      ]
      
      const extractedHobbies = new Set()
      
      for (const pattern of hobbyPatterns) {
        const matches = [...afterHobby.matchAll(pattern)]
        matches.forEach(match => {
          const hobby = match[1]?.trim()
          if (hobby && 
              hobby.length > 2 && 
              hobby.length < 30 && 
              !hobby.toLowerCase().includes('experience') &&
              !hobby.toLowerCase().includes('education')) {
            extractedHobbies.add(hobby)
          }
        })
      }
      
      if (extractedHobbies.size > 0) {
        return [...extractedHobbies].slice(0, 5)
      }
    }
  }
  
  return ['Professional Development', 'Continuous Learning', 'Reading']
}

// Merge backend-structured data with default resume structure
const mergeBackendDataWithDefaults = (backendData, rawText, fileName) => {
  console.log('🔄 Merging backend structured data with defaults...')
  console.log('📝 Backend data keys:', Object.keys(backendData || {}))
  console.log('📄 Raw text length:', rawText?.length || 0)
  console.log('👤 Backend personal info:', backendData?.personalInfo)
  
  // Create defaults with extracted name if available, otherwise use filename intelligently
  const extractedName = backendData?.personalInfo?.fullName || 'Your Name'
  console.log('✅ Using name for defaults:', extractedName)
  
  const defaults = getDefaultResumeData(extractedName)
  
  // Merge with priority to backend data
  const merged = {
    personalInfo: {
      ...defaults.personalInfo,
      ...backendData?.personalInfo,
      // Ensure we preserve the extracted name
      fullName: backendData?.personalInfo?.fullName || extractedName
    },
    summary: backendData?.summary || defaults.summary,
    experience: backendData?.experience && backendData.experience.length > 0 
      ? backendData.experience.map((exp, index) => ({ ...exp, id: Date.now() + index }))
      : defaults.experience,
    education: backendData?.education && backendData.education.length > 0
      ? backendData.education.map((edu, index) => ({ ...edu, id: Date.now() + index }))
      : defaults.education,
    skills: backendData?.skills && backendData.skills.length > 0 
      ? backendData.skills 
      : defaults.skills,
    projects: backendData?.projects || defaults.projects || [],
    languages: backendData?.languages || defaults.languages || [],
    hobbies: backendData?.hobbies || defaults.hobbies || [],
    certifications: backendData?.certifications || defaults.certifications || [],
    _rawText: rawText || '',
    _backendExtracted: true
  }
  
  console.log('🎯 Final merged personal info:', merged.personalInfo)
  console.log('✅ Merge completed with backend data preserved')
  
  return merged
}

// Create intelligent defaults for PDF files when full parsing isn't available
const createIntelligentPDFDefaults = (fileName) => {
  console.log('Creating intelligent PDF defaults for:', fileName)
  
  // Try to extract name from filename
  let extractedName = 'Your Name'
  const lowerFileName = fileName.toLowerCase()
  
  const namePatterns = [
    /([a-z]+)[_\s-]+([a-z]+)[_\s-]*resume/i,
    /resume[_\s-]+([a-z]+)[_\s-]+([a-z]+)/i,
    /([a-z]+)[_\s-]+([a-z]+)/i
  ]
  
  for (const pattern of namePatterns) {
    const match = fileName.match(pattern)
    if (match && match[1] && match[2]) {
      const firstName = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase()
      const lastName = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase()
      extractedName = `${firstName} ${lastName}`
      break
    }
  }
  
  // Determine likely profession/industry from filename
  const isProbablyTech = /dev|program|software|tech|web|frontend|backend|fullstack|react|node|python|javascript/i.test(fileName)
  const isProbablyDesign = /design|ux|ui|creative|graphic|visual/i.test(fileName)
  const isProbablyManagement = /manager|lead|director|executive|pm|product/i.test(fileName)
  const isProbablyMarketing = /marketing|digital|seo|social|content|brand/i.test(fileName)
  
  let defaultSummary = 'Experienced professional with a proven track record of delivering results and driving organizational success. Skilled in team collaboration, problem-solving, and strategic thinking with a commitment to continuous improvement and professional excellence.'
  let defaultSkills = ['Leadership', 'Team Collaboration', 'Problem Solving', 'Communication', 'Project Management', 'Strategic Planning', 'Process Improvement', 'Data Analysis']
  let defaultExperience = {
    position: 'Professional Role',
    company: 'Company Name',
    description: '• Led cross-functional teams to deliver high-impact projects on time and within budget\n• Developed and implemented strategic initiatives that improved operational efficiency by 25%\n• Collaborated with stakeholders to identify opportunities and drive process improvements\n• Mentored junior team members and contributed to positive organizational culture'
  }
  
  if (isProbablyTech) {
    defaultSummary = 'Experienced software developer with proven expertise in developing scalable applications and solving complex technical challenges. Skilled in modern programming languages and frameworks with a track record of delivering high-quality solutions on time.'
    defaultSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'HTML/CSS', 'Git', 'Agile/Scrum', 'API Development', 'Database Design', 'Problem Solving']
    defaultExperience.position = 'Software Developer'
    defaultExperience.company = 'Tech Company'
    defaultExperience.description = '• Developed and maintained web applications using modern JavaScript frameworks\n• Collaborated with cross-functional teams to deliver features that improved user engagement by 30%\n• Implemented automated testing and CI/CD pipelines to ensure code quality\n• Mentored junior developers and participated in code reviews and technical discussions'
  } else if (isProbablyDesign) {
    defaultSummary = 'Creative professional with extensive experience in user-centered design and visual communication. Skilled in creating intuitive interfaces and engaging user experiences that align with business objectives and user needs.'
    defaultSkills = ['UI/UX Design', 'Adobe Creative Suite', 'Figma', 'Prototyping', 'User Research', 'Wireframing', 'Visual Design', 'Design Systems', 'Collaboration', 'Creative Problem Solving']
    defaultExperience.position = 'UX/UI Designer'
    defaultExperience.company = 'Design Agency'
    defaultExperience.description = '• Designed user interfaces and experiences for web and mobile applications\n• Conducted user research and usability testing to inform design decisions\n• Collaborated with development teams to ensure design feasibility and implementation\n• Created design systems and style guides to maintain consistency across products'
  } else if (isProbablyManagement) {
    defaultSummary = 'Results-driven leader with extensive experience in team management, strategic planning, and operational excellence. Proven ability to drive organizational growth, optimize processes, and build high-performing teams that consistently exceed targets.'
    defaultSkills = ['Team Leadership', 'Strategic Planning', 'Project Management', 'Budget Management', 'Performance Optimization', 'Stakeholder Management', 'Change Management', 'Business Analysis', 'Communication', 'Decision Making']
    defaultExperience.position = 'Team Manager'
    defaultExperience.company = 'Growing Company'
    defaultExperience.description = '• Led a team of 15+ professionals, achieving 95% employee satisfaction and reducing turnover by 40%\n• Developed and executed strategic initiatives that increased revenue by 25% year-over-year\n• Optimized operational processes, resulting in 30% improvement in efficiency metrics\n• Collaborated with executive leadership to align team objectives with company goals'
  } else if (isProbablyMarketing) {
    defaultSummary = 'Digital marketing professional with expertise in multi-channel campaign management, data analytics, and brand development. Proven track record of driving customer acquisition, engagement, and retention through innovative marketing strategies.'
    defaultSkills = ['Digital Marketing', 'SEO/SEM', 'Social Media Marketing', 'Content Strategy', 'Google Analytics', 'Email Marketing', 'PPC Advertising', 'Brand Management', 'Market Research', 'Data Analysis']
    defaultExperience.position = 'Digital Marketing Specialist'
    defaultExperience.company = 'Marketing Agency'
    defaultExperience.description = '• Developed and executed digital marketing campaigns that increased brand awareness by 50%\n• Managed multi-channel marketing efforts including SEO, social media, and email campaigns\n• Analyzed marketing metrics and ROI to optimize campaign performance and budget allocation\n• Collaborated with creative teams to develop compelling content and marketing materials'
  }
  
  return {
    personalInfo: {
      fullName: extractedName,
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: defaultSummary,
    experience: [
      {
        id: 1,
        position: defaultExperience.position,
        company: defaultExperience.company,
        location: 'City, State',
        startDate: '2022-01',
        endDate: 'Present',
        current: true,
        description: defaultExperience.description
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Bachelor of Science',
        field: 'Relevant Field',
        school: 'University Name',
        location: 'City, State',
        graduationDate: '2020',
        gpa: ''
      }
    ],
    skills: defaultSkills,
    projects: [],
    languages: [
      { id: 1, language: 'English', proficiency: 'Native' }
    ],
    hobbies: [
      'Professional Development', 'Continuous Learning', 'Innovation', 'Collaboration'
    ],
    certifications: []
  }
}

// Enhanced analyze resume file with AI-powered insights
export const analyzeResumeFile = async (file) => {
  console.log('=== AI-POWERED ANALYZER START ===')
  console.log('File:', file.name, file.type, file.size)
  
  try {
    console.log('Starting AI-enhanced file analysis...')
    
    let extractedText = ''
    let extractedData = null
    let pdfResult = null
    
    // Parse PDF files for actual content using enhanced method (backend first, client fallback)
    if (file.type === 'application/pdf') {
      console.log('📄 Parsing PDF content with enhanced backend/client method...')
      try {
        // Use the enhanced PDF extraction that tries backend first
        pdfResult = await enhancedParsePDFContent(file)
        console.log('📊 Enhanced PDF parsing result:', {
          success: pdfResult.extractedSuccessfully,
          textLength: pdfResult.fullText?.length || 0,
          linesCount: pdfResult.lines?.length || 0,
          method: pdfResult.extractionMethod || 'Unknown',
          error: pdfResult.error || 'None',
          usedOCR: pdfResult.usedOCR || false
        })
        
        extractedText = pdfResult.fullText || ''
        
        if (pdfResult.extractedSuccessfully && extractedText.length > 10) {
          console.log('✅ Using enhanced PDF extraction for data parsing...')
          
          // If backend provided structured data, use it
          if (pdfResult.structuredData) {
            console.log('🎯 Using backend-provided structured data...')
            console.log('📋 Structured data keys:', Object.keys(pdfResult.structuredData))
            console.log('📄 Full text length for merge:', pdfResult.fullText?.length || 0)
            extractedData = mergeBackendDataWithDefaults(pdfResult.structuredData, pdfResult.fullText, file.name)
            console.log('✅ Merge completed, _rawText length:', extractedData._rawText?.length || 0)
          } else {
            console.log('🔍 Parsing extracted text client-side...')
            extractedData = extractResumeDataFromText(pdfResult, file.name)
          }
        } else {
          console.log('⚠️ PDF extraction had limited results, using intelligent fallback...')
          extractedData = createIntelligentPDFDefaults(file.name)
          // Still try to analyze whatever text we got
          if (extractedText.length > 0) {
            console.log('🔍 Attempting to parse available text:', extractedText.slice(0, 100) + '...')
            const partialResult = extractResumeDataFromText(pdfResult, file.name)
            // Merge any successfully extracted data
            if (partialResult && partialResult.personalInfo?.fullName) {
              extractedData.personalInfo = { ...extractedData.personalInfo, ...partialResult.personalInfo }
            }
            if (partialResult && partialResult.skills?.length > 0) {
              extractedData.skills = partialResult.skills
            }
          }
        }
      } catch (pdfError) {
        console.error('💥 PDF parsing completely failed:', pdfError)
        // Create a basic error result structure
        pdfResult = {
          fullText: '',
          lines: [],
          extractedSuccessfully: false,
          error: pdfError.message,
          usedOCR: false
        }
        extractedText = ''
        extractedData = createIntelligentPDFDefaults(file.name)
      }
    }
    
    // Parse text files
    else if (file.type === 'text/plain') {
      console.log('Reading text file...')
      extractedText = await file.text()
      // Create a structure similar to PDF result for consistency
      pdfResult = {
        fullText: extractedText,
        lines: extractedText.split('\n'),
        extractedSuccessfully: true
      }
      extractedData = extractResumeDataFromText(pdfResult, file.name)
    }
    
    // For other files, use filename-based extraction
    if (!extractedData) {
      console.log('Using intelligent filename-based extraction...')
      extractedData = extractResumeDataFromFilename(file.name)
    }
    
    console.log('Final extracted data:', {
      hasPersonalInfo: !!extractedData?.personalInfo,
      hasName: !!extractedData?.personalInfo?.fullName,
      hasEmail: !!extractedData?.personalInfo?.email,
      hasSkills: extractedData?.skills?.length || 0,
      hasExperience: extractedData?.experience?.length || 0
    })
    
    // AI-POWERED ANALYSIS
    console.log('Applying AI analysis engine...')
    const aiAnalysis = resumeAI.generateOptimizationPlan(extractedData)
    console.log('AI Analysis completed:', aiAnalysis)
    
    // COMPREHENSIVE SECTION-BY-SECTION ANALYSIS
    console.log('Performing detailed section analysis...')
    const sectionAnalysis = resumeAI.analyzeSectionBySection(extractedData)
    console.log('Section analysis completed:', sectionAnalysis)
    
    // Calculate hybrid score (traditional + AI + section analysis)
    const traditionalScore = calculateResumeScore(extractedText, extractedData, file)
    const aiScore = aiAnalysis.overallScore
    
    // Calculate section-weighted score
    const sectionScores = Object.values(sectionAnalysis).filter(section => typeof section.score === 'number')
    const avgSectionScore = sectionScores.reduce((sum, section) => sum + section.score, 0) / Math.max(sectionScores.length, 1)
    
    const hybridScore = Math.round((traditionalScore * 0.2) + (aiScore * 0.4) + (avgSectionScore * 0.4))
    
    // Generate comprehensive analysis result
    const result = {
      overallScore: hybridScore,
      aiInsights: {
        detectedIndustry: aiAnalysis.industryFocus,
        industryAlignment: Math.round(aiAnalysis.industryFocus.confidence),
        aiScore: aiScore,
        traditionalScore: traditionalScore,
        sectionScore: Math.round(avgSectionScore)
      },
      
      // Combine insights from all analysis methods
      strengths: [
        ...generateStrengths(extractedData, extractedText, file),
        ...aiAnalysis.strengths.map(strength => strength.description),
        ...this.extractSectionStrengths(sectionAnalysis)
      ],
      improvements: [
        ...generateImprovements(extractedData, extractedText, hybridScore),
        ...aiAnalysis.improvements.map(improvement => improvement.description),
        ...this.extractSectionImprovements(sectionAnalysis)
      ],
      criticalIssues: hybridScore < 50 ? generateCriticalIssues(extractedData, file) : [],
      
      // SECTION-BY-SECTION DETAILED ANALYSIS
      detailedSectionAnalysis: sectionAnalysis,
      
      // AI-Enhanced sections
      aiRecommendations: {
        immediate: aiAnalysis.actionPlan.immediate,
        shortTerm: aiAnalysis.actionPlan.shortTerm,
        longTerm: aiAnalysis.actionPlan.longTerm
      },
      personalizedTips: aiAnalysis.personalizedTips,
      detailedAnalysis: {
        industryFocus: aiAnalysis.industryFocus,
        strengthsDetailed: aiAnalysis.strengths,
        improvementsDetailed: aiAnalysis.improvements,
        keywordAnalysis: aiAnalysis.industryFocus.primary ? 
          resumeAI.analyzeKeywordGaps(extractedData, aiAnalysis.industryFocus.primary) : null,
        skillsAnalysis: extractedData.skills ? 
          resumeAI.analyzeSkillRelevance(extractedData.skills, aiAnalysis.industryFocus.primary) : null
      },
      
      extractedData: extractedData,
      fileInfo: {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type || 'Unknown',
        contentLength: extractedText.length,
        analysisMethod: pdfResult?.extractionMethod || (pdfResult?.extractedSuccessfully ? 'AI-Enhanced PDF Analysis' : 
                       extractedText.length > 50 ? 'Content Analysis' : 'Intelligent Inference'),
        pdfPages: pdfResult?.pagesProcessed || 0,
        linesExtracted: pdfResult?.lines?.length || 0,
        extractionSuccess: pdfResult?.extractedSuccessfully || false,
        rawTextPreview: extractedText.slice(0, 500) + (extractedText.length > 500 ? '...' : ''),
        usedOCR: pdfResult?.usedOCR || false,
        backendExtracted: extractedData?._backendExtracted || false
      }
    }
    
    console.log('AI-Enhanced Analysis complete, hybrid score:', hybridScore)
    console.log('Industry detected:', aiAnalysis.industryFocus.primary, 'Confidence:', aiAnalysis.industryFocus.confidence)
    console.log('AI Recommendations:', aiAnalysis.actionPlan)
    console.log('=== AI-POWERED ANALYZER END ===')
    return result
    
  } catch (error) {
    console.error('AI Analysis error:', error)
    return {
      overallScore: 30,
      aiInsights: {
        detectedIndustry: { primary: 'general', confidence: 0 },
        industryAlignment: 0,
        aiScore: 30,
        traditionalScore: 30
      },
      strengths: ['File uploaded successfully'],
      improvements: [
        'File analysis encountered an error',
        'Please ensure file is not corrupted and try again',
        'Use PDF, DOCX, or TXT format for best results'
      ],
      criticalIssues: ['Analysis error occurred - manual resume building recommended'],
      aiRecommendations: {
        immediate: [{ action: 'Re-upload file', description: 'Try uploading your resume again', timeEstimate: '2 minutes' }],
        shortTerm: [],
        longTerm: []
      },
      personalizedTips: [
        'Ensure your resume is in a supported format (PDF, DOCX, TXT)',
        'Check that the file is not corrupted',
        'Try using a different version of your resume'
      ],
      extractedData: getDefaultResumeData(file.name),
      fileInfo: {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type || 'Unknown',
        contentLength: 0,
        analysisMethod: 'Error Recovery',
        pdfPages: 0,
        linesExtracted: 0,
        extractionSuccess: false,
        rawTextPreview: 'No text extracted from PDF. Try a different file or check formatting.',
        usedOCR: false,
        error: error.message
      }
    }
  }
}

// Extract basic data from filename when content parsing fails
const extractResumeDataFromFilename = (fileName) => {
  let extractedName = 'Your Name'
  const lowerFileName = fileName.toLowerCase()
  
  // Try to extract name from filename patterns
  const namePatterns = [
    /([a-z]+)[_\s-]+([a-z]+)[_\s-]*resume/i,
    /resume[_\s-]+([a-z]+)[_\s-]+([a-z]+)/i,
    /([a-z]+)[_\s-]+([a-z]+)/i
  ]
  
  for (const pattern of namePatterns) {
    const match = fileName.match(pattern)
    if (match && match[1] && match[2]) {
      const firstName = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase()
      const lastName = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase()
      extractedName = `${firstName} ${lastName}`
      break
    }
  }
  
  return getDefaultResumeData(extractedName)
}

// Generate default resume data structure
const getDefaultResumeData = (name = 'Your Name') => {
  return {
    personalInfo: {
      fullName: name,
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: 'Dedicated professional with strong background in delivering results and driving organizational success. Proven ability to work effectively in team environments while maintaining high standards of quality and performance.',
    experience: [
      {
        id: 1,
        position: 'Professional Role',
        company: 'Company Name',
        location: 'City, State',
        startDate: '2022-01',
        endDate: 'Present',
        current: true,
        description: '• Led key initiatives resulting in measurable improvements to team efficiency\n• Collaborated with cross-functional teams to deliver projects on time and within budget\n• Implemented process improvements that reduced costs and increased productivity\n• Mentored junior team members and contributed to positive team culture'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Bachelor of Science',
        field: 'Your Field of Study',
        school: 'University Name',
        location: 'City, State',
        graduationDate: '2020',
        gpa: ''
      }
    ],
    skills: [
      'Leadership', 'Project Management', 'Team Collaboration', 'Problem Solving',
      'Communication', 'Strategic Planning', 'Process Improvement', 'Data Analysis'
    ],
    projects: [],
    languages: [
      { id: 1, language: 'English', proficiency: 'Native' }
    ],
    hobbies: [
      'Professional Development', 'Reading', 'Technology', 'Volunteering'
    ],
    certifications: []
  }
}

// Calculate resume score based on extracted content
const calculateResumeScore = (text, extractedData, file) => {
  let score = 20 // Base score
  
  // File format scoring
  if (file.name.toLowerCase().endsWith('.pdf')) score += 25
  else if (file.name.toLowerCase().endsWith('.docx')) score += 20
  else if (file.name.toLowerCase().endsWith('.txt')) score += 30
  else score += 5
  
  // Content-based scoring
  if (extractedData.personalInfo.fullName && extractedData.personalInfo.fullName !== 'Your Name') score += 10
  if (extractedData.personalInfo.email) score += 10
  if (extractedData.personalInfo.phone) score += 8
  if (extractedData.personalInfo.location) score += 7
  if (extractedData.summary && extractedData.summary.length > 50) score += 10
  if (extractedData.skills && extractedData.skills.length > 3) score += 10
  if (text.length > 500) score += 5 // Has substantial content
  
  return Math.min(score, 100)
}

// Generate strengths based on analysis
const generateStrengths = (extractedData, text, file) => {
  const strengths = ['File uploaded and analyzed successfully']
  
  if (file.name.toLowerCase().endsWith('.pdf')) {
    strengths.push('PDF format ensures excellent ATS compatibility')
  }
  
  if (extractedData.personalInfo.fullName && extractedData.personalInfo.fullName !== 'Your Name') {
    strengths.push('Name successfully extracted from resume')
  }
  
  if (extractedData.personalInfo.email) {
    strengths.push('Contact email found and extracted')
  }
  
  if (extractedData.personalInfo.phone) {
    strengths.push('Phone number successfully identified')
  }
  
  if (extractedData.summary && extractedData.summary.length > 50) {
    strengths.push('Professional summary section detected')
  }
  
  if (extractedData.skills && extractedData.skills.length > 0) {
    strengths.push(`${extractedData.skills.length} skills identified`)
  }
  
  if (text.length > 1000) {
    strengths.push('Resume contains substantial content for ATS parsing')
  }
  
  return strengths
}

// Generate improvement suggestions
const generateImprovements = (extractedData, text, score) => {
  const improvements = []
  
  if (!extractedData.personalInfo.email) {
    improvements.push('Add a professional email address')
  }
  
  if (!extractedData.personalInfo.phone) {
    improvements.push('Include a phone number for contact')
  }
  
  if (!extractedData.personalInfo.location) {
    improvements.push('Add your location (City, State)')
  }
  
  if (!extractedData.summary || extractedData.summary.length < 50) {
    improvements.push('Create a compelling professional summary (2-3 sentences)')
  }
  
  if (!extractedData.skills || extractedData.skills.length < 5) {
    improvements.push('Add more relevant skills (aim for 8-12 skills)')
  }
  
  if (score < 80) {
    improvements.push('Include quantified achievements in experience sections')
    improvements.push('Use strong action verbs to start bullet points')
    improvements.push('Add relevant industry keywords')
  }
  
  improvements.push('Review and customize all extracted information for accuracy')
  improvements.push('Ensure formatting is clean and ATS-friendly')
  
  return improvements
}

// Generate critical issues for low scores
const generateCriticalIssues = (extractedData, file) => {
  const issues = []
  
  if (!file.name.toLowerCase().match(/\.(pdf|docx|doc|txt)$/)) {
    issues.push('File format may not be compatible with ATS systems')
  }
  
  if (!extractedData.personalInfo.fullName || extractedData.personalInfo.fullName === 'Your Name') {
    issues.push('Unable to extract name from resume')
  }
  
  if (!extractedData.personalInfo.email && !extractedData.personalInfo.phone) {
    issues.push('No contact information found - critical for job applications')
  }
  
  return issues
}

// Simulate comprehensive resume analysis
const simulateResumeAnalysis = (content, file) => {
  console.log('simulateResumeAnalysis called with:', {
    content: content ? content.substring(0, 100) + '...' : 'empty',
    fileName: file.name
  })
  
  const fileName = file.name.toLowerCase()
  const fileSize = file.size
  let score = 20 // Base score for having a file
  
  const strengths = []
  const improvements = []
  const criticalIssues = []
  
  console.log('Starting analysis simulation...')
  
  // Extract potential resume data from content and filename
  const extractedData = extractResumeData(content, fileName)
  console.log('Extracted data:', extractedData)
  
  // File format analysis
  if (fileName.endsWith('.pdf')) {
    score += 15
    strengths.push('PDF format is ATS-friendly and maintains formatting')
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    score += 10
    strengths.push('Word document format is commonly accepted by ATS systems')
  } else if (fileName.endsWith('.txt')) {
    score += 20
    strengths.push('Plain text format ensures maximum ATS compatibility')
  } else {
    criticalIssues.push('File format may not be ATS-compatible')
  }
  
  console.log('File format analysis done, score:', score)
  
  // File size analysis
  if (fileSize > 5 * 1024 * 1024) { // > 5MB
    improvements.push('File size is quite large - consider optimizing images or content')
  } else if (fileSize < 50 * 1024) { // < 50KB
    improvements.push('File seems small - ensure all relevant content is included')
    score -= 5
  } else {
    score += 10
    strengths.push('File size is appropriate for ATS processing')
  }
  
  // Content analysis (basic pattern matching if text is available)
  const lowerContent = content.toLowerCase()
  
  if (lowerContent.includes('@') || lowerContent.includes('email')) {
    score += 10
    strengths.push('Email contact information appears to be present')
  } else {
    improvements.push('Ensure email address is clearly visible and properly formatted')
  }
  
  if (lowerContent.match(/\d{3}[-.]?\d{3}[-.]?\d{4}/) || lowerContent.includes('phone')) {
    score += 10
    strengths.push('Phone number appears to be included')
  } else {
    improvements.push('Add a phone number for better contact accessibility')
  }
  
  // Check for common resume keywords
  const commonKeywords = [
    'experience', 'education', 'skills', 'summary', 'objective',
    'work', 'employment', 'project', 'achievement', 'responsibility'
  ]
  
  let keywordCount = 0
  commonKeywords.forEach(keyword => {
    if (lowerContent.includes(keyword) || fileName.includes(keyword)) {
      keywordCount++
    }
  })
  
  if (keywordCount >= 5) {
    score += 15
    strengths.push('Resume appears to contain standard sections and keywords')
  } else if (keywordCount >= 3) {
    score += 10
    improvements.push('Consider adding more relevant sections (Summary, Skills, Experience)')
  } else {
    improvements.push('Add standard resume sections: Summary, Experience, Education, Skills')
  }
  
  // Add common improvements
  if (score < 80) {
    improvements.push('Improve keyword usage throughout resume')
    improvements.push('Add more detailed work experience descriptions')
    improvements.push('Use more action verbs in experience descriptions')
    improvements.push('Include relevant technical and soft skills')
    improvements.push('Ensure all contact information is present')
  }
  
  // Add critical issues for low scores
  if (score < 50) {
    criticalIssues.push('Low ATS compatibility - major improvements needed')
    criticalIssues.push('Missing essential resume components')
  }
  
  // Ensure score doesn't exceed 100
  score = Math.min(score, 100)
  
  const finalResult = {
    overallScore: score,
    strengths: strengths,
    improvements: improvements,
    criticalIssues: criticalIssues,
    extractedData: extractedData, // Include extracted resume data
    fileInfo: {
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type || 'Unknown'
    }
  }
  
  console.log('simulateResumeAnalysis returning:', finalResult)
  return finalResult
}

// Extract resume data from content and filename
const extractResumeData = (content, fileName) => {
  const lowerContent = content.toLowerCase()
  const extractedData = {
    personalInfo: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    languages: [],
    hobbies: []
  }
  
  // Extract name from filename (common pattern: FirstName_LastName_Resume.pdf)
  const nameMatch = fileName.match(/([a-z]+)[_\s]([a-z]+)[_\s]*(resume|cv)?/i)
  if (nameMatch) {
    const firstName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1)
    const lastName = nameMatch[2].charAt(0).toUpperCase() + nameMatch[2].slice(1)
    extractedData.personalInfo.fullName = `${firstName} ${lastName}`
  }
  
  // Extract email pattern
  const emailMatch = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
  if (emailMatch && emailMatch[0]) {
    extractedData.personalInfo.email = emailMatch[0]
  }
  
  // Extract phone number
  const phoneMatch = content.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/g)
  if (phoneMatch && phoneMatch[0]) {
    extractedData.personalInfo.phone = phoneMatch[0].replace(/\s+/g, ' ').trim()
  }
  
  // Extract potential location (common patterns)
  const locationPatterns = [
    /([A-Z][a-z]+,\s*[A-Z]{2})/g, // City, ST format
    /([A-Z][a-z]+\s+[A-Z][a-z]+,\s*[A-Z]{2})/g, // City Name, ST format
  ]
  
  for (const pattern of locationPatterns) {
    const locationMatch = content.match(pattern)
    if (locationMatch && locationMatch[0]) {
      extractedData.personalInfo.location = locationMatch[0]
      break
    }
  }
  
  // Generate intelligent summary suggestions based on content analysis
  if (lowerContent.includes('software') || lowerContent.includes('developer') || lowerContent.includes('programming')) {
    extractedData.summary = 'Experienced software developer with proven expertise in developing scalable applications and solving complex technical challenges. Skilled in modern programming languages and frameworks with a track record of delivering high-quality solutions on time.'
  } else if (lowerContent.includes('manager') || lowerContent.includes('management') || lowerContent.includes('leadership')) {
    extractedData.summary = 'Results-driven professional with extensive experience in team leadership and project management. Proven ability to drive operational efficiency, lead cross-functional teams, and deliver strategic initiatives that exceed business objectives.'
  } else if (lowerContent.includes('marketing') || lowerContent.includes('digital') || lowerContent.includes('campaign')) {
    extractedData.summary = 'Creative marketing professional with expertise in digital marketing strategies and campaign management. Demonstrated success in driving brand awareness, customer engagement, and revenue growth through innovative marketing solutions.'
  } else if (lowerContent.includes('sales') || lowerContent.includes('account') || lowerContent.includes('customer')) {
    extractedData.summary = 'Dynamic sales professional with a strong track record of exceeding targets and building lasting client relationships. Expert in consultative selling, account management, and driving revenue growth in competitive markets.'
  } else {
    extractedData.summary = 'Dedicated professional with strong analytical and problem-solving skills. Proven ability to work effectively in team environments and deliver results that meet organizational goals and exceed expectations.'
  }
  
  // Extract skills from content (look for common skill keywords)
  const skillKeywords = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'HTML', 'CSS',
    'Project Management', 'Leadership', 'Communication', 'Problem Solving',
    'Data Analysis', 'Microsoft Office', 'Excel', 'PowerPoint', 'Teamwork',
    'Strategic Planning', 'Customer Service', 'Sales', 'Marketing', 'Research'
  ]
  
  skillKeywords.forEach(skill => {
    if (lowerContent.includes(skill.toLowerCase())) {
      extractedData.skills.push(skill)
    }
  })
  
  // Add default skills if none found
  if (extractedData.skills.length === 0) {
    extractedData.skills = [
      'Communication', 'Problem Solving', 'Team Collaboration', 'Time Management',
      'Analytical Thinking', 'Adaptability', 'Customer Focus', 'Results-Oriented'
    ]
  }
  
  // Generate experience suggestions based on content
  const experienceSuggestion = {
    position: 'Your Most Recent Position',
    company: 'Company Name',
    location: extractedData.personalInfo.location || 'City, State',
    startDate: '2022-01',
    endDate: 'Present',
    current: true,
    description: `• Achieved measurable results through strategic planning and execution
• Led cross-functional teams to deliver projects on time and within budget
• Improved processes resulting in increased efficiency and cost savings
• Collaborated with stakeholders to identify and implement innovative solutions
• Mentored team members and contributed to professional development initiatives`
  }
  
  extractedData.experience = [experienceSuggestion]
  
  // Generate education suggestion
  const educationSuggestion = {
    degree: 'Bachelor of Science',
    field: 'Your Field of Study',
    school: 'University Name',
    location: 'City, State',
    graduationDate: '2020',
    gpa: ''
  }
  
  extractedData.education = [educationSuggestion]
  
  // Suggest languages based on name or content patterns
  if (lowerContent.includes('spanish') || lowerContent.includes('bilingual')) {
    extractedData.languages.push({ language: 'Spanish', proficiency: 'Fluent' })
  }
  if (lowerContent.includes('french')) {
    extractedData.languages.push({ language: 'French', proficiency: 'Conversational' })
  }
  if (extractedData.languages.length === 0) {
    extractedData.languages.push({ language: 'English', proficiency: 'Native' })
  }
  
  // Suggest relevant hobbies based on content
  const hobbyCategories = {
    technical: ['Coding Projects', 'Technology Blogging', 'Open Source Contributing'],
    creative: ['Photography', 'Writing', 'Graphic Design'],
    leadership: ['Volunteering', 'Community Leadership', 'Mentoring'],
    fitness: ['Running', 'Cycling', 'Hiking'],
    learning: ['Reading', 'Online Courses', 'Professional Development']
  }
  
  if (lowerContent.includes('software') || lowerContent.includes('technical')) {
    extractedData.hobbies = hobbyCategories.technical.slice(0, 2)
  } else if (lowerContent.includes('creative') || lowerContent.includes('design')) {
    extractedData.hobbies = hobbyCategories.creative.slice(0, 2)
  } else {
    extractedData.hobbies = ['Reading', 'Travel', 'Photography', 'Volunteering'].slice(0, 3)
  }
  
  return extractedData
}
