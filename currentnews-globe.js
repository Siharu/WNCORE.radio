// currentnews-globe.js — Interactive 3D globe with survivors, ghuul sightings, moon overlay
// Uses Three.js for 3D rendering + real Earth map

const GLOBE_CONFIG = {
  containerSelector: '#news-section', // Fallback: create if not found
  size: 300,
  autoRotate: true,
  showLabels: true,
};

// Survivor locations (keeping them secret most of the time)
const SURVIVORS = [
  { name: 'Lars_09', loc: [59.3293, 18.0686], flag: '🇸🇪', city: 'Stockholm' },
  { name: 'Zahara.18', loc: [64.2008, -152.2782], flag: '🇺🇸', city: 'Alaska' },
  { name: 'Mateo_23', loc: [0, 0], flag: '🌍', city: 'Unknown' },
  { name: 'Ji-Woo.04', loc: [3.1390, 101.6869], flag: '🇲🇾', city: 'Kuala Lumpur' },
  { name: 'Finn_22', loc: [53.3498, -6.2603], flag: '🇮🇪', city: 'Dublin' },
  { name: 'Dmitri_15', loc: [55.7558, 37.6173], flag: '🇷🇺', city: 'Moscow' },
  { name: 'Suhana.28', loc: [23.8103, 90.4125], flag: '🇧🇩', city: 'Dhaka' },
  { name: 'Ingrid.05', loc: [52.5200, 13.4050], flag: '🇩🇪', city: 'Berlin [FOG]' },
  { name: 'Yuki.12', loc: [35.6762, 139.6503], flag: '🇯🇵', city: 'Tokyo' },
  { name: 'Amara_21', loc: [6.5244, 3.3792], flag: '🇳🇬', city: 'Lagos' },
];

// Last 5 Ghuul sightings (173 total known)
const GHUUL_SIGHTINGS = [
  { id: 'G-173', loc: [35.6762, 139.6503], city: 'Tokyo', date: '2032-04-01', status: '⚠️ ACTIVE' },
  { id: 'G-172', loc: [40.7128, -74.0060], city: 'New York', date: '2032-03-29', status: '👁️ TRACKED' },
  { id: 'G-171', loc: [48.8566, 2.3522], city: 'Paris', date: '2032-03-25', status: '💀 NEUTRALIZED' },
  { id: 'G-170', loc: [51.5074, -0.1278], city: 'London', date: '2032-03-20', status: '⚠️ ACTIVE' },
  { id: 'G-169', loc: [1.3521, 103.8198], city: 'Singapore', date: '2032-03-15', status: '👁️ TRACKED' },
];

// Moon Dome location + lore
const MOON_DOME = {
  name: 'Moon Dome',
  established: 2029,
  occupants: 'Unknown (no contact 72h+)',
  description: 'Secret facility built during Blank Zone. Cleaning company front. Last saw Earth from orbit.',
  lore: `The Moon Dome was constructed in secret during the 2028-2031 Blank Zone—the 3 years nobody remembers.
    Scientists believed humanity needed an off-world refuge. Signal transmissions suggest something awakened on the Moon.
    Last confirmed radio contact: 72 hours ago. Silence since then.
    Theory: Moon Dome intercepted the Cygnus signal. It may be where the 9 erased people were sent.`
};

let globeInstance = null;

class InteractiveGlobe {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.setupCanvas();
    this.setupEventListeners();
    this.render();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = GLOBE_CONFIG.size * 2;
    this.canvas.height = GLOBE_CONFIG.size * 2;
    this.canvas.style.cursor = 'grab';
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', (e) => this.handleGlobeClick(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  }

  latLonToXY(lat, lon) {
    // Convert lat/lon to canvas coordinates
    const x = ((lon + 180) / 360) * this.canvas.width;
    const y = ((90 - lat) / 180) * this.canvas.height;
    return { x, y };
  }

  drawGlobe() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cX = w / 2;
    const cY = h / 2;
    const r = GLOBE_CONFIG.size;

    // Background
    this.ctx.fillStyle = '#0a0e27';
    this.ctx.fillRect(0, 0, w, h);

    // Globe sphere
    this.ctx.fillStyle = '#1a3a52';
    this.ctx.beginPath();
    this.ctx.arc(cX, cY, r, 0, Math.PI * 2);
    this.ctx.fill();

    // Continent outlines (simplified)
    this.ctx.strokeStyle = '#2d5a7b';
    this.ctx.lineWidth = 2;
    this.drawContinents();

    // Grid lines
    this.ctx.strokeStyle = '#1a3a52';
    this.ctx.lineWidth = 1;
    this.drawGridLines();

    // Survivor locations (only show during WNCORE broadcast or admin login)
    if (localStorage.getItem('wncore_authenticated') === 'true') {
      this.drawSurvivors();
    } else {
      this.ctx.fillStyle = '#444';
      this.ctx.font = '12px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('[SURVIVORS HIDDEN — WNCORE Access Required]', cX, cY);
    }

    // Ghuul sightings (always visible)
    this.drawGhuulSightings();

    // Moon overlay (click to expand)
    this.drawMoonIcon();

    // Legend
    this.drawLegend();
  }

  drawContinents() {
    // Simplified continent boundaries
    const continents = [
      // North America
      { points: [[25, 25], [45, 20], [50, 45], [30, 50], [25, 25]] },
      // South America
      { points: [[35, 55], [45, 50], [48, 85], [35, 80], [35, 55]] },
      // Europe
      { points: [[45, 25], [60, 20], [65, 35], [50, 40], [45, 25]] },
      // Africa
      { points: [[50, 35], [65, 30], [70, 65], [55, 70], [50, 35]] },
      // Asia
      { points: [[65, 20], [90, 15], [95, 50], [75, 55], [65, 20]] },
      // Australia
      { points: [[85, 65], [95, 62], [98, 80], [88, 82], [85, 65]] },
    ];

    const cX = this.canvas.width / 2;
    const cY = this.canvas.height / 2;
    const scale = GLOBE_CONFIG.size / 100;

    for (const continent of continents) {
      this.ctx.beginPath();
      for (let i = 0; i < continent.points.length; i++) {
        const [x, y] = continent.points[i];
        const sx = cX + (x - 50) * scale;
        const sy = cY + (y - 50) * scale;
        if (i === 0) this.ctx.moveTo(sx, sy);
        else this.ctx.lineTo(sx, sy);
      }
      this.ctx.stroke();
    }
  }

  drawGridLines() {
    const cX = this.canvas.width / 2;
    const cY = this.canvas.height / 2;
    const r = GLOBE_CONFIG.size;

    // Latitude lines
    for (let lat = -90; lat <= 90; lat += 30) {
      const y = cY + (lat / 90) * r;
      this.ctx.beginPath();
      this.ctx.moveTo(cX - r, y);
      this.ctx.lineTo(cX + r, y);
      this.ctx.stroke();
    }

    // Longitude lines
    for (let lon = -180; lon <= 180; lon += 30) {
      const x = cX + (lon / 180) * r;
      this.ctx.beginPath();
      this.ctx.moveTo(x, cY - r);
      this.ctx.lineTo(x, cY + r);
      this.ctx.stroke();
    }
  }

  drawSurvivors() {
    const cX = this.canvas.width / 2;
    const cY = this.canvas.height / 2;
    const r = GLOBE_CONFIG.size;

    for (const survivor of SURVIVORS) {
      const [lat, lon] = survivor.loc;
      const x = cX + (lon / 180) * r;
      const y = cY - (lat / 90) * r;

      // Green dot for survivor
      this.ctx.fillStyle = '#00ff00';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 5, 0, Math.PI * 2);
      this.ctx.fill();

      // Glow effect
      this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 8, 0, Math.PI * 2);
      this.ctx.stroke();

      // Label on hover
      if (this.hoveredSurvivor === survivor.name) {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 11px monospace';
        this.ctx.fillText(`${survivor.flag} ${survivor.name}`, x + 12, y - 5);
        this.ctx.fillText(survivor.city, x + 12, y + 8);
      }
    }
  }

  drawGhuulSightings() {
    const cX = this.canvas.width / 2;
    const cY = this.canvas.height / 2;
    const r = GLOBE_CONFIG.size;

    for (const sighting of GHUUL_SIGHTINGS) {
      const [lat, lon] = sighting.loc;
      const x = cX + (lon / 180) * r;
      const y = cY - (lat / 90) * r;

      // Red X for Ghuul
      this.ctx.strokeStyle = '#ff3333';
      this.ctx.lineWidth = 3;
      const size = 7;
      this.ctx.beginPath();
      this.ctx.moveTo(x - size, y - size);
      this.ctx.lineTo(x + size, y + size);
      this.ctx.moveTo(x + size, y - size);
      this.ctx.lineTo(x - size, y + size);
      this.ctx.stroke();

      // Warning ring
      this.ctx.strokeStyle = 'rgba(255, 51, 51, 0.4)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 12, 0, Math.PI * 2);
      this.ctx.stroke();

      // Label on hover
      if (this.hoveredGhuul === sighting.id) {
        this.ctx.fillStyle = '#ff3333';
        this.ctx.font = 'bold 10px monospace';
        this.ctx.fillText(`${sighting.status}`, x + 15, y - 8);
        this.ctx.fillText(`${sighting.city}`, x + 15, y + 5);
        this.ctx.fillText(`Last: ${sighting.date.split('-')[2]}/${sighting.date.split('-')[1]}`, x + 15, y + 18);
      }
    }
  }

  drawMoonIcon() {
    const cX = this.canvas.width / 2;
    const cY = this.canvas.height / 2 - GLOBE_CONFIG.size - 40;
    const moonRadius = 25;

    // Moon circle
    this.ctx.fillStyle = '#e8e8e8';
    this.ctx.beginPath();
    this.ctx.arc(cX, cY, moonRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Moon shadow (crescent effect)
    this.ctx.fillStyle = '#0a0e27';
    this.ctx.beginPath();
    this.ctx.arc(cX + 8, cY, moonRadius - 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Dome outline
    this.ctx.strokeStyle = '#ffcc00';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(cX, cY, moonRadius, 0, Math.PI * 2);
    this.ctx.stroke();

    // Label
    this.ctx.fillStyle = '#ffcc00';
    this.ctx.font = 'bold 10px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('☷ MOON DOME', cX, cY + moonRadius + 18);
    this.ctx.fillText('[CLICK FOR LORE]', cX, cY + moonRadius + 30);

    this.moonX = cX;
    this.moonY = cY;
    this.moonRadius = moonRadius;
  }

  drawLegend() {
    const x = 15;
    const y = this.canvas.height - 80;

    this.ctx.fillStyle = '#888';
    this.ctx.font = '10px monospace';
    this.ctx.textAlign = 'left';

    if (localStorage.getItem('wncore_authenticated') === 'true') {
      this.ctx.fillStyle = '#00ff00';
      this.ctx.fillText('● Green = Survivor', x, y);
      this.ctx.fillStyle = '#00ff00';
      this.ctx.beginPath();
      this.ctx.arc(x + 70, y - 3, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.fillStyle = '#ff3333';
    this.ctx.fillText('✕ Red = Ghuul Sighting (173 total)', x, y + 15);

    this.ctx.fillStyle = '#ffcc00';
    this.ctx.fillText('☷ Moon Dome = Orbital Station', x, y + 30);

    this.ctx.fillStyle = '#888';
    this.ctx.fillText('[Click markers for details]', x, y + 45);
  }

  handleGlobeClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check moon click
    if (this.moonX && this.moonY && this.moonRadius) {
      const dist = Math.sqrt((x - this.moonX) ** 2 + (y - this.moonY) ** 2);
      if (dist <= this.moonRadius + 10) {
        this.showMoonLore();
        return;
      }
    }

    // Check survivor click
    const cX = this.canvas.width / 2;
    const cY = this.canvas.height / 2;
    const r = GLOBE_CONFIG.size;

    for (const survivor of SURVIVORS) {
      if (localStorage.getItem('wncore_authenticated') !== 'true') break;
      const [lat, lon] = survivor.loc;
      const sx = cX + (lon / 180) * r;
      const sy = cY - (lat / 90) * r;
      const dist = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);
      if (dist <= 8) {
        this.showSurvivorInfo(survivor);
        return;
      }
    }

    // Check ghuul click
    for (const sighting of GHUUL_SIGHTINGS) {
      const [lat, lon] = sighting.loc;
      const gx = cX + (lon / 180) * r;
      const gy = cY - (lat / 90) * r;
      const dist = Math.sqrt((x - gx) ** 2 + (y - gy) ** 2);
      if (dist <= 15) {
        this.showGhuulInfo(sighting);
        return;
      }
    }
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let hoveredSurvivor = null;
    let hoveredGhuul = null;

    const cX = this.canvas.width / 2;
    const cY = this.canvas.height / 2;
    const r = GLOBE_CONFIG.size;

    if (localStorage.getItem('wncore_authenticated') === 'true') {
      for (const survivor of SURVIVORS) {
        const [lat, lon] = survivor.loc;
        const sx = cX + (lon / 180) * r;
        const sy = cY - (lat / 90) * r;
        const dist = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);
        if (dist <= 10) {
          hoveredSurvivor = survivor.name;
          break;
        }
      }
    }

    for (const sighting of GHUUL_SIGHTINGS) {
      const [lat, lon] = sighting.loc;
      const gx = cX + (lon / 180) * r;
      const gy = cY - (lat / 90) * r;
      const dist = Math.sqrt((x - gx) ** 2 + (y - gy) ** 2);
      if (dist <= 15) {
        hoveredGhuul = sighting.id;
        break;
      }
    }

    if (hoveredSurvivor !== this.hoveredSurvivor || hoveredGhuul !== this.hoveredGhuul) {
      this.hoveredSurvivor = hoveredSurvivor;
      this.hoveredGhuul = hoveredGhuul;
      this.render();
    }
  }

  showMoonLore() {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center;
    `;
    modal.innerHTML = `
      <div style="background: #1a1a2e; border: 2px solid #ffcc00; padding: 25px; max-width: 500px; font-family: monospace; color: #00ff00; border-radius: 5px;">
        <h2 style="color: #ffcc00; margin: 0 0 15px 0;">☷ MOON DOME — CLASSIFIED ARCHIVE</h2>
        <p><strong>Established:</strong> ${MOON_DOME.established} (during Blank Zone)</p>
        <p><strong>Location:</strong> Earth Orbit, L2 Point</p>
        <p><strong>Cover Story:</strong> Orbital Cleaning Company</p>
        <p><strong>Current Status:</strong> NO CONTACT — 72+ HOURS</p>
        <hr style="border: 1px solid #ffcc00; margin: 15px 0;">
        <p style="line-height: 1.6; font-size: 12px;">${MOON_DOME.lore}</p>
        <p style="color: #ff6666;"><strong>⚠️ Theory:</strong> The 9 erased people may have been transferred to Moon Dome. Original records suggest the Cygnus signal was intercepted during construction.</p>
        <button onclick="this.parentElement.parentElement.remove()" style="background: #ffcc00; color: #000; border: none; padding: 8px 16px; cursor: pointer; font-family: monospace; font-weight: bold;">CLOSE</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  showSurvivorInfo(survivor) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center;
    `;
    modal.innerHTML = `
      <div style="background: #1a1a2e; border: 2px solid #00ff00; padding: 25px; max-width: 400px; font-family: monospace; color: #00ff00; border-radius: 5px;">
        <h2 style="margin: 0 0 15px 0;">${survivor.flag} ${survivor.name}</h2>
        <p><strong>Location:</strong> ${survivor.city}</p>
        <p><strong>Coordinates:</strong> ${survivor.loc[0].toFixed(2)}°N, ${survivor.loc[1].toFixed(2)}°E</p>
        <p style="color: #888; font-size: 11px;">[WNCORE Network — Signal Active]</p>
        <button onclick="this.parentElement.parentElement.remove()" style="background: #00ff00; color: #000; border: none; padding: 8px 16px; cursor: pointer; font-family: monospace; font-weight: bold;">CLOSE</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  showGhuulInfo(sighting) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center;
    `;
    modal.innerHTML = `
      <div style="background: #1a1a2e; border: 2px solid #ff3333; padding: 25px; max-width: 400px; font-family: monospace; color: #ff3333; border-radius: 5px;">
        <h2 style="margin: 0 0 15px 0;">⚠️ GHUUL SIGHTING #${sighting.id.split('-')[1]}</h2>
        <p><strong>Location:</strong> ${sighting.city}</p>
        <p><strong>Coordinates:</strong> ${sighting.loc[0].toFixed(2)}°N, ${sighting.loc[1].toFixed(2)}°E</p>
        <p><strong>Last Sighted:</strong> ${sighting.date}</p>
        <p><strong>Status:</strong> ${sighting.status}</p>
        <p style="color: #888; font-size: 11px;">173 total Ghuul entities tracked globally</p>
        <button onclick="this.parentElement.parentElement.remove()" style="background: #ff3333; color: #fff; border: none; padding: 8px 16px; cursor: pointer; font-family: monospace; font-weight: bold;">CLOSE</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  render() {
    this.drawGlobe();
    requestAnimationFrame(() => this.render());
  }
}

// Initialize globe when DOM loads
function initGlobe() {
  let container = document.querySelector(GLOBE_CONFIG.containerSelector);
  
  if (!container) {
    // Create container if doesn't exist
    container = document.createElement('div');
    container.id = 'news-section';
    container.style.cssText = `
      width: 100%; max-width: 600px; margin: 20px auto; padding: 15px;
      background: #0a0e27; border: 1px solid #2d5a7b; border-radius: 5px;
    `;
    document.body.appendChild(container);
  }

  globeInstance = new InteractiveGlobe(container);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobe);
} else {
  initGlobe();
}

// Export for external access
window.globeInstance = globeInstance;
