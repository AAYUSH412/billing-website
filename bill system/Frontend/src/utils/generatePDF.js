import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const generateInvoicePDF = async (orderData, shopDetails) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { height } = page.getSize();
  
  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Helper function for text drawing
  const drawText = (text, { x, y, size = 12, font = regularFont, color = rgb(0, 0, 0) }) => {
    page.drawText(text, { x, y, size, font, color });
  };

  // Draw lines helper
  const drawLine = (startX, startY, endX, endY) => {
    page.drawLine({
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });
  };

  // Header Section
  drawText('INVOICE', { x: 250, y: height - 50, size: 28, font: boldFont });
  drawText(shopDetails.name, { x: 240, y: height - 80, size: 20, font: boldFont });

  // Invoice Details Section
  const invoiceNo = `INV-${Date.now()}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Customer Information (Left Side)
  drawText('Invoice to:', { x: 50, y: height - 130, size: 14, font: boldFont });
  drawText(orderData.name.toUpperCase(), { x: 50, y: height - 150 });
  drawText(orderData.phone, { x: 50, y: height - 170 });

  // Invoice Information (Right Side)
  drawText(`Invoice No: ${invoiceNo}`, { x: 350, y: height - 130, font: boldFont });
  drawText(`Date: ${currentDate}`, { x: 350, y: height - 150 });

  // Table Header
  const tableTop = height - 230;
  const cols = {
    item: 50,
    qty: 250,
    price: 350,
    total: 450
  };

  // Draw table headers with background
  drawText('SERVICE', { x: cols.item, y: tableTop, font: boldFont });
  drawText('QTY', { x: cols.qty, y: tableTop, font: boldFont });
  drawText('PRICE', { x: cols.price, y: tableTop, font: boldFont });
  drawText('TOTAL', { x: cols.total, y: tableTop, font: boldFont });

  // Draw header line
  drawLine(40, tableTop - 10, 550, tableTop - 10);

  // Table Content
  let currentY = tableTop - 40;
const rowHeight = 40; // Increased row height
const rowPadding = 18; // Padding between rows

orderData.items.forEach((item, index) => {
  // Add alternating background for rows
  if (index % 2 === 0) {
    page.drawRectangle({
      x: 40,
      y: currentY - rowPadding,
      width: 510,
      height: rowHeight,
      color: rgb(0.95, 0.95, 0.95),
    });
  }

  // Draw item details with proper vertical alignment
  drawText(item.cardName, { x: cols.item, y: currentY });
  drawText(item.quantity.toString(), { x: cols.qty, y: currentY });
  drawText(`Rs.${item.price.toFixed(2)}`, { x: cols.price, y: currentY });
  const itemTotal = (item.quantity * item.price) + item.printingCharges;
  drawText(`Rs.${itemTotal.toFixed(2)}`, { x: cols.total, y: currentY });
  
  // Add vertical spacing between rows
  currentY -= rowHeight;
  
  // Draw separator line with padding
  drawLine(40, currentY + rowPadding, 550, currentY + rowPadding);
});

  // Totals Section
  currentY -= 30;
  drawText('Sub-total:', { x: 350, y: currentY, font: boldFont });
  drawText(`Rs.${orderData.subTotal.toFixed(2)}`, { x: 450, y: currentY });
  
  currentY -= 20;
  drawText('GST (18%):', { x: 350, y: currentY, font: boldFont });
  drawText(`Rs.${orderData.gst.toFixed(2)}`, { x: 450, y: currentY });
  
  currentY -= 20;
  drawText('Total:', { x: 350, y: currentY, font: boldFont });
  drawText(`Rs.${orderData.total.toFixed(2)}`, { x: 450, y: currentY, font: boldFont });

  // Payment Information
  currentY -= 50;
  drawText('Payment Information', { x: 50, y: currentY, font: boldFont, size: 14 });
  currentY -= 20;
  drawText(`Payment Method: ${orderData.paymentMethod.toUpperCase()}`, { x: 50, y: currentY });
  
  if (shopDetails.gstin) {
    currentY -= 20;
    drawText(`GSTIN: ${shopDetails.gstin}`, { x: 50, y: currentY });
  }

  // Contact Information
  currentY -= 40;
  drawText('Shop Information:', { x: 50, y: currentY, font: boldFont });
  currentY -= 20;
  drawText(`Name: ${shopDetails.name}`, { x: 50, y: currentY });
  currentY -= 20;
  drawText(`Phone: ${shopDetails.phone}`, { x: 50, y: currentY });
  currentY -= 20;
  drawText(`Email: ${shopDetails.email}`, { x: 50, y: currentY });
  currentY -= 20;
  drawText(`Address: ${shopDetails.address}`, { x: 50, y: currentY });

  // Footer
  drawText('Thank you for your Purchase!', { x: 200, y: 50, font: boldFont, size: 14 });

  return await pdfDoc.save();
};

export const downloadPDF = (pdfBytes, fileName = 'invoice.pdf') => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};