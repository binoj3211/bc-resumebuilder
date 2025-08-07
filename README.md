# ATS Resume Builder 🚀

A free, open-source ATS-friendly resume builder built with React.js. Create professional resumes that pass Applicant Track# ATS Resume Builder

A free, open-source ATS-friendly resume builder built with React and Vite. Create professional resumes that pass Applicant Tracking Systems (ATS) and get you hired.

## 🚀 Features

### Core Features
- **Multiple Professional Templates**: Choose from Modern, Classic, Creative, and Executive designs
- **Real-time Preview**: See your resume update as you type
- **ATS Score Analysis**: Get real-time feedback on ATS compatibility
- **PDF Export**: Download your resume as a professional PDF
- **Resume Analysis**: Upload existing resumes for ATS compatibility analysis

### Authentication Features
- **User Accounts**: Sign up with email or Google OAuth
- **Resume Management**: Save, edit, and manage multiple resumes
- **User Dashboard**: Access all your saved resumes in one place
- **Google OAuth Integration**: Quick sign-in with your Google account

### Technical Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Built with Tailwind CSS and Lucide React icons
- **Fast Development**: Powered by Vite for lightning-fast builds
- **Type-Safe**: Built with modern React patterns

## 🛠️ Technologies Used

- **Frontend**: React 19.1.1, Vite, Tailwind CSS
- **Authentication**: Google OAuth, JWT tokens
- **PDF Generation**: html2canvas + jsPDF
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Context API

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ats-resume-builder.git
   cd ats-resume-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Google OAuth Client ID (see GOOGLE_OAUTH_SETUP.md for details)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5174`

## 📋 Usage

### Building a Resume
1. Click "Start Building" on the homepage
2. Fill in your personal information, experience, education, and skills
3. Choose from 4 professional templates
4. Watch your ATS score improve in real-time
5. Download as PDF or save to your account

### Analyzing a Resume
1. Click "Analyze Existing Resume"
2. Upload your current resume (PDF, DOC, DOCX)
3. Get detailed ATS compatibility analysis
4. Receive suggestions for improvements

### User Account Features
1. Sign up with email or Google
2. Save unlimited resumes
3. Access your dashboard to manage all resumes
4. Edit and update existing resumes

## 🎨 Templates

- **Modern**: Clean, contemporary design perfect for tech and creative roles
- **Classic**: Traditional format ideal for corporate and formal positions
- **Creative**: Unique layout for designers and creative professionals
- **Executive**: Professional format for senior-level positions

## 📊 ATS Analysis

Our intelligent ATS analyzer checks for:
- Keyword optimization
- Formatting compatibility
- Section completeness
- Contact information
- Skills relevance
- Overall structure

## 🔧 Configuration

### Google OAuth Setup
See `GOOGLE_OAUTH_SETUP.md` for detailed instructions on setting up Google OAuth authentication.

### Environment Variables
- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `VITE_API_BASE_URL`: Backend API URL (optional)

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more information.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues on GitHub
3. Create a new issue with detailed information

## 🌟 Acknowledgments

- Built with ❤️ for job seekers worldwide
- Inspired by the need for accessible, ATS-friendly resume building tools
- Thanks to all contributors and users

---

**Made with ❤️ by the ATS Resume Builder team**

Happy job hunting! 🎯ems and help you land your dream job.

![ATS Resume Builder](https://img.shields.io/badge/Status-Ready%20to%20Use-brightgreen)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.x-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🎯 ATS-Optimized**: Built-in ATS compatibility analysis with real-time scoring
- **📊 Smart Analysis**: Upload your existing resume for detailed feedback and suggestions  
- **🎨 Multiple Templates**: Choose from Modern, Classic, Creative, and Executive designs
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **📄 Export Options**: Download as PDF, Word document, or plain text
- **🔒 Privacy First**: All data stays on your device - no servers, no data collection
- **⚡ Real-time Preview**: See your changes instantly with live preview
- **🆓 100% Free**: No hidden costs, premium features, or subscription required

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ats-resume-builder.git
   cd ats-resume-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

## 📋 Tech Stack

- **Frontend**: React 19.1.1 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Generation**: html2canvas + jsPDF
- **Drag & Drop**: @dnd-kit
- **Forms**: Native HTML5 with validation

## 🎨 Templates

### Modern Professional
Clean and contemporary design with subtle blue accents, perfect for tech and business roles.

### Classic Traditional  
Timeless black and white layout ideal for conservative industries like finance and law.

### Creative Minimal
Bold purple design with creative elements, great for design and marketing positions.

### Executive Elegant
Sophisticated green-accented design perfect for senior leadership roles.

## 🔍 ATS Analysis Features

- **Contact Information Validation**: Ensures all essential details are present
- **Keyword Optimization**: Analyzes industry-relevant keywords and action verbs
- **Format Compliance**: Checks for ATS-friendly formatting and structure
- **Section Completeness**: Validates presence of key resume sections
- **Real-time Scoring**: Get instant feedback with scores from 0-100
- **Improvement Suggestions**: Detailed recommendations to boost your ATS score

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── forms/          # Form components for each section
│   ├── Header.jsx      # Navigation header
│   ├── Hero.jsx        # Landing page hero section
│   ├── Features.jsx    # Features showcase
│   ├── ResumeBuilder.jsx    # Main resume builder interface
│   ├── ResumeAnalyzer.jsx   # Resume analysis tool
│   └── ResumePreview.jsx    # Live preview component
├── templates/          # Resume template components
│   ├── ModernTemplate.jsx
│   ├── ClassicTemplate.jsx
│   ├── CreativeTemplate.jsx
│   └── ExecutiveTemplate.jsx
├── utils/              # Utility functions
│   ├── atsAnalyzer.js  # ATS analysis logic
│   └── pdfGenerator.js # PDF export functionality
└── hooks/              # Custom React hooks
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] More resume templates
- [ ] LinkedIn import functionality  
- [ ] Cover letter builder
- [ ] Multi-language support
- [ ] Advanced ATS analysis
- [ ] Dark mode theme
- [ ] Resume comparison tool

## 🐛 Bug Reports

Found a bug? Please open an issue on GitHub with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you land your dream job!

## 📞 Support

- Create an issue for bug reports or feature requests
- Star the repository if you find it helpful
- Share with others who might benefit

---

**Built with ❤️ for job seekers everywhere**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
