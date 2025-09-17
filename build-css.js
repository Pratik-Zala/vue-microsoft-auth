const fs = require('fs')
const path = require('path')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')

async function buildCSS() {
  // Read the source CSS file
  const cssPath = path.join(__dirname, 'src/styles.css')
  const css = fs.readFileSync(cssPath, 'utf8')
  
  // Read the tailwind config
  const configPath = path.join(__dirname, 'tailwind.config.js')
  const tailwindConfig = require(configPath)
  
  // Process the CSS with PostCSS and Tailwind
  const result = await postcss([
    tailwindcss(tailwindConfig),
    autoprefixer
  ]).process(css, {
    from: cssPath,
    to: path.join(__dirname, 'dist/styles-processed.css')
  })
  
  // Scope all utility classes under .twymx-scope to avoid conflicts
  let scopedCSS = result.css
  
  // Add scope prefix to all utility classes (but not CSS variables or @layer rules)
  scopedCSS = scopedCSS.replace(
    /^(\s*)(\.(?!twymx-scope)[a-zA-Z0-9_-]+(?:[a-zA-Z0-9_:-]*)?)\s*{/gm,
    '$1.twymx-scope $2 {'
  )
  
  // Also handle pseudo-classes and responsive variants
  scopedCSS = scopedCSS.replace(
    /^(\s*)(\.(?!twymx-scope)[a-zA-Z0-9_-]+(?:\:[a-zA-Z0-9_-]+)*(?:\\[a-zA-Z0-9_:-]*)*)\s*{/gm,
    '$1.twymx-scope $2 {'
  )
  
  // Write the processed CSS
  const outputPath = path.join(__dirname, 'dist/styles-processed.css')
  fs.writeFileSync(outputPath, scopedCSS)
  
  console.log('✓ Built scoped CSS file:', outputPath)
}

buildCSS().catch(console.error)
