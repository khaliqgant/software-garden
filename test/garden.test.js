import assert from 'node:assert/strict'
import test from 'node:test'

import { Garden } from '../garden.js'
import { PLANTS } from '../plants.js'

test('a generously watered tulip grows a full day', () => {
  const garden = new Garden().plant('tulip')
  garden.water('tulip').water('tulip').grow()

  const [tulip] = garden.plants
  assert.equal(tulip.height, PLANTS.tulip.rate)
  assert.equal(tulip.wilted, false)
})

test('a dry plant wilts', () => {
  const garden = new Garden().plant('basil')
  garden.grow()

  assert.equal(garden.plants[0].wilted, true)
})

test('the report lists every plant with its height', () => {
  const garden = new Garden().plant('rose').plant('tulip')
  garden.water('rose').water('rose').water('tulip').water('tulip')
  garden.grow()

  const report = garden.report()
  assert.ok(report.includes('Rose (red)'))
  assert.ok(report.includes('Tulip (pink)'))
  assert.ok(report.includes('day 1'))
})
