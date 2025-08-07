import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// Generate PDF from HTML element
export const generatePDF = async (element, filename = 'resume') => {
  if (!element) {
    throw new Error('No element provided for PDF generation')
  }

  try {
    // Create a temporary container with proper styling for PDF
    const pdfContainer = document.createElement('div')
    pdfContainer.className = 'resume-pdf-container'
    pdfContainer.style.position = 'absolute'
    pdfContainer.style.left = '-9999px'
    pdfContainer.style.top = '0'
    pdfContainer.style.width = '8.5in'
    pdfContainer.style.minHeight = '11in'
    pdfContainer.style.background = 'white'
    pdfContainer.style.padding = '0.5in'
    pdfContainer.style.fontFamily = 'Inter, sans-serif'
    pdfContainer.style.fontSize = '12px'
    pdfContainer.style.lineHeight = '1.4'
    pdfContainer.style.color = '#000000'
    
    // Clone the content and apply PDF-specific styles
    pdfContainer.innerHTML = element.innerHTML
    document.body.appendChild(pdfContainer)

    // Wait a bit for fonts to load
    await new Promise(resolve => setTimeout(resolve, 500))

    // Get the actual content height
    const contentHeight = pdfContainer.scrollHeight
    const contentWidth = 816 // 8.5in * 96 DPI
    
    // Calculate required height (minimum 11 inches, but allow for longer content)
    const minHeight = 1056 // 11in * 96 DPI
    const actualHeight = Math.max(minHeight, contentHeight + 48) // Add some padding

    // Configure html2canvas for better quality and text rendering
    const canvas = await html2canvas(pdfContainer, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: contentWidth,
      height: actualHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: contentWidth,
      windowHeight: actualHeight,
      imageTimeout: 10000,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedContainer = clonedDoc.querySelector('.resume-pdf-container')
        if (clonedContainer) {
          // Apply additional styles to the cloned element
          clonedContainer.style.transform = 'scale(1)'
          clonedContainer.style.transformOrigin = 'top left'
          clonedContainer.style.position = 'relative'
          clonedContainer.style.left = '0'
          clonedContainer.style.top = '0'
        }
      }
    })

    // Clean up temporary element
    document.body.removeChild(pdfContainer)

    // Get the canvas data
    const imgData = canvas.toDataURL('image/png', 1.0)
    
    // Calculate PDF height in inches
    const pdfWidth = 8.5
    const pdfHeight = Math.max(11, actualHeight / 96) // Convert pixels to inches, minimum 11"
    
    // Create PDF with dynamic dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: [pdfWidth, pdfHeight],
      compress: true
    })

    // Add the image to PDF at exact size
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST')

    // Save the PDF
    pdf.save(`${filename.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`)
    
    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF. Please try again.')
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
    
    // A4 dimensions in pixels (approximate)
    const a4WidthPx = 794
    const a4HeightPx = 1123
    
    const pdf = new jsPDF('portrait', 'px', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    // Calculate how to fit the image
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const scaledWidth = imgWidth * ratio
    const scaledHeight = imgHeight * ratio
    
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
