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
  
  // Write the processed CSS
  const outputPath = path.join(__dirname, 'dist/styles-processed.css')
  fs.writeFileSync(outputPath, result.css)
  
  console.log('✓ Built processed CSS file:', outputPath)
}

buildCSS().catch(console.error)
