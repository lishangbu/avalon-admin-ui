import twc from './src/utils/tailwindColor'

import type { Config } from 'tailwindcss'

const targetShades = ['25', '150', '250', '350', '450', '550', '650', '750', '850'] as const

function extractShades(colorObject: Record<string, Record<string, string>>) {
  const result: Record<string, Partial<Record<string, string>>> = {}

  for (const [colorName, shades] of Object.entries(colorObject)) {
    const extracted: Partial<Record<string, string>> = {}

    targetShades.forEach((shade) => {
      if (shades[shade]) {
        extracted[shade] = shades[shade]
      }
    })

    if (Object.keys(extracted).length > 0) {
      result[colorName] = extracted
    }
  }

  return result
}

export default <Config>{
  theme: {
    extend: {
      colors: extractShades(twc),
    },
  },
}
