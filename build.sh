#!/bin/bash
# WNCORE Radio - Production Build Script
# Minifies and optimizes all assets for production

set -e

echo "🔨 Building WNCORE Radio for production..."

# Create dist directory
mkdir -p dist

# Copy HTML with minification
echo "📄 Optimizing HTML..."
cat index.html | \
  sed 's/<!--.*-->//g' | \
  sed 's/  */ /g' | \
  sed 's/> </></g' > dist/index.html

# Copy CSS
echo "📦 Bundling CSS..."
cp style.css dist/style.css

# Minify CSS in production (optional - requires cssnano or csso)
# csso dist/style.css -o dist/style.min.css

# Copy JavaScript files
echo "🔧 Preparing JavaScript..."
cp main.js dist/main.js
cp improvements.js dist/improvements.js
cp wrongness.js dist/wrongness.js
cp admin.js dist/admin.js

# Optional: Obfuscate admin.js (requires UglifyJS or Terser)
# uglifyjs dist/admin.js -c -m -o dist/admin.min.js

# Copy static assets
echo "🖼️  Copying static assets..."
if [ -d "images" ]; then
  cp -r images dist/
fi

# Create .htaccess for caching
echo "⚙️  Creating cache rules..."
cat > dist/.htaccess << 'EOF'
# Cache static assets for 1 year
<FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# Don't cache HTML
<FilesMatch "\.html$">
  Header set Cache-Control "max-age=0, public, must-revalidate"
</FilesMatch>

# Enable gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Security headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "DENY"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"
EOF

# Generate sitemap
echo "🗺️  Generating sitemap..."
cat > dist/sitemap.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://wncoreradio.net/</loc>
    <lastmod>2025-01-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://wncoreradio.net/#privacy</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://wncoreradio.net/#terms</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://wncoreradio.net/#api</loc>
    <priority>0.7</priority>
  </url>
</urlset>
EOF

# Generate robots.txt
echo "🤖 Generating robots.txt..."
cat > dist/robots.txt << 'EOF'
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /.env
Sitemap: https://wncoreradio.net/sitemap.xml
EOF

# Create production config
echo "🔐 Creating production config..."
cat > dist/config.json << 'EOF'
{
  "environment": "production",
  "api": "https://all.api.radio-browser.info/json",
  "features": {
    "argMode": true,
    "adminPanel": true,
    "signalLost": true
  },
  "caching": {
    "ttl": 3600,
    "staleWhileRevalidate": 86400
  }
}
EOF

echo "✅ Production build complete!"
echo "📁 Output: dist/"
echo ""
echo "Next steps:"
echo "1. Test locally: python -m http.server 8000 -d dist"
echo "2. Deploy: vercel deploy --prod"
echo "3. Monitor: https://vercel.com/dashboard"
