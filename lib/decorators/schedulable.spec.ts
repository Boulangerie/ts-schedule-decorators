import 'reflect-metadata'
import { Schedulable } from './schedulable'
import { intervalMetadataKey } from './interval'
import { expect } from 'chai'
import * as sinon from 'sinon'

describe('Schedulable decorator', () => {
  it('should override the class without changing its prototype nor constructor', () => {
    @Schedulable()
    class Cat {
      public name: string = 'Garfield'
      public gender: string
      public constructor() {
        this.gender = 'male'
      }
      public meow() {

      }
    }

    expect(Cat).to.be.a('function')
    const garfield = new Cat()
    expect(garfield).to.be.an.instanceOf(Cat)
    expect(garfield.name).to.equal('Garfield')
    expect(garfield.gender).to.equal('male')
    expect(garfield.meow).to.be.a('function')

  })
})
