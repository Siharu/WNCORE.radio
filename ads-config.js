// ads-config.js — Centralized Ad Management System
// Insert ads anywhere on the site without editing HTML files

const ADS_CONFIG = {
  // Global settings
  enabled: true,
  network: 'adsense', // 'adsense', 'custom', 'none'
  
  // Ad placements throughout the site
  placements: {
    // Homepage
    'hero-banner': {
      type: 'banner',
      size: '728x90',
      location: 'above fold',
      enabled: true,
    },
    'after-games': {
      type: 'interstitial',
      trigger: 'game_complete',
      enabled: true,
    },
    'sidebar-games': {
      type: 'sidebar',
      size: '300x600',
      location: 'right of game list',
      enabled: true,
    },
    
    // In-game placements
    'supply-run-midpoint': {
      type: 'video',
      trigger: 'supply_run_50pct',
      enabled: true,
    },
    'frequency-decoder-reward': {
      type: 'banner',
      trigger: 'decoder_success',
      enabled: true,
      message: 'Congrats! Your reward:',
    },
    'testimony-analysis-pause': {
      type: 'banner',
      trigger: 'testimony_pause_5min',
      enabled: true,
    },
    
    // Sticky placements
    'bottom-sticky': {
      type: 'sticky-banner',
      size: '320x50',
      location: 'bottom of page',
      enabled: false, // disable annoying sticky ads
    },
  },

  // Custom ad content (when network = 'custom')
  customAds: [
    {
      id: 'custom-1',
      type: 'image',
      src: '/ads/emergency-supplies.jpg',
      link: '#',
      alt: 'Emergency Supplies Campaign',
      placements: ['hero-banner', 'sidebar-games'],
    },
    {
      id: 'custom-2',
      type: 'html',
      content: '<div style="padding:20px; background:#0a0a0a; border:1px solid #cc0000; text-align:center;">' +
               '<p style="color:#cc0000; font-family:Space Mono; letter-spacing:1px;">WNCORE PARTNER</p>' +
               '<p>Your ad here — contact frequency 88.7</p></div>',
      placements: ['after-games'],
    },
  ],

  // Google AdSense settings (if applicable)
  adsense: {
    clientId: '', // Set your AdSense client ID here
    enabled: false, // Set to true when ready
  },

  // Ad frequency limits (avoid ad fatigue)
  frequency: {
    banner_per_hour: 4,
    interstitial_per_hour: 2,
    video_per_hour: 1,
  },

  // Track ad impressions/clicks
  tracking: {
    enabled: true,
    reportUrl: '/api/ad-analytics', // Optional: send analytics
  },
};

// ════════════════════════════════════════════════════════
// AD ENGINE — Inject ads without editing HTML
// ════════════════════════════════════════════════════════

class AdEngine {
  constructor(config) {
    this.config = config;
    this.impressions = {};
    this.lastShowTime = {};
    this.loadStyle();
  }

  loadStyle() {
    const style = document.createElement('style');
    style.textContent = `
      .ad-container {
        margin: 20px 0;
        padding: 15px;
        background: #0a0a0a;
        border: 1px solid #330000;
        text-align: center;
      }
      .ad-banner { width: 100%; max-width: 728px; margin: 0 auto; }
      .ad-sidebar { width: 300px; display: inline-block; vertical-align: top; }
      .ad-sticky-bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #0a0a0a;
        border-top: 1px solid #330000;
        z-index: 1000;
        padding: 10px;
        text-align: center;
      }
      .ad-close {
        background: transparent;
        border: 1px solid #330000;
        color: #660000;
        padding: 2px 8px;
        cursor: pointer;
        font-family: 'Space Mono', monospace;
        font-size: 0.7rem;
        float: right;
      }
      .ad-close:hover { color: #cc0000; border-color: #cc0000; }
      .ad-label {
        font-size: 0.6rem;
        color: #666;
        letter-spacing: 1px;
        margin-bottom: 5px;
      }
    `;
    document.head.appendChild(style);
  }

  // Show ad at specific placement
  showAd(placementId, options = {}) {
    if (!this.config.enabled) return;
    
    const placement = this.config.placements[placementId];
    if (!placement || !placement.enabled) return;

    // Check frequency limits
    if (!this.canShowAd(placementId)) return;

    const targetElement = options.targetElement || document.getElementById(`ad-${placementId}`);
    if (!targetElement) return;

    let adContent = this.buildAdContent(placementId);
    targetElement.innerHTML = adContent;
    this.trackImpression(placementId);
    this.lastShowTime[placementId] = Date.now();
  }

  buildAdContent(placementId) {
    const placement = this.config.placements[placementId];
    
    if (this.config.network === 'adsense' && this.config.adsense.enabled) {
      return this.buildAdSenseAd(placement);
    } else if (this.config.network === 'custom') {
      return this.buildCustomAd(placementId);
    }
    return this.buildPlaceholder(placementId);
  }

  buildAdSenseAd(placement) {
    // Replace with actual AdSense code
    return `<div class="ad-label">Advertisement</div>
            <ins class="adsbygoogle"
              style="display:block"
              data-ad-client="${this.config.adsense.clientId}"
              data-ad-slot="0000000000"
              data-ad-format="auto"></ins>`;
  }

  buildCustomAd(placementId) {
    const customAds = this.config.customAds.filter(ad => 
      ad.placements.includes(placementId)
    );
    
    if (customAds.length === 0) return '';
    
    const ad = customAds[Math.floor(Math.random() * customAds.length)];
    
    if (ad.type === 'image') {
      return `<div class="ad-label">Advertisement</div>
              <a href="${ad.link}" target="_blank">
                <img src="${ad.src}" alt="${ad.alt}" style="max-width:100%; height:auto;">
              </a>`;
    }
    
    if (ad.type === 'html') {
      return `<div class="ad-label">Advertisement</div>${ad.content}`;
    }
    
    return '';
  }

  buildPlaceholder(placementId) {
    return `<div class="ad-container">
              <div class="ad-label">Ad Placement: ${placementId}</div>
              <p style="color:#666; font-family:Space Mono; font-size:0.8rem;">
                Your ad here — Add to ads-config.js
              </p>
            </div>`;
  }

  canShowAd(placementId) {
    const placement = this.config.placements[placementId];
    const key = placement.type || 'default';
    const limit = this.config.frequency[`${key}_per_hour`];
    
    if (!limit) return true;
    
    this.impressions[key] = this.impressions[key] || [];
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.impressions[key] = this.impressions[key].filter(time => time > oneHourAgo);
    
    return this.impressions[key].length < limit;
  }

  trackImpression(placementId) {
    const placement = this.config.placements[placementId];
    const key = placement.type || 'default';
    this.impressions[key] = this.impressions[key] || [];
    this.impressions[key].push(Date.now());

    if (this.config.tracking.enabled) {
      this.sendAnalytics(placementId, 'impression');
    }
  }

  trackClick(placementId) {
    if (this.config.tracking.enabled) {
      this.sendAnalytics(placementId, 'click');
    }
  }

  sendAnalytics(placementId, action) {
    // Send to your analytics endpoint
    fetch(this.config.tracking.reportUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placement: placementId,
        action: action,
        timestamp: new Date().toISOString(),
      }),
    }).catch(e => {/* Analytics handled */});
  }

  // Show ad after game completion
  showGameRewardAd() {
    setTimeout(() => {
      this.showAd('after-games', {
        targetElement: document.getElementById('game-ad-reward'),
      });
    }, 500);
  }
}

// Initialize globally
window.adEngine = new AdEngine(ADS_CONFIG);

// Helper function to inject ad containers into any page
window.injectAdPlacement = (placementId, targetSelector = null) => {
  const target = targetSelector 
    ? document.querySelector(targetSelector)
    : document.getElementById(`ad-${placementId}`);
  
  if (target) {
    window.adEngine.showAd(placementId, { targetElement: target });
  }
};
