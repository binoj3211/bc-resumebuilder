const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs').promises;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173', // Main Vite dev server port
    'http://localhost:5174', 
    'http://localhost:5175', 
    'http://localhost:5176', 
    'http://localhost:5177', 
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    'https://*.railway.app',
    'https://*.vercel.app',
    'https://*.netlify.app',
    'https://*.render.com'
  ], 
  methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Database connection
mongoose.connect(
  process.env.MONGODB_URI ||
  'mongodb+srv://binoj321:binoj321@cluster0.z3mce7y.mongodb.net/ats-resume-builder?retryWrites=true&w=majority&appName=Cluster0'
)
.then(() => console.log('📦 Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'ATS Resume Backend',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// PDF text extraction endpoint
app.post('/api/extract-pdf-text', upload.single('resume'), async (req, res) => {
  try {
    console.log('📄 Received PDF extraction request');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file provided'
      });
    }

    console.log('📊 File details:', {
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Extract text from PDF buffer
    const pdfBuffer = req.file.buffer;
    const data = await pdf(pdfBuffer, {
      // PDF parsing options
      max: 0, // Maximum number of pages to parse (0 = all)
      version: 'v1.10.100' // PDF.js version
    });

    console.log('✅ PDF parsing completed');
    console.log('📊 Extraction results:', {
      textLength: data.text?.length || 0,
      numPages: data.numpages || 0,
      hasText: !!(data.text && data.text.trim())
    });

    // Parse the extracted text into structured data
    const structuredData = parseResumeText(data.text);
    
    console.log('🔍 Structured data created:', {
      hasPersonalInfo: !!(structuredData.personalInfo && Object.keys(structuredData.personalInfo).length > 0),
      hasSummary: !!(structuredData.summary && structuredData.summary.length > 0),
      skillsCount: structuredData.skills?.length || 0,
      experienceCount: structuredData.experience?.length || 0,
      hasRawText: !!(structuredData._rawText && structuredData._rawText.length > 0)
    });

    const response = {
      success: true,
      extractedText: data.text || '',
      metadata: {
        pages: data.numpages || 0,
        textLength: data.text?.length || 0,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        extractionMethod: 'pdf-parse (Node.js)'
      },
      structuredData: structuredData
    };

    console.log('📤 Sending response with keys:', Object.keys(response));
    console.log('📤 Structured data keys:', Object.keys(response.structuredData));
    console.log('📤 Personal info:', response.structuredData.personalInfo);

    res.json(response);

  } catch (error) {
    console.error('❌ PDF extraction error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'PDF extraction failed',
      extractedText: '',
      metadata: {
        pages: 0,
        textLength: 0,
        fileName: req.file?.originalname || 'unknown',
        fileSize: req.file?.size || 0,
        extractionMethod: 'pdf-parse (Node.js) - FAILED'
      }
    });
  }
});

// Parse extracted text into structured resume data
function parseResumeText(text) {
  if (!text || text.trim().length === 0) {
    return {
      personalInfo: {},
      summary: '',
      skills: [],
      experience: [],
      education: [],
      languages: [],
      hobbies: [],
      certifications: [],
      projects: [],
      achievements: [],
      references: '',
      rawLines: [],
      sections: {}
    };
  }

  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const lowerText = text.toLowerCase();
  
  const structuredData = {
    personalInfo: {},
    summary: '',
    skills: [],
    experience: [],
    education: [],
    languages: [],
    hobbies: [],
    certifications: [],
    projects: [],
    achievements: [],
    references: '',
    rawLines: lines,
    sections: {},
    _rawText: text // Store the raw text for debug purposes
  };

  console.log('🔍 Parsing comprehensive structured data from text...');
  console.log('📊 Text analysis:', {
    totalLines: lines.length,
    textLength: text.length,
    wordsApprox: text.split(/\s+/).length
  });

  // === SECTION 1: PERSONAL INFORMATION EXTRACTION ===
  console.log('👤 Extracting personal information...');

  // Extract email
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = text.match(emailPattern) || [];
  if (emails.length > 0) {
    structuredData.personalInfo.email = emails[0];
    console.log('📧 Found email:', emails[0]);
  }

  // Extract phone numbers - Enhanced pattern for international numbers
  const phonePatterns = [
    // International format: +91 8113 8735 or +9181138735
    /\+\d{1,3}[-.\s]?\d{1,14}/g,
    // US format: (123) 456-7890 or 123-456-7890 
    /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
    // General pattern: any sequence of 10+ digits with optional formatting
    /[\+]?[\d\s\-\(\)]{10,}/g
  ];
  
  let phoneFound = false;
  for (const pattern of phonePatterns) {
    const phones = text.match(pattern) || [];
    for (const phone of phones) {
      // Clean and validate the phone number
      const cleanPhone = phone.replace(/[^\d+]/g, ''); // Keep only digits and +
      if (cleanPhone.length >= 10) { // Valid phone should have at least 10 digits
        structuredData.personalInfo.phone = phone.trim();
        console.log('📞 Found phone:', phone.trim());
        phoneFound = true;
        break;
      }
    }
    if (phoneFound) break;
  }

  // Extract names - Enhanced name detection
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const line = lines[i];
    // Skip lines with @ or phone numbers or common resume keywords
    if (line.includes('@') || 
        /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(line) ||
        /^(resume|cv|curriculum vitae)$/i.test(line) ||
        line.toLowerCase().includes('street') ||
        line.toLowerCase().includes('city') ||
        line.toLowerCase().includes('phone') ||
        line.toLowerCase().includes('email')) continue;
    
    // Check if line looks like a name (2-4 words, proper case)
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && 
        words.every(word => /^[A-Z][a-z]*$/.test(word) || /^[A-Z]+$/.test(word)) && 
        line.length < 50) {
      structuredData.personalInfo.fullName = line;
      console.log('👤 Found name:', line);
      break;
    }
  }

  // Extract address - Enhanced address detection
  const addressPatterns = [
    // Full address patterns
    /\d+\s+[A-Za-z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|way|place|pl|court|ct)[\s,]*[A-Za-z\s]*,?\s*[A-Za-z\s]*\d{5,6}/gi,
    // Street address only
    /\d+\s+[A-Za-z\s]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|way|place|pl|court|ct)/gi,
    // City, State ZIP patterns
    /[A-Za-z\s]{2,30},\s*[A-Z]{2,3}\s+\d{5,6}/g,
    // City with postal code (international)
    /[A-Za-z\s]{2,25}[-\s,]*\d{5,6}/g,
    // Indian postal patterns
    /[A-Za-z\s]{2,25}[-\s,]*\d{6}/g,
    // Address lines that contain common address keywords
    /.*(?:address|location|residing|based)\s*[:]\s*([A-Za-z0-9\s,.-]+)/gi
  ];
  
  for (const pattern of addressPatterns) {
    const addressMatches = text.match(pattern) || [];
    for (const match of addressMatches) {
      // Clean and validate address
      const cleanAddress = match.replace(/^.*?[:]\s*/, '').trim(); // Remove "Address:" prefix
      if (cleanAddress.length > 10 && cleanAddress.length < 150 && 
          !cleanAddress.includes('@') && !cleanAddress.includes('http')) {
        structuredData.personalInfo.address = cleanAddress;
        console.log('📍 Found address:', cleanAddress);
        break;
      }
    }
    if (structuredData.personalInfo.address) break;
  }

  // Extract LinkedIn profile - Enhanced LinkedIn detection
  const linkedinPatterns = [
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9\-_]+\/?/gi,
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/pub\/[A-Za-z0-9\-_]+\/?/gi,
    /linkedin\.com\/in\/[A-Za-z0-9\-_]+/gi
  ];
  
  for (const pattern of linkedinPatterns) {
    const linkedinMatch = text.match(pattern);
    if (linkedinMatch) {
      structuredData.personalInfo.linkedin = linkedinMatch[0];
      console.log('💼 Found LinkedIn:', linkedinMatch[0]);
      break;
    }
  }

  // Extract website/portfolio - Enhanced website detection
  const websitePatterns = [
    // Full URLs with protocol
    /https?:\/\/(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}[^\s]*/g,
    // URLs without protocol
    /(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}[^\s]*/g,
    // Portfolio keywords
    /(?:portfolio|website|personal site|homepage|blog)\s*[:]\s*([^\s\n]+)/gi,
    // Common portfolio patterns
    /[a-zA-Z0-9-]+\.(?:com|net|org|io|dev|me|tech|co|in|github\.io|herokuapp\.com|netlify\.app|vercel\.app)/gi
  ];
  
  const websiteUrls = [];
  for (const pattern of websitePatterns) {
    const matches = [...text.matchAll(pattern)] || [];
    matches.forEach(match => {
      let url = pattern.toString().includes('[:]:') ? match[1] : match[0]; // Handle capture group
      url = url.trim().replace(/[,\s]*$/, ''); // Clean trailing punctuation
      
      if (url && url.length > 5 && url.length < 100 && 
          !url.toLowerCase().includes('linkedin') && 
          !url.toLowerCase().includes('email') &&
          !url.toLowerCase().includes('phone') &&
          !url.toLowerCase().includes('gmail') &&
          !url.toLowerCase().includes('yahoo') &&
          !url.toLowerCase().includes('hotmail') &&
          !url.includes('@') &&
          (url.includes('.') || url.includes('://'))) {
        websiteUrls.push(url);
      }
    });
  }
  
  // Prioritize portfolio-specific URLs
  const portfolioUrl = websiteUrls.find(url => 
    /portfolio|personal|github\.io|herokuapp|netlify|vercel/.test(url.toLowerCase())
  ) || websiteUrls[0];
  
  if (portfolioUrl) {
    // Add protocol if missing
    const finalUrl = portfolioUrl.startsWith('http') ? portfolioUrl : `https://${portfolioUrl}`;
    structuredData.personalInfo.website = finalUrl;
    console.log('🌐 Found website/portfolio:', finalUrl);
  }

  // Extract separate portfolio information
  const portfolioKeywords = ['portfolio', 'github', 'personal website', 'personal site', 'projects site'];
  for (const keyword of portfolioKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b\\s*[:]\s*([^\s\n]+)`, 'i');
    const portfolioMatch = text.match(regex);
    if (portfolioMatch && portfolioMatch[1] && !structuredData.personalInfo.portfolio) {
      let portfolioLink = portfolioMatch[1].trim();
      portfolioLink = portfolioLink.startsWith('http') ? portfolioLink : `https://${portfolioLink}`;
      structuredData.personalInfo.portfolio = portfolioLink;
      console.log('💼 Found portfolio:', portfolioLink);
      break;
    }
  }

  // === SECTION 2: PROFESSIONAL SUMMARY/OBJECTIVE ===
  console.log('📝 Extracting professional summary...');

  // Extract professional summary (look for summary/objective sections)
  const summaryKeywords = ['summary', 'objective', 'profile', 'about', 'overview', 'introduction'];
  for (const keyword of summaryKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    const summaryIndex = text.search(regex);
    if (summaryIndex !== -1) {
      // Extract text after the keyword up to next section
      const afterSummary = text.substring(summaryIndex + keyword.length);
      const nextSection = afterSummary.search(/\b(experience|education|skills|work|employment|projects|certifications)\b/i);
      const summaryText = nextSection > 0 ? 
        afterSummary.substring(0, nextSection) : 
        afterSummary.substring(0, 600);
      
      const cleanSummary = summaryText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.length > 10 && !line.match(/^[A-Z\s]+$/)) // Skip all-caps headers
        .join(' ')
        .substring(0, 500);
      
      if (cleanSummary.length > 20) {
        structuredData.summary = cleanSummary.trim();
        structuredData.sections.summary = cleanSummary.trim();
        console.log('📝 Found summary:', cleanSummary.substring(0, 100) + '...');
        break;
      }
    }
  }

  // === SECTION 3: SKILLS EXTRACTION ===
  console.log('🎯 Extracting skills comprehensively...');

  // Enhanced technical and soft skills database
  const skillCategories = {
    programming: [
      'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift',
      'kotlin', 'scala', 'typescript', 'dart', 'perl', 'r', 'matlab', 'sql', 'plsql'
    ],
    frontend: [
      'html', 'css', 'react', 'angular', 'vue.js', 'svelte', 'jquery', 'bootstrap',
      'tailwind css', 'sass', 'less', 'webpack', 'vite', 'parcel'
    ],
    backend: [
      'node.js', 'express.js', 'django', 'flask', 'spring boot', 'laravel', 'rails',
      'asp.net', 'fastapi', 'nestjs', 'koa.js', '.net core'
    ],
    databases: [
      'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server',
      'dynamodb', 'cassandra', 'neo4j', 'firebase'
    ],
    cloud: [
      'aws', 'azure', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'terraform',
      'ansible', 'vagrant', 'heroku', 'netlify', 'vercel'
    ],
    tools: [
      'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack', 'trello',
      'asana', 'notion', 'figma', 'sketch', 'adobe photoshop', 'illustrator'
    ],
    soft: [
      'project management', 'leadership', 'communication', 'teamwork', 'problem solving',
      'analytical thinking', 'strategic planning', 'data analysis', 'process improvement',
      'agile', 'scrum', 'kanban', 'time management', 'critical thinking'
    ],
    office: [
      'microsoft office', 'excel', 'powerpoint', 'word', 'google workspace',
      'google sheets', 'google docs', 'outlook', 'teams'
    ]
  };
  
  const foundSkills = new Set();
  const skillsByCategory = {};

  // Search for skills in text
  Object.entries(skillCategories).forEach(([category, skills]) => {
    skillsByCategory[category] = [];
    skills.forEach(skill => {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (regex.test(text)) {
        const formattedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
        foundSkills.add(formattedSkill);
        skillsByCategory[category].push(formattedSkill);
      }
    });
  });

  // Look for dedicated skills section
  const skillsSectionPatterns = [
    /(?:technical\s+)?skills?\s*[:]\s*(.*?)(?=\n\s*[A-Z][A-Za-z\s]+:|$)/gis,
    /(?:core\s+)?competencies?\s*[:]\s*(.*?)(?=\n\s*[A-Z][A-Za-z\s]+:|$)/gis,
    /technologies?\s*[:]\s*(.*?)(?=\n\s*[A-Z][A-Za-z\s]+:|$)/gis,
    /expertise\s*[:]\s*(.*?)(?=\n\s*[A-Z][A-Za-z\s]+:|$)/gis
  ];

  for (const pattern of skillsSectionPatterns) {
    const matches = [...text.matchAll(pattern)];
    matches.forEach(match => {
      if (match[1]) {
        // Parse comma-separated, bullet-point, or line-separated skills
        const skillsText = match[1];
        const extractedSkills = skillsText
          .split(/[,\n•\-\|]/)
          .map(skill => skill.trim())
          .filter(skill => skill && skill.length > 2 && skill.length < 30 && !/^\d+$/.test(skill))
          .slice(0, 15); // Limit to reasonable number

        extractedSkills.forEach(skill => {
          foundSkills.add(skill);
        });
      }
    });
  }

  structuredData.skills = [...foundSkills].slice(0, 25); // Limit total skills
  structuredData.sections.skills = {
    all: structuredData.skills,
    byCategory: skillsByCategory
  };
  
  console.log('🎯 Found skills:', structuredData.skills.length, 'skills');
  console.log('🎯 Skills preview:', structuredData.skills.slice(0, 10));

  // === SECTION 4: WORK EXPERIENCE ===
  console.log('💼 Extracting work experience...');

  const experienceKeywords = ['experience', 'work', 'employment', 'career', 'professional', 'positions', 'roles'];
  const experienceEntries = [];

  for (const keyword of experienceKeywords) {
    const regex = new RegExp(`\\b${keyword}\\s+(?:history)?\\b`, 'i');
    const expIndex = text.search(regex);
    if (expIndex !== -1) {
      const afterExp = text.substring(expIndex);
      const nextSection = afterExp.search(/\b(education|skills|projects|certifications|awards)\b/i);
      const expText = nextSection > 0 ? afterExp.substring(0, nextSection) : afterExp.substring(0, 1500);

      // Enhanced job extraction patterns - More precise matching
      const patterns = [
        // Pattern 1: Job Title at Company (Date range) - Stricter matching
        /([A-Z][a-zA-Z\s]{2,40}(?:Developer|Engineer|Manager|Analyst|Designer|Consultant|Director|Lead|Senior|Junior|Associate|Coordinator|Specialist|Executive|Officer))\s+(?:at|@)\s+([A-Z][a-zA-Z\s&,.-]{2,50})[\s\n]*(\d{4}.*?(?:\d{4}|present|current))/gi,
        
        // Pattern 2: Job Title | Company | Date - More specific
        /([A-Z][a-zA-Z\s]{2,40}(?:Developer|Engineer|Manager|Analyst|Designer|Consultant|Director|Lead|Senior|Junior|Associate))\s*\|\s*([A-Z][a-zA-Z\s&,.-]{2,50})\s*\|\s*(\d{4}.*?(?:\d{4}|present|current))/gi,
        
        // Pattern 3: Company - Job Title (Date) - Refined
        /([A-Z][a-zA-Z\s&,.-]{2,50}(?:Inc|Ltd|LLC|Corp|Company|Technologies|Solutions|Systems))\s*[-–—]\s*([A-Z][a-zA-Z\s]{2,40}(?:Developer|Engineer|Manager|Analyst))[\s\n]*(\d{4}.*?(?:\d{4}|present|current))/gi,
        
        // Pattern 4: Experience section with clear job entries
        /((?:Software|Web|Frontend|Backend|Full[- ]?Stack|Mobile|Data|DevOps|QA|Senior|Junior|Lead)\s+(?:Developer|Engineer|Analyst|Designer))\s+[-–—]?\s*([A-Z][a-zA-Z\s&,.-]{2,50})?\s*(\d{4}.*?(?:\d{4}|present|current))?/gi,
        
        // Pattern 5: Job positions with years of experience
        /(\d+\+?\s+years?\s+(?:experience\s+)?(?:as|in)\s+)?([A-Z][a-zA-Z\s]{3,40}(?:Developer|Engineer|Manager|Analyst|Designer))(?:\s+at\s+([A-Z][a-zA-Z\s&,.-]{2,50}))?/gi
      ];

      for (const pattern of patterns) {
        const matches = [...expText.matchAll(pattern)];
        matches.forEach((match, index) => {
          const experience = {
            id: Date.now() + index,
            position: pattern === patterns[2] ? match[2].trim() : match[1].trim(), // Swap for company-title pattern
            company: pattern === patterns[2] ? match[1].trim() : match[2].trim(),
            duration: match[3] ? match[3].trim() : '',
            location: '',
            current: /present|current/i.test(match[3] || ''),
            description: []
          };

          // Try to extract job description/responsibilities
          const jobStart = expText.indexOf(match[0]);
          const nextJobMatch = expText.substring(jobStart + match[0].length).search(/[A-Z][a-zA-Z\s&,.-]{3,50}\s+(?:at|@|\-)/);
          const descText = nextJobMatch > 0 ? 
            expText.substring(jobStart + match[0].length, jobStart + match[0].length + nextJobMatch) :
            expText.substring(jobStart + match[0].length, jobStart + match[0].length + 400);

          // Extract bullet points or responsibilities
          const responsibilities = descText
            .split(/\n/)
            .map(line => line.trim())
            .filter(line => line && 
              (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || 
               line.match(/^[A-Z][a-z]/)) &&
              line.length > 10 && line.length < 200)
            .slice(0, 5)
            .map(line => line.replace(/^[•\-*]\s*/, '').trim());

          experience.description = responsibilities;
          experienceEntries.push(experience);
        });
      }
      break;
    }
  }

  structuredData.experience = experienceEntries.slice(0, 8); // Limit to 8 entries
  structuredData.sections.experience = structuredData.experience;
  console.log('💼 Found experience entries:', structuredData.experience.length);

  // === SECTION 5: EDUCATION ===
  console.log('🎓 Extracting education...');

  const educationKeywords = ['education', 'academic', 'qualification', 'degree', 'university', 'college'];
  const educationEntries = [];

  for (const keyword of educationKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    const eduIndex = text.search(regex);
    if (eduIndex !== -1) {
      const afterEdu = text.substring(eduIndex);
      const nextSection = afterEdu.search(/\b(experience|skills|projects|certifications|achievements)\b/i);
      const eduText = nextSection > 0 ? afterEdu.substring(0, nextSection) : afterEdu.substring(0, 800);

      // Enhanced Education patterns - Including Higher Secondary and Matriculation
      const eduPatterns = [
        // Pattern 1: Full degree names with proper case handling
        /(MCA|Master of Computer Applications?|Masters? in Computer Applications?|Masters? of Computer Applications?)\s*(?:in|from|at)?\s*([A-Za-z\s&,.-]{2,80})?\s*(?:,\s*)?([A-Za-z\s&,.-]{5,80})?\s*(?:,\s*)?(\d{4}(?:\s*[-–—to]\s*(?:\d{4}|present))?)?/gi,
        
        // Pattern 2: BSc/Bachelor's patterns
        /(BSc|B\.Sc|Bachelor of Science|Bachelors? of Science|Bachelor in Science)\s*(?:in|of)?\s*([A-Za-z\s&,.-]{2,80})?\s*(?:,\s*)?([A-Za-z\s&,.-]{5,80})?\s*(?:,\s*)?(\d{4}(?:\s*[-–—to]\s*(?:\d{4}|present))?)?/gi,
        
        // Pattern 3: BA/Bachelor of Arts patterns
        /(BA|B\.A|Bachelor of Arts|Bachelors? of Arts|Bachelor in Arts)\s*(?:in|of)?\s*([A-Za-z\s&,.-]{2,80})?\s*(?:,\s*)?([A-Za-z\s&,.-]{5,80})?\s*(?:,\s*)?(\d{4}(?:\s*[-–—to]\s*(?:\d{4}|present))?)?/gi,
        
        // Pattern 4: MA/Master's patterns  
        /(MA|M\.A|Master of Arts|Masters? of Arts|Master in Arts)\s*(?:in|of)?\s*([A-Za-z\s&,.-]{2,80})?\s*(?:,\s*)?([A-Za-z\s&,.-]{5,80})?\s*(?:,\s*)?(\d{4}(?:\s*[-–—to]\s*(?:\d{4}|present))?)?/gi,
        
        // Pattern 5: BTech/Engineering patterns
        /(BTech|B\.Tech|Bachelor of Technology|Bachelors? of Technology|BE|B\.E|Bachelor of Engineering|Bachelors? of Engineering)\s*(?:in|of)?\s*([A-Za-z\s&,.-]{2,80})?\s*(?:,\s*)?([A-Za-z\s&,.-]{5,80})?\s*(?:,\s*)?(\d{4}(?:\s*[-–—to]\s*(?:\d{4}|present))?)?/gi,
        
        // Pattern 6: MTech/MS patterns
        /(MTech|M\.Tech|Master of Technology|Masters? of Technology|MS|M\.S|Master of Science|Masters? of Science)\s*(?:in|of)?\s*([A-Za-z\s&,.-]{2,80})?\s*(?:,\s*)?([A-Za-z\s&,.-]{5,80})?\s*(?:,\s*)?(\d{4}(?:\s*[-–—to]\s*(?:\d{4}|present))?)?/gi,
        
        // Pattern 7: MBA/Business patterns
        /(MBA|Master of Business Administration|Masters? of Business Administration|BBA|Bachelor of Business Administration|Bachelors? of Business Administration)\s*(?:in|of)?\s*([A-Za-z\s&,.-]{2,80})?\s*(?:,\s*)?([A-Za-z\s&,.-]{5,80})?\s*(?:,\s*)?(\d{4}(?:\s*[-–—to]\s*(?:\d{4}|present))?)?/gi,
        
        // Pattern 8: BCA/Computer Applications patterns
        /(BCA|Bachelor of Computer Applications?|Bachelors? of Computer Applications?|Bachelor in Computer Applications?)\s*(?:in|from|at)?\s*([A-Za-z\s&,.-]{2,80})?\s*(?:,\s*)?([A-Za-z\s&,.-]{5,80})?\s*(?:,\s*)?(\d{4}(?:\s*[-–—to]\s*(?:\d{4}|present))?)?/gi,
        
        // Pattern 9: Higher Secondary / 12th Grade patterns
        /(Higher Secondary|Higher Secondary Education|12th|Class XII|Class 12|XII|Plus Two|\+2|Intermediate|Pre[-\s]?University|PUC)\s*(?:in|with)?\s*([A-Za-z\s&,.-]{2,80})?\s*(?:from|at)?\s*([A-Za-z\s&,.-]{5,80})?\s*(?:,\s*)?(\d{4}(?:\s*[-–—to]\s*(?:\d{4}|present))?)?/gi,
        
        // Pattern 10: Matriculation / 10th Grade patterns
        /(Matriculation|SSLC|10th|Class X|Class 10|X|Secondary|High School)\s*(?:in|with)?\s*([A-Za-z\s&,.-]{2,80})?\s*(?:from|at)?\s*([A-Za-z\s&,.-]{5,80})?\s*(?:,\s*)?(\d{4}(?:\s*[-–—to]\s*(?:\d{4}|present))?)?/gi,
        
        // Pattern 11: Generic degree patterns with institution
        /([A-Z][a-zA-Z\s&,.-]{5,80})\s*[-–—]\s*(MCA|BSc|BA|MA|BTech|MTech|MS|MBA|BCA|B\.Tech|M\.Tech|B\.Sc|M\.Sc|B\.A|M\.A|Bachelor|Master|PhD|Higher Secondary|Matriculation|12th|10th)\s*(?:in|of)?\s*([A-Za-z\s&,.-]{0,60})[\s\n,]*(\d{4}(?:\s*[-–—to]\s*(?:\d{4}|present))?)?/gi
      ];

      for (const pattern of eduPatterns) {
        const matches = [...eduText.matchAll(pattern)];
        matches.forEach((match, index) => {
          let education = {
            id: Date.now() + index + Math.random(),
            degree: '',
            field: '',
            institution: '',
            year: '',
            gpa: ''
          };

          // Handle different pattern matches more intelligently
          if (pattern === eduPatterns[10]) {
            // Institution - Degree pattern (Pattern 11)
            education.institution = match[1].trim();
            education.degree = match[2].trim();
            education.field = match[3] ? match[3].trim() : '';
            education.year = match[4] ? match[4].trim() : '';
          } else {
            // Standard patterns (Patterns 1-10)
            education.degree = match[1].trim();
            
            // Clean field extraction - remove location info
            let field = match[2] ? match[2].trim() : '';
            let institution = match[3] ? match[3].trim() : '';
            let year = match[4] ? match[4].trim() : '';
            
            // Special handling for Higher Secondary and Matriculation
            if (education.degree.toLowerCase().includes('higher secondary') || 
                education.degree.toLowerCase().includes('12th') ||
                education.degree.toLowerCase().includes('matriculation') ||
                education.degree.toLowerCase().includes('10th')) {
              
              // For school education, field might be the stream/group
              if (field && (field.toLowerCase().includes('science') || 
                           field.toLowerCase().includes('commerce') || 
                           field.toLowerCase().includes('arts') ||
                           field.toLowerCase().includes('pcm') ||
                           field.toLowerCase().includes('pcb') ||
                           field.toLowerCase().includes('humanities'))) {
                education.field = field;
              } else if (field && (field.toLowerCase().includes('school') || 
                                  field.toLowerCase().includes('board') ||
                                  field.toLowerCase().includes('university') ||
                                  field.toLowerCase().includes('college'))) {
                if (!institution) institution = field;
                field = '';
              }
            } else {
              // For college/university degrees
              if (field && (field.includes(',') || field.toLowerCase().includes('university') || 
                           field.toLowerCase().includes('college') || field.toLowerCase().includes('institute'))) {
                if (!institution || institution.length < field.length) {
                  institution = field;
                  field = '';
                }
              }
            }
            
            // Clean up field to remove unwanted location data
            if (field) {
              field = field
                .replace(/,\s*[A-Z][a-z]+\s*(,\s*[A-Z][a-z]+)*$/g, '') // Remove trailing locations
                .replace(/^\s*,\s*/, '') // Remove leading comma
                .replace(/\s*,\s*$/, '') // Remove trailing comma
                .trim();
              
              // If field is too short or looks like a location, clear it
              if (field.length < 3 || /^[A-Z][a-z]{2,3}$/.test(field)) {
                field = '';
              }
            }
            
            education.field = field;
            education.institution = institution;
            education.year = year;
          }

          // Clean up degree names for consistency
          const degreeMap = {
            'BSC': 'BSc',
            'B.SC': 'BSc', 
            'BACHELOR OF SCIENCE': 'Bachelor of Science',
            'BA': 'BA',
            'B.A': 'BA',
            'BACHELOR OF ARTS': 'Bachelor of Arts',
            'MA': 'MA',
            'M.A': 'MA',
            'MASTER OF ARTS': 'Master of Arts',
            'MCA': 'MCA',
            'MASTER OF COMPUTER APPLICATIONS': 'Master of Computer Applications',
            'BCA': 'BCA',
            'BACHELOR OF COMPUTER APPLICATIONS': 'Bachelor of Computer Applications',
            'HIGHER SECONDARY': 'Higher Secondary',
            'HIGHER SECONDARY EDUCATION': 'Higher Secondary',
            '12TH': '12th Grade',
            'CLASS XII': '12th Grade',
            'CLASS 12': '12th Grade',
            'XII': '12th Grade',
            'PLUS TWO': 'Higher Secondary',
            '+2': 'Higher Secondary',
            'INTERMEDIATE': 'Intermediate',
            'PRE-UNIVERSITY': 'Pre-University',
            'PRE UNIVERSITY': 'Pre-University',
            'PUC': 'Pre-University Course',
            'MATRICULATION': 'Matriculation',
            'SSLC': 'SSLC',
            '10TH': '10th Grade',
            'CLASS X': '10th Grade',
            'CLASS 10': '10th Grade',
            'X': '10th Grade',
            'SECONDARY': 'Secondary Education',
            'HIGH SCHOOL': 'High School'
          };
          
          const upperDegree = education.degree.toUpperCase();
          if (degreeMap[upperDegree]) {
            education.degree = degreeMap[upperDegree];
          }

          // Skip if we don't have essential information
          if (education.degree && (education.institution || education.field || education.year)) {
            educationEntries.push(education);
            console.log('🎓 Education entry:', {
              degree: education.degree,
              field: education.field,
              institution: education.institution,
              year: education.year
            });
          }
        });
      }

      // Try to extract standalone years and match with nearby education text
      const yearPattern = /(\d{4})\s*[-–—]\s*(\d{4}|\d{2}|present)/gi;
      const yearMatches = [...eduText.matchAll(yearPattern)];
      
      // Look for education entries without years and try to match them
      educationEntries.forEach(edu => {
        if (!edu.year && yearMatches.length > 0) {
          // Find the closest year match
          const yearMatch = yearMatches[0];
          if (yearMatch) {
            edu.year = yearMatch[2].toLowerCase() === 'present' ? 
              `${yearMatch[1]} - Present` : 
              `${yearMatch[1]} - ${yearMatch[2].length === 2 ? '20' + yearMatch[2] : yearMatch[2]}`;
          }
        }
      });

      // Try to extract GPA from education text
      const gpaPattern = /GPA\s*:?\s*(\d+\.?\d*)/i;
      const gpaMatch = eduText.match(gpaPattern);
      if (gpaMatch && educationEntries.length > 0) {
        // Assign GPA to the most recent education entry
        educationEntries[educationEntries.length - 1].gpa = gpaMatch[1];
      }
      break;
    }
  }

  structuredData.education = educationEntries.slice(0, 5);
  structuredData.sections.education = structuredData.education;
  console.log('🎓 Found education entries:', structuredData.education.length);

  // === SECTION 6: PROJECTS ===
  console.log('� Extracting projects...');

  const projectKeywords = ['projects', 'portfolio', 'work samples', 'notable work'];
  const projectEntries = [];

  for (const keyword of projectKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    const projIndex = text.search(regex);
    if (projIndex !== -1) {
      const afterProj = text.substring(projIndex);
      const nextSection = afterProj.search(/\b(certifications|achievements|awards|languages|references)\b/i);
      const projText = nextSection > 0 ? afterProj.substring(0, nextSection) : afterProj.substring(0, 800);

      // Enhanced Project extraction patterns - More accurate parsing
      const projectPatterns = [
        // Pattern 1: Project Name - Description (with technologies)
        /([A-Z][a-zA-Z\s]{3,50}(?:System|Application|Website|Platform|Tool|App|Portal|Management|Dashboard|Tracker|Calculator|Game))\s*[-–—:]\s*([A-Za-z\s,.-]{20,200})/gi,
        
        // Pattern 2: Bullet points with project names
        /[•\-*]\s*([A-Z][a-zA-Z\s]{3,50}(?:System|Application|Website|Platform|Tool|App|Portal|Management|Dashboard|Tracker|Calculator|Game))\s*[-–—:]?\s*([A-Za-z\s,.-]{10,150})?/gi,
        
        // Pattern 3: Numbered project lists
        /\d+\.\s*([A-Z][a-zA-Z\s]{3,50}(?:System|Application|Website|Platform|Tool|App|Portal|Management|Dashboard|Tracker|Calculator|Game))\s*[-–—:]?\s*([A-Za-z\s,.-]{10,150})?/gi,
        
        // Pattern 4: Project entries with clear structure
        /(?:Project|Work)\s*[:]\s*([A-Z][a-zA-Z\s]{3,50})\s*[-–—]?\s*([A-Za-z\s,.-]{10,150})?/gi
      ];

      let projectEntries = [];

      for (const pattern of projectPatterns) {
        const matches = [...projText.matchAll(pattern)];
        matches.forEach((match, index) => {
          const project = {
            id: Date.now() + index + Math.random(),
            title: match[1].trim(),
            description: match[2] ? match[2].trim() : match[1].trim(),
            technologies: [],
            url: ''
          };

          // Extract technologies mentioned in project description
          const techMentions = [];
          const commonTechs = [
            'React', 'Node.js', 'Python', 'JavaScript', 'HTML', 'CSS', 'MongoDB', 'SQL', 
            'MySQL', 'PostgreSQL', 'Express', 'Vue.js', 'Angular', 'TypeScript', 'PHP', 
            'Java', 'C++', 'C#', '.NET', 'Django', 'Flask', 'Laravel', 'Bootstrap', 
            'Tailwind', 'jQuery', 'Firebase', 'AWS', 'Docker', 'Git', 'REST API', 'GraphQL'
          ];
          
          const fullText = `${project.title} ${project.description}`.toLowerCase();
          commonTechs.forEach(tech => {
            if (fullText.includes(tech.toLowerCase())) {
              techMentions.push(tech);
            }
          });
          project.technologies = techMentions;

          // Only add if title looks like a real project
          if (project.title.length > 5 && project.title.length < 60 && 
              !project.title.toLowerCase().includes('project') &&
              !/^\d+$/.test(project.title)) {
            projectEntries.push(project);
            console.log('🚀 Project entry:', {
              title: project.title,
              description: project.description.substring(0, 50) + '...',
              technologies: project.technologies
            });
          }
        });
      }

      // Fallback: Extract from structured lines if no patterns matched
      if (projectEntries.length === 0) {
        const projectLines = projText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && line.length > 15 && line.length < 120 &&
            !line.toLowerCase().startsWith('project') &&
            !line.match(/^(skills?|experience|education|certification)/i));

        projectLines.forEach((line, index) => {
          if (index < 8) {
            const project = {
              id: Date.now() + index + Math.random(),
              title: line.split('-')[0].split(':')[0].trim(),
              description: line.includes('-') ? line.split('-').slice(1).join('-').trim() : 
                          line.includes(':') ? line.split(':').slice(1).join(':').trim() : line,
              technologies: [],
              url: ''
            };

            // Extract technologies from the line
            const techMentions = [];
            const commonTechs = ['React', 'Node.js', 'Python', 'JavaScript', 'HTML', 'CSS', 'MongoDB', 'SQL'];
            commonTechs.forEach(tech => {
              if (line.toLowerCase().includes(tech.toLowerCase())) {
                techMentions.push(tech);
              }
            });
            project.technologies = techMentions;

            if (project.title.length > 3) {
              projectEntries.push(project);
            }
          }
        });
      }
      break;
    }
  }

  structuredData.projects = projectEntries;
  structuredData.sections.projects = structuredData.projects;
  console.log('🚀 Found project entries:', structuredData.projects.length);

  // === SECTION 7: CERTIFICATIONS ===
  console.log('🏆 Extracting certifications...');

  const certKeywords = ['certifications', 'certificates', 'credentials', 'licenses'];
  const certEntries = [];

  for (const keyword of certKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    const certIndex = text.search(regex);
    if (certIndex !== -1) {
      const afterCert = text.substring(certIndex);
      const nextSection = afterCert.search(/\b(achievements|awards|languages|references|hobbies)\b/i);
      const certText = nextSection > 0 ? afterCert.substring(0, nextSection) : afterCert.substring(0, 600);

      // Certification patterns
      const certPatterns = [
        // Pattern: Certification Name - Organization (Year)
        /([A-Z][a-zA-Z\s&,.-]{5,60})\s*[-–—]\s*([A-Z][a-zA-Z\s&,.-]{2,50})[\s\n]*(\d{4})?/g,
        // Pattern: Organization: Certification Name
        /([A-Z][a-zA-Z\s&,.-]{2,50})\s*:\s*([A-Z][a-zA-Z\s&,.-]{5,60})/g
      ];

      for (const pattern of certPatterns) {
        const matches = [...certText.matchAll(pattern)];
        matches.forEach((match, index) => {
          const cert = {
            id: Date.now() + index,
            name: pattern === certPatterns[1] ? match[2].trim() : match[1].trim(),
            organization: pattern === certPatterns[1] ? match[1].trim() : match[2].trim(),
            year: match[3] ? match[3].trim() : '',
            expiry: ''
          };
          certEntries.push(cert);
        });
      }
      break;
    }
  }

  structuredData.certifications = certEntries.slice(0, 8);
  structuredData.sections.certifications = structuredData.certifications;
  console.log('🏆 Found certification entries:', structuredData.certifications.length);

  // === SECTION 8: LANGUAGES ===
  console.log('🌍 Extracting languages...');

  const languageKeywords = ['languages', 'linguistic'];
  const commonLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
    'Chinese', 'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Bengali',
    'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'
  ];

  const languageEntries = [];
  
  for (const keyword of languageKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    const langIndex = text.search(regex);
    if (langIndex !== -1) {
      const afterLang = text.substring(langIndex);
      const nextSection = afterLang.search(/\b(hobbies|interests|references|achievements)\b/i);
      const langText = nextSection > 0 ? afterLang.substring(0, nextSection) : afterLang.substring(0, 300);

      commonLanguages.forEach(lang => {
        const langRegex = new RegExp(`\\b${lang}\\b`, 'i');
        if (langRegex.test(langText)) {
          // Try to extract proficiency level
          const proficiencyPattern = new RegExp(`${lang}\\s*[-–—:]?\\s*(native|fluent|advanced|intermediate|basic|conversational)`, 'i');
          const profMatch = langText.match(proficiencyPattern);
          
          languageEntries.push({
            id: Date.now() + Math.random(),
            language: lang,
            proficiency: profMatch ? profMatch[1] : 'Not specified'
          });
        }
      });
      break;
    }
  }

  structuredData.languages = languageEntries.slice(0, 6);
  structuredData.sections.languages = structuredData.languages;
  console.log('🌍 Found language entries:', structuredData.languages.length);

  // === SECTION 9: ACHIEVEMENTS/AWARDS ===
  console.log('🎖️ Extracting achievements...');

  const achievementKeywords = ['achievements', 'awards', 'honors', 'accomplishments', 'recognition'];
  const achievementEntries = [];

  for (const keyword of achievementKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    const achIndex = text.search(regex);
    if (achIndex !== -1) {
      const afterAch = text.substring(achIndex);
      const nextSection = afterAch.search(/\b(references|hobbies|interests)\b/i);
      const achText = nextSection > 0 ? afterAch.substring(0, nextSection) : afterAch.substring(0, 500);

      const achievementLines = achText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.length > 10 && line.length < 150)
        .slice(0, 6);

      achievementLines.forEach((line, index) => {
        if (!line.toLowerCase().includes(keyword.toLowerCase())) {
          achievementEntries.push({
            id: Date.now() + index,
            title: line.split('-')[0].trim(),
            description: line.includes('-') ? line.split('-').slice(1).join('-').trim() : '',
            year: ''
          });
        }
      });
      break;
    }
  }

  structuredData.achievements = achievementEntries;
  structuredData.sections.achievements = structuredData.achievements;
  console.log('🎖️ Found achievement entries:', structuredData.achievements.length);

  // === SECTION 10: HOBBIES/INTERESTS ===
  console.log('🎨 Extracting hobbies and interests...');

  const hobbyKeywords = ['hobbies', 'interests', 'personal interests', 'activities'];
  for (const keyword of hobbyKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    const hobbyIndex = text.search(regex);
    if (hobbyIndex !== -1) {
      const afterHobby = text.substring(hobbyIndex);
      const nextSection = afterHobby.search(/\b(references)\b/i);
      const hobbyText = nextSection > 0 ? afterHobby.substring(0, nextSection) : afterHobby.substring(0, 300);

      const hobbies = hobbyText
        .replace(/hobbies?|interests?/gi, '')
        .split(/[,\n•\-]/)
        .map(hobby => hobby.trim())
        .filter(hobby => hobby && hobby.length > 2 && hobby.length < 30)
        .slice(0, 8);

      structuredData.hobbies = hobbies;
      structuredData.sections.hobbies = hobbies;
      console.log('🎨 Found hobbies:', hobbies.length);
      break;
    }
  }

  // === SECTION 11: REFERENCES ===
  console.log('📋 Extracting references...');
  
  const refIndex = lowerText.search(/\breferences?\b/);
  if (refIndex !== -1) {
    const afterRef = text.substring(refIndex);
    const refText = afterRef.substring(0, 200);
    if (refText.toLowerCase().includes('available upon request') || 
        refText.toLowerCase().includes('provided upon request')) {
      structuredData.references = 'Available upon request';
      structuredData.sections.references = 'Available upon request';
      console.log('📋 Found references note');
    }
  }

  // === COMPREHENSIVE ANALYSIS SUMMARY ===
  console.log('📊 Final comprehensive structured data summary:');
  console.log('👤 Personal Info:', {
    name: structuredData.personalInfo.fullName || 'Not found',
    email: structuredData.personalInfo.email || 'Not found',
    phone: structuredData.personalInfo.phone || 'Not found',
    address: structuredData.personalInfo.address || 'Not found',
    linkedin: structuredData.personalInfo.linkedin || 'Not found',
    website: structuredData.personalInfo.website || 'Not found'
  });
  console.log('📝 Summary:', structuredData.summary ? `${structuredData.summary.substring(0, 100)}...` : 'Not found');
  console.log('🎯 Skills:', `${structuredData.skills?.length || 0} skills found`);
  console.log('💼 Experience:', `${structuredData.experience?.length || 0} positions found`);
  console.log('🎓 Education:', `${structuredData.education?.length || 0} degrees found`);
  console.log('🚀 Projects:', `${structuredData.projects?.length || 0} projects found`);
  console.log('🏆 Certifications:', `${structuredData.certifications?.length || 0} certifications found`);
  console.log('🌍 Languages:', `${structuredData.languages?.length || 0} languages found`);
  console.log('🎖️ Achievements:', `${structuredData.achievements?.length || 0} achievements found`);
  console.log('🎨 Hobbies:', `${structuredData.hobbies?.length || 0} hobbies found`);
  console.log('📋 References:', structuredData.references || 'Not found');

  // Calculate completion percentage
  const sections = ['personalInfo', 'summary', 'skills', 'experience', 'education'];
  const completedSections = sections.filter(section => {
    const data = structuredData[section];
    if (section === 'personalInfo') {
      return Object.keys(data).length > 0;
    }
    return (Array.isArray(data) && data.length > 0) || (typeof data === 'string' && data.length > 0);
  });
  
  const completionPercentage = Math.round((completedSections.length / sections.length) * 100);
  console.log(`✅ Resume extraction completion: ${completionPercentage}% (${completedSections.length}/${sections.length} core sections)`);

  return structuredData;
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 ATS Resume Backend Server started');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Also accessible via http://0.0.0.0:${PORT}`);
  console.log('🔍 Health check: http://localhost:' + PORT + '/health');
  console.log('📄 PDF extraction: POST http://localhost:' + PORT + '/api/extract-pdf-text');
});

module.exports = app;
