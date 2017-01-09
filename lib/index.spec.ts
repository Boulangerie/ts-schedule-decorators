import { Schedulable, Interval } from './index'
import { expect } from 'chai'

describe('Schedule decorators index', () => {
  it('should export the decorators', () => {
    expect(Schedulable).to.be.a('function')
    expect(Interval).to.be.a('function')
  })
  it('should ok', () => {
    expect(true).to.be.true
  })
})
