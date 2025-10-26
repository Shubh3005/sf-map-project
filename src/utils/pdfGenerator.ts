import jsPDF from 'jspdf';
import { CityData, Problem, Solution } from '../data/mockCities';

interface ReportItem {
  problem: Problem;
  solution: Solution;
}

export function generateCityReport(
  city: CityData,
  reportItems: ReportItem[]
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Helper function to add page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper function to wrap text
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number): number => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return lines.length * fontSize * 0.35; // Approximate line height
  };

  // === COVER PAGE ===
  // Header with gradient background effect (simulated with rectangles)
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(0, 0, pageWidth, 60, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('WESTGATE', pageWidth / 2, 25, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Community Development Report', pageWidth / 2, 35, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth / 2, 45, { align: 'center' });

  yPos = 80;

  // City Title
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(`${city.name}, ${city.county} County`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Risk Level Badge
  const riskColors = {
    high: [239, 68, 68],    // red-500
    medium: [234, 179, 8],  // yellow-500
    low: [34, 197, 94],     // green-500
  };
  const riskColor = riskColors[city.riskLevel] || [100, 116, 139];
  doc.setFillColor(...riskColor);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const riskText = `${city.riskLevel.toUpperCase()} RISK`;
  const riskWidth = doc.getTextWidth(riskText) + 10;
  doc.roundedRect(pageWidth / 2 - riskWidth / 2, yPos - 5, riskWidth, 10, 3, 3, 'F');
  doc.text(riskText, pageWidth / 2, yPos, { align: 'center' });
  yPos += 20;

  // === EXECUTIVE SUMMARY ===
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summary = `This report provides an analysis of ${city.name} and outlines ${reportItems.length} recommended policy ${reportItems.length === 1 ? 'solution' : 'solutions'} to address identified community challenges. Each solution includes detailed implementation steps, cost breakdowns, success metrics, and case studies from similar cities.`;
  yPos += addWrappedText(summary, margin, yPos, contentWidth, 10);
  yPos += 15;

  // === CITY METRICS ===
  checkPageBreak(80);
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(margin, yPos, contentWidth, 70, 3, 3, 'F');
  yPos += 10;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('City Overview', margin + 5, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85); // slate-700

  const metrics = [
    { label: 'Population', value: city.metrics.population.toLocaleString() },
    { label: 'Median Income', value: `$${city.metrics.medianIncome.toLocaleString()}` },
    { label: 'Crime Rate', value: `${(city.metrics.crimeRate * 100).toFixed(1)}%` },
    { label: 'Unemployment Rate', value: `${(city.metrics.unemploymentRate * 100).toFixed(1)}%` },
    { label: 'Poverty Rate', value: `${(city.metrics.povertyRate * 100).toFixed(1)}%` },
    { label: 'Vacancy Rate', value: `${(city.metrics.vacancyRate * 100).toFixed(1)}%` },
    { label: 'Foreclosure Rate', value: `${(city.metrics.foreclosureRate * 100).toFixed(2)}%` },
    { label: 'Tax Delinquency', value: `${(city.metrics.taxDelinquency * 100).toFixed(1)}%` },
  ];

  const col1X = margin + 10;
  const col2X = pageWidth / 2 + 5;
  let metricY = yPos;

  metrics.forEach((metric, idx) => {
    const x = idx % 2 === 0 ? col1X : col2X;
    if (idx % 2 === 0 && idx > 0) metricY += 6;
    doc.setFont('helvetica', 'bold');
    doc.text(`${metric.label}:`, x, metricY);
    doc.setFont('helvetica', 'normal');
    doc.text(metric.value, x + 45, metricY);
  });

  yPos += 65;

  // === NEW PAGE FOR SOLUTIONS ===
  doc.addPage();
  yPos = margin;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Recommended Solutions', margin, yPos);
  yPos += 12;

  // === SOLUTIONS ===
  reportItems.forEach((item, index) => {
    checkPageBreak(60);

    // Solution Header
    doc.setFillColor(30, 41, 59); // slate-800
    doc.roundedRect(margin, yPos, contentWidth, 12, 2, 2, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`Solution ${index + 1}: ${item.solution.title}`, margin + 5, yPos + 8);
    yPos += 18;

    // Problem Addressed
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('ADDRESSES:', margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    yPos += addWrappedText(item.problem.title, margin, yPos + 5, contentWidth, 9);
    yPos += 8;

    // Description
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    yPos += addWrappedText(item.solution.description, margin, yPos, contentWidth, 9);
    yPos += 8;

    // Cost & Timeline boxes
    checkPageBreak(20);
    doc.setFillColor(239, 246, 255); // blue-50
    doc.roundedRect(margin, yPos, (contentWidth - 5) / 2, 15, 2, 2, 'F');
    doc.roundedRect(margin + (contentWidth + 5) / 2, yPos, (contentWidth - 5) / 2, 15, 2, 2, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175); // blue-800
    doc.text('Estimated Cost', margin + 3, yPos + 5);
    doc.text('Timeline', margin + (contentWidth + 5) / 2 + 3, yPos + 5);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(item.solution.estimatedCost, margin + 3, yPos + 12);
    doc.text(item.solution.timeline, margin + (contentWidth + 5) / 2 + 3, yPos + 12);
    yPos += 20;

    // Implementation Steps
    checkPageBreak(40);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Implementation Steps:', margin, yPos);
    yPos += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    item.solution.steps.forEach((step, idx) => {
      checkPageBreak(8);
      doc.setTextColor(59, 130, 246); // blue-500
      doc.text(`${idx + 1}.`, margin + 2, yPos);
      doc.setTextColor(51, 65, 85);
      yPos += addWrappedText(step, margin + 8, yPos, contentWidth - 8, 9);
      yPos += 5;
    });

    // Cost Breakdown
    if (item.solution.costBreakdown && item.solution.costBreakdown.length > 0) {
      checkPageBreak(40);
      yPos += 5;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Cost Breakdown:', margin, yPos);
      yPos += 6;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      item.solution.costBreakdown.forEach((cost) => {
        checkPageBreak(6);
        doc.setTextColor(51, 65, 85);
        doc.text(cost.item, margin + 2, yPos);
        doc.setFont('helvetica', 'bold');
        doc.text(cost.amount, pageWidth - margin - 30, yPos, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        yPos += 5;
      });
    }

    // Success Metrics
    if (item.solution.successMetrics && item.solution.successMetrics.length > 0) {
      checkPageBreak(30);
      yPos += 5;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Success Metrics:', margin, yPos);
      yPos += 6;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      item.solution.successMetrics.slice(0, 4).forEach((metric) => {
        checkPageBreak(6);
        doc.setTextColor(34, 197, 94); // green-500
        doc.text('✓', margin + 2, yPos);
        doc.setTextColor(51, 65, 85);
        yPos += addWrappedText(metric, margin + 8, yPos, contentWidth - 8, 8);
        yPos += 4;
      });
    }

    // Similar Cities
    if (item.solution.similarCities && item.solution.similarCities.length > 0) {
      checkPageBreak(30);
      yPos += 5;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Case Studies:', margin, yPos);
      yPos += 6;

      doc.setFontSize(8);
      item.solution.similarCities.forEach((city) => {
        checkPageBreak(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(6, 182, 212); // cyan-500
        doc.text(`• ${city.city}`, margin + 2, yPos);
        yPos += 4;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 65, 85);
        yPos += addWrappedText(city.outcome, margin + 6, yPos, contentWidth - 6, 8);
        yPos += 5;
      });
    }

    yPos += 10; // Space before next solution
  });

  // === FOOTER ON LAST PAGE ===
  checkPageBreak(30);
  yPos = pageHeight - 40;
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Generated by Westgate - Civic Intelligence Platform', pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.setFontSize(8);
  doc.text('For questions or support, contact your city administrator', pageWidth / 2, yPos, { align: 'center' });

  // Save the PDF
  const fileName = `${city.name.replace(/\s+/g, '_')}_Community_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
