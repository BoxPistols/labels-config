/**
 * Production Labels Example
 * Complete example showing production-ready label configuration
 */

import { LabelManager, CONFIG_TEMPLATES } from '../src/index'

/**
 * Create a label manager with production template
 */
const manager = new LabelManager({
  labels: CONFIG_TEMPLATES.prod
})

/**
 * Log all production labels
 */
console.log('Production Template Labels:')
console.log(`Total labels: ${manager.count()}\n`)

manager.getAllLabels().forEach((label) => {
  console.log(`  • ${label.name.padEnd(15)} | #${label.color} | ${label.description}`)
})

/**
 * Export as JSON
 */
const registry = manager.exportRegistry('1.0.0', {
  template: 'prod',
  source: 'Production Project'
})

console.log('\n\nExported Registry:')
console.log(JSON.stringify(registry, null, 2))

/**
 * Search example
 */
console.log('\n\nSearch for "技術":')
const results = manager.search('技術')
results.forEach((label) => {
  console.log(`  • ${label.name}: ${label.description}`)
})

/**
 * Template comparison
 */
console.log('\n\nAvailable Templates:')
const templates = ['minimal', 'github', 'prod', 'prod-en', 'prod-ja', 'react', 'vue', 'frontend', 'agile'] as const
templates.forEach((template) => {
  const labels = CONFIG_TEMPLATES[template]
  console.log(`  • ${template.padEnd(10)}: ${labels.length} labels`)
})
