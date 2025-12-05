import html2canvas from 'html2canvas';

export function useScreenshot() {
  const captureScreenshot = async (kidName: string, weekViewElement: HTMLElement | null) => {
    if (!weekViewElement) {
      console.error('WeekView element not found');
      return;
    }

    // Create temporary container for screenshot
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      background: white;
      padding: 2rem;
      max-width: 1024px;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    // Add title
    const title = document.createElement('h1');
    title.textContent = `Enrichment classes plan for ${kidName}`;
    title.style.cssText = `
      font-size: 1.875rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
      color: #1f2937;
      text-align: center;
    `;
    container.appendChild(title);

    // Clone the WeekView content
    const clonedWeekView = weekViewElement.cloneNode(true) as HTMLElement;
    // Ensure the cloned content fits within max-width
    clonedWeekView.style.maxWidth = '100%';
    clonedWeekView.style.overflow = 'hidden';
    container.appendChild(clonedWeekView);

    // Add timestamp footer
    const footer = document.createElement('footer');
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    footer.textContent = `Generated on ${dateStr} at ${timeStr}`;
    footer.style.cssText = `
      margin-top: 1rem;
      text-align: right;
      font-size: 0.75rem;
      color: #6b7280;
    `;
    container.appendChild(footer);

    // Append to body temporarily
    document.body.appendChild(container);

    try {
      // Capture with html2canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const filename = `enrichment-plan-${kidName.toLowerCase().replace(/\s+/g, '-')}.png`;
          link.href = url;
          link.download = filename;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    } finally {
      // Clean up
      document.body.removeChild(container);
    }
  };

  return {
    captureScreenshot,
  };
}
