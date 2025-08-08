// Print to PDF utility using browser's native print functionality
export const printToPDF = () => {
  // Create comprehensive print styles
  const printStyle = document.createElement('style')
  printStyle.id = 'resume-print-styles'
  printStyle.textContent = `
    @media print {
      /* Hide everything except the resume */
      body * {
        visibility: hidden !important;
      }
      
      .resume-container,
      .resume-container *,
      .a4-preview-container,
      .a4-preview-container *,
      .template-content,
      .template-content * {
        visibility: visible !important;
      }
      
      /* Reset body for print */
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
        font-family: 'Inter', Arial, sans-serif !important;
      }
      
      /* Position resume container for print */
      .resume-container {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 210mm !important;
        height: 297mm !important;
        margin: 0 !important;
        padding: 0 !important;
        transform: none !important;
        background: white !important;
        overflow: visible !important;
      }
      
      /* A4 container for print */
      .a4-preview-container {
        position: relative !important;
        width: 210mm !important;
        height: 297mm !important;
        margin: 0 !important;
        padding: 0 !important;
        transform: none !important;
        box-shadow: none !important;
        overflow: visible !important;
        background: white !important;
      }
      
      /* Template content for print */
      .template-content {
        position: relative !important;
        width: 210mm !important;
        height: 297mm !important;
        margin: 0 !important;
        padding: 15mm !important;
        transform: none !important;
        background: white !important;
        overflow: visible !important;
        box-sizing: border-box !important;
      }
      
      /* Page settings */
      @page {
        size: A4;
        margin: 0;
      }
      
      /* Ensure all content is properly displayed */
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
        box-sizing: border-box !important;
      }
      
      /* Remove any interfering transforms */
      * {
        transform: none !important;
      }
    }
  `
  
  // Add the print styles
  document.head.appendChild(printStyle)
  
  // Small delay to ensure styles are applied
  setTimeout(() => {
    // Trigger print dialog
    window.print()
    
    // Remove the print styles after printing
    setTimeout(() => {
      const existingStyle = document.getElementById('resume-print-styles')
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }, 1000)
  }, 100)
}

// Alternative: Generate PDF using html2canvas with better settings
export const generateOptimizedPDF = async (element, filename = 'resume') => {
  const { default: html2canvas } = await import('html2canvas')
  const { default: jsPDF } = await import('jspdf')

  if (!element) {
    throw new Error('No element provided for PDF generation')
  }

  try {
    // Get the template content directly
    const templateContent = element.querySelector('.template-content') || element
    
    // Create a clone for PDF generation
    const clone = templateContent.cloneNode(true)
    clone.style.position = 'absolute'
    clone.style.left = '-9999px'
    clone.style.top = '0'
    clone.style.width = '210mm'
    clone.style.minHeight = '297mm'
    clone.style.transform = 'none'
    clone.style.backgroundColor = 'white'
    clone.style.padding = '15mm'
    clone.style.boxSizing = 'border-box'
    
    document.body.appendChild(clone)
    
    // Wait for layout
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Generate canvas
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 10000,
      removeContainer: true
    })
    
    // Clean up
    document.body.removeChild(clone)
    
    // Create PDF
    const pdf = new jsPDF('portrait', 'mm', 'a4')
    const imgWidth = 210
    const imgHeight = 297
    
    const imgData = canvas.toDataURL('image/png', 1.0)
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    
    // Save
    pdf.save(`${filename.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`)
    
    return true
  } catch (error) {
    console.error('Error generating optimized PDF:', error)
    throw error
  }
}
