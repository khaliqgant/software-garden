import { fileURLToPath } from 'node:url'

import { PLANTS } from './plants.js'

export class Garden {
  constructor() {
    this.plants = []
    this.day = 0
  }

  plant(kind) {
    if (!(kind in PLANTS)) throw new Error(`Unknown plant: ${kind}`)
    this.plants.push({ kind, height: 0, water: 0, wilted: false })
    return this
  }

  water(kind) {
    const plant = this.plants.find((p) => p.kind === kind)
    if (!plant) throw new Error(`No ${kind} planted in this garden`)
    plant.water += 1
    return this
  }

  grow() {
    this.day += 1
    for (const plant of this.plants) {
      const spec = PLANTS[plant.kind]
      if (plant.water > spec.thirst) {
        plant.height += spec.rate
        plant.water = 0
        plant.wilted = false
      } else {
        plant.wilted = true
      }
    }
    return this
  }

  report() {
    return this.plants
      .map((p) => {
        const spec = PLANTS[p.kind]
        const state = p.wilted ? 'wilting' : 'growing'
        return `${spec.name} (${spec.color}) - day ${this.day}: ${p.height}cm, ${state}`
      })
      .join('\n')
  }
}

export function createDefaultGarden() {
  return new Garden().plant('rose').plant('tulip').plant('basil')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const garden = createDefaultGarden()
  garden.water('rose')
  garden.water('tulip')
  garden.water('basil')
  garden.water('basil')
  garden.grow()
  console.log(garden.report())
}
