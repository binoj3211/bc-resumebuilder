import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// Generate PDF from HTML element
export const generatePDF = async (element, filename = 'resume') => {
  if (!element) {
    throw new Error('No element provided for PDF generation')
  }

  try {
    // Find the actual template content within the preview element
    const templateContent = element.querySelector('.template-content') || element.querySelector('.a4-preview-container > div') || element.querySelector('.a4-preview-container') || element

    // Temporarily remove any scaling for accurate capture
    const originalTransform = templateContent.style.transform
    const container = templateContent.closest('.a4-preview-container')
    const originalContainerTransform = container ? container.style.transform : ''
    
    // Remove scaling temporarily
    if (container) container.style.transform = 'scale(1)'
    templateContent.style.transform = 'scale(1)'

    // Wait a moment for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100))

    // Configure html2canvas for optimal PDF capture
    const canvas = await html2canvas(templateContent, {
      scale: 2, // Good quality but not too heavy
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      imageTimeout: 15000,
      logging: false,
      letterRendering: true,
      onclone: (clonedDoc) => {
        // Apply PDF-specific styles to the cloned document
        const style = clonedDoc.createElement('style')
        style.textContent = `
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .a4-preview-container, 
          .a4-preview-container > div,
          .template-content {
            transform: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            background: white !important;
            width: 210mm !important;
            min-height: 297mm !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
          }
        `
        clonedDoc.head.appendChild(style)
      }
    })

    // Restore original transforms
    if (container) container.style.transform = originalContainerTransform
    templateContent.style.transform = originalTransform

    // Get the canvas data with maximum quality
    const imgData = canvas.toDataURL('image/png', 1.0)
    
    // Create PDF with exact A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      precision: 2
    })

    // Calculate dimensions to fit the canvas properly
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Add the image to PDF, maintaining aspect ratio
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, 297), undefined, 'FAST')

    // Save the PDF
    pdf.save(`${filename.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`)
    
    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  }
}

// Simple and effective PDF generation
export const generateSimplePDF = async (element, filename = 'resume') => {
  if (!element) {
    throw new Error('No element provided for PDF generation')
  }

  try {
    // Find the template content
    const templateElement = element.querySelector('.template-content') || element

    // Temporarily remove scaling for capture
    const originalTransform = templateElement.style.transform
    const container = templateElement.closest('.a4-preview-container')
    const originalContainerTransform = container ? container.style.transform : ''
    
    if (container) container.style.transform = 'none'
    templateElement.style.transform = 'none'

    // Wait for layout to settle
    await new Promise(resolve => setTimeout(resolve, 500))

    // Capture with optimal settings
    const canvas = await html2canvas(templateElement, {
      scale: 1.5, // Moderate scale for balance of quality and performance
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      logging: false,
      imageTimeout: 15000,
      removeContainer: true,
      onclone: (clonedDoc) => {
        // Ensure all elements have proper A4 sizing
        const allElements = clonedDoc.querySelectorAll('*')
        allElements.forEach(el => {
          const styles = window.getComputedStyle(el)
          if (styles.transform && styles.transform !== 'none') {
            el.style.transform = 'none'
          }
        })
      }
    })

    // Restore original transforms
    if (container) container.style.transform = originalContainerTransform
    templateElement.style.transform = originalTransform

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Get canvas dimensions and calculate scaling to fit A4
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const pdfWidth = 210 // A4 width in mm
    const pdfHeight = 297 // A4 height in mm

    // Calculate aspect ratios
    const canvasAspectRatio = canvasWidth / canvasHeight
    const a4AspectRatio = pdfWidth / pdfHeight

    let finalWidth, finalHeight, xOffset, yOffset

    if (canvasAspectRatio > a4AspectRatio) {
      // Canvas is wider, fit to width
      finalWidth = pdfWidth
      finalHeight = pdfWidth / canvasAspectRatio
      xOffset = 0
      yOffset = (pdfHeight - finalHeight) / 2
    } else {
      // Canvas is taller, fit to height
      finalHeight = pdfHeight
      finalWidth = pdfHeight * canvasAspectRatio
      xOffset = (pdfWidth - finalWidth) / 2
      yOffset = 0
    }

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png', 0.95)
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight)

    // Save PDF
    pdf.save(`${filename.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`)
    
    return true
  } catch (error) {
    console.error('Error generating simple PDF:', error)
    throw error
  }
}

// Generate PDF with multiple pages if content is long
export const generateMultiPagePDF = async (element, filename = 'resume') => {
  if (!element) {
    throw new Error('No element provided for PDF generation')
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    
    // A4 dimensions in pixels (at 96 DPI)
    const a4WidthPx = 794  // 210mm in pixels
    const a4HeightPx = 1123  // 297mm in pixels
    
    const pdf = new jsPDF('portrait', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()  // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight() // 297mm
    
    // Calculate how to fit the image properly on A4
    const ratio = Math.min(pdfWidth / (imgWidth * 25.4 / 96), pdfHeight / (imgHeight * 25.4 / 96))
    const scaledWidth = (imgWidth * 25.4 / 96) * ratio  // Convert pixels to mm
    const scaledHeight = (imgHeight * 25.4 / 96) * ratio // Convert pixels to mm
    
    // Center the image
    const xOffset = (pdfWidth - scaledWidth) / 2
    const yOffset = 0
    
    // If content fits in one page
    if (scaledHeight <= pdfHeight) {
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight)
    } else {
      // Multiple pages needed
      let position = 0
      let pageCount = 0
      
      while (position < scaledHeight) {
        if (pageCount > 0) {
          pdf.addPage()
        }
        
        const remainingHeight = scaledHeight - position
        const pageHeight = Math.min(pdfHeight, remainingHeight)
        
        // Create a temporary canvas for this page
        const pageCanvas = document.createElement('canvas')
        pageCanvas.width = canvas.width
        pageCanvas.height = (canvas.height * pageHeight) / scaledHeight
        
        const pageCtx = pageCanvas.getContext('2d')
        pageCtx.drawImage(
          canvas,
          0, (position / ratio),
          canvas.width, (pageHeight / ratio),
          0, 0,
          canvas.width, (pageHeight / ratio)
        )
        
        const pageImgData = pageCanvas.toDataURL('image/png')
        pdf.addImage(pageImgData, 'PNG', xOffset, 0, scaledWidth, pageHeight)
        
        position += pdfHeight
        pageCount++
      }
    }

    pdf.save(`${filename}.pdf`)
    return true
  } catch (error) {
    console.error('Error generating multi-page PDF:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  }
}

// Export resume data as JSON for backup
export const exportResumeData = (resumeData, filename = 'resume-data') => {
  const dataStr = JSON.stringify(resumeData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = `${filename}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

// Import resume data from JSON file
export const importResumeData = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'))
      return
    }
    
    if (file.type !== 'application/json') {
      reject(new Error('Invalid file type. Please select a JSON file.'))
      return
    }
    
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        resolve(data)
      } catch (error) {
        reject(new Error('Invalid JSON format'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }
    
    reader.readAsText(file)
  })
}

// Convert resume to plain text format
export const generateTextVersion = (resumeData) => {
  let text = ''
  
  // Header
  if (resumeData.personalInfo?.fullName) {
    text += `${resumeData.personalInfo.fullName.toUpperCase()}\n`
    text += '='.repeat(resumeData.personalInfo.fullName.length) + '\n\n'
  }
  
  // Contact Info
  const contact = []
  if (resumeData.personalInfo?.email) contact.push(`Email: ${resumeData.personalInfo.email}`)
  if (resumeData.personalInfo?.phone) contact.push(`Phone: ${resumeData.personalInfo.phone}`)
  if (resumeData.personalInfo?.location) contact.push(`Location: ${resumeData.personalInfo.location}`)
  if (resumeData.personalInfo?.linkedin) contact.push(`LinkedIn: ${resumeData.personalInfo.linkedin}`)
  if (resumeData.personalInfo?.website) contact.push(`Website: ${resumeData.personalInfo.website}`)
  
  if (contact.length > 0) {
    text += contact.join(' | ') + '\n\n'
  }
  
  // Summary
  if (resumeData.summary) {
    text += 'SUMMARY\n-------\n'
    text += resumeData.summary + '\n\n'
  }
  
  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    text += 'EXPERIENCE\n----------\n'
    resumeData.experience.forEach(exp => {
      text += `${exp.position} at ${exp.company}\n`
      if (exp.location) text += `${exp.location} | `
      text += `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}\n`
      if (exp.description) {
        text += exp.description.split('\n').map(line => `  ${line}`).join('\n') + '\n'
      }
      text += '\n'
    })
  }
  
  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    text += 'EDUCATION\n---------\n'
    resumeData.education.forEach(edu => {
      text += `${edu.degree} in ${edu.field}\n`
      text += `${edu.institution}`
      if (edu.location) text += ` | ${edu.location}`
      text += `\n${edu.startDate || ''} - ${edu.endDate || ''}\n`
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`
      if (edu.honors) text += `Honors: ${edu.honors}\n`
      text += '\n'
    })
  }
  
  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    text += 'SKILLS\n------\n'
    const skillsByCategory = resumeData.skills.reduce((groups, skill) => {
      const category = skill.category || 'Other'
      if (!groups[category]) groups[category] = []
      groups[category].push(skill.name)
      return groups
    }, {})
    
    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      text += `${category}: ${skills.join(', ')}\n`
    })
    text += '\n'
  }
  
  return text
}

// Download text version
export const downloadTextVersion = (resumeData, filename = 'resume') => {
  const textContent = generateTextVersion(resumeData)
  const blob = new Blob([textContent], { type: 'text/plain' })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
