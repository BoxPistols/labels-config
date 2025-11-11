/**
 * SDPF (Smart Drone Platform Frontend) Labels Example
 * Complete example showing all 20 labels from the original sdpf-frontend-next project
 */

import { LabelManager, CONFIG_TEMPLATES } from '../src/index'

/**
 * Create a label manager with SDPF template
 */
const manager = new LabelManager({
  labels: CONFIG_TEMPLATES.sdpf
})

/**
 * Log all SDPF labels
 */
console.log('SDPF Template Labels:')
console.log(`Total labels: ${manager.count()}\n`)

manager.getAllLabels().forEach((label) => {
  console.log(`  • ${label.name.padEnd(15)} | #${label.color} | ${label.description}`)
})

/**
 * Export as JSON
 */
const registry = manager.exportRegistry('1.0.0', {
  template: 'sdpf',
  source: 'Smart Drone Platform Frontend'
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
const templates = ['minimal', 'github', 'sdpf', 'agile'] as const
templates.forEach((template) => {
  const labels = CONFIG_TEMPLATES[template]
  console.log(`  • ${template.padEnd(10)}: ${labels.length} labels`)
})
