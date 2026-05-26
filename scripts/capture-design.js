import { JSDOM } from 'jsdom';

/**
 * Script to capture basic design elements from a URL.
 * Run with: bun run scripts/capture-design.js <url>
 */

async function captureDesign(url) {
  console.log(`Capturing design from: ${url}...`);
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Extract metadata
    const title = document.querySelector('title')?.textContent;
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
    
    // Simple color extraction (looking for common patterns in style tags or inline styles)
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(s => s.textContent || '')
      .join('\n');
    
    const colors = new Set();
    const hexRegex = /#([a-f0-9]{3,6})/gi;
    let match;
    while ((match = hexRegex.exec(styles)) !== null) {
      colors.add(match[0].toUpperCase());
    }
    
    const hslRegex = /hsl\([^)]+\)/gi;
    while ((match = hslRegex.exec(styles)) !== null) {
      colors.add(match[0]);
    }

    console.log('\n--- Metadata ---');
    console.log(`Title: ${title}`);
    console.log(`Description: ${metaDescription}`);
    
    console.log('\n--- Potential Brand Colors ---');
    Array.from(colors).slice(0, 15).forEach(c => console.log(c));
    
    console.log('\n--- Main Headings ---');
    document.querySelectorAll('h1, h2').forEach(h => console.log(`${h.tagName}: ${h.textContent.trim().substring(0, 50)}...`));
    
  } catch (error) {
    console.error('Error capturing design:', error);
  }
}

const targetUrl = process.argv[2] || 'https://autolimpezapro.agendaaqui.online/';
captureDesign(targetUrl);
