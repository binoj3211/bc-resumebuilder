<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ATS Resume Builder - Copilot Instructions

This is a React.js application for building ATS-friendly resumes with analysis capabilities.

## Project Structure
- **React + Vite**: Modern React setup with fast development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful icons library
- **HTML2Canvas + jsPDF**: For PDF generation functionality
- **Component Architecture**: Modular component structure

## Key Features
- Multiple resume templates (Modern, Classic, Creative, Executive)
- Real-time ATS compatibility scoring
- Resume analysis with suggestions
- PDF export functionality
- Drag-and-drop file upload
- Form validation and data persistence
- Mobile-responsive design

## Coding Guidelines
- Use functional components with React hooks
- Follow Tailwind CSS utility classes for styling
- Implement proper error handling for file operations
- Use semantic HTML for accessibility
- Maintain consistent TypeScript/JavaScript patterns
- Follow React best practices for state management

## Component Structure
- `/components` - Reusable UI components
- `/components/forms` - Form-specific components
- `/templates` - Resume template components
- `/utils` - Utility functions for ATS analysis and PDF generation
- `/hooks` - Custom React hooks (if needed)

## Styling Notes
- Primary color: Blue (blue-600)
- Secondary color: Purple (purple-600)
- Use consistent spacing with Tailwind classes
- Implement hover states and transitions
- Ensure good contrast for accessibility

## Testing Considerations
- Test PDF generation across different browsers
- Verify ATS analysis accuracy
- Test responsive design on various screen sizes
- Validate form inputs properly
- Test file upload functionality

When making changes:
1. Maintain existing design patterns
2. Ensure ATS-friendly formatting in templates
3. Keep components modular and reusable
4. Update corresponding utility functions when adding features
5. Test PDF export after template changes
