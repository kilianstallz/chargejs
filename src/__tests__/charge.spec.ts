import 'mocha'
import {expect} from 'chai'
import { Application } from '../charge'

describe('Charge()', () => {
  const charge = new Application()
  it('should init the App with default values', () => {
    const eq = new Object(charge.options).toString === new Object(charge.defaultConfiguration()).toString
    expect(eq).to.be.true
  })
})

