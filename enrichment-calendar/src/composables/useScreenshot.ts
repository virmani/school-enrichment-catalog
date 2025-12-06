import html2canvas from 'html2canvas';

export function useScreenshot() {
  const captureScreenshot = async (kidName: string, weekViewElement: HTMLElement | null) => {
    if (!weekViewElement) {
      console.error('WeekView element not found');
      return;
    }

    // Find the actual WeekView component inside the container
    const weekViewComponent = weekViewElement.querySelector('.w-full.overflow-x-auto');
    if (!weekViewComponent) {
      console.error('WeekView component not found');
      return;
    }

    // Create temporary container for screenshot
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      left: 0;
      top: 100vh;
      background: white;
      padding: 2rem;
      max-width: 1400px;
      width: 1400px;
      font-family: system-ui, -apple-system, sans-serif;
      pointer-events: none;
      z-index: 9999;
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
    const clonedWeekView = weekViewComponent.cloneNode(true) as HTMLElement;
    // Ensure the cloned content fits within max-width
    clonedWeekView.style.maxWidth = '100%';
    clonedWeekView.style.overflow = 'hidden';
    clonedWeekView.style.display = 'block';
    clonedWeekView.style.visibility = 'visible';

    // Fix text truncation in class cards - remove line-clamp and add proper height
    const classNames = clonedWeekView.querySelectorAll('.line-clamp-2');
    classNames.forEach((el) => {
      const element = el as HTMLElement;
      element.style.display = 'block';
      element.style.webkitLineClamp = 'unset';
      element.style.webkitBoxOrient = 'unset';
      element.style.overflow = 'visible';
      element.style.textOverflow = 'clip';
      element.style.lineHeight = '1.25rem';
      element.style.minHeight = '2.5rem'; // 2 lines minimum
    });

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
      // Wait for styles to be fully computed and layout to stabilize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture with html2canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        windowHeight: container.scrollHeight,
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
