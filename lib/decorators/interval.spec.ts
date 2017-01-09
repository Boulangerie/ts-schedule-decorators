import { Schedulable } from './schedulable'
import { Interval, intervalMetadataKey } from './interval'
import { expect } from 'chai'
import * as sinon from 'sinon'

describe('Interval decorator', () => {
  it('should add metadata to the class prototype when decorating an instance method with "@Interval()"', () => {
    @Schedulable()
    class Cat {
      @Interval(50)
      public meow() { }
    }

    expect(Reflect.getOwnMetadata(intervalMetadataKey, Cat)).to.be.empty
    expect(Reflect.getOwnMetadata(intervalMetadataKey, Cat.prototype)).to.have.lengthOf(1)

    const interval = Reflect.getOwnMetadata(intervalMetadataKey, Cat.prototype)[0]
    expect(interval).to.deep.equal({
      propertyKey: 'meow',
      delay: 50,
      options: {
        leading: false,
        protectOriginal: true
      }
    })

  })

  it('should execute an instance method at regular intervals', (done) => {
    const callback = sinon.spy()
    @Schedulable()
    class Cat {
      @Interval(100)
      public meow() {
        callback()
      }
    }

    expect(callback.called).to.be.false
    const garfield = new Cat()
    setTimeout(() => {
      expect(callback.callCount).to.equal(3)
      done()
    }, 390)
  })

  it('should add metadata to the class prototype when decorating an instance method with "@Interval()"', () => {
    @Schedulable()
    class Cat {
      @Interval(50)
      public static miaow() { }
    }

    expect(Reflect.getOwnMetadata(intervalMetadataKey, Cat)).to.have.lengthOf(1)
    expect(Reflect.getOwnMetadata(intervalMetadataKey, Cat.prototype)).to.be.empty

    const interval = Reflect.getOwnMetadata(intervalMetadataKey, Cat)[0]
    expect(interval).to.deep.equal({
      propertyKey: 'miaow',
      delay: 50,
      options: {
        leading: false,
        protectOriginal: true
      }
    })
  })

  it('should execute a static method at regular intervals', (done) => {
    const callback = sinon.spy()
    @Schedulable()
    class Cat {
      @Interval(100)
      public static miaow() {
        callback()
      }
    }

    expect(callback.called).to.be.false
    setTimeout(() => {
      expect(callback.callCount).to.equal(3)
      done()
    }, 390)
  })

  it('should execute a method once more if the "leading" option is true', (done) => {
    const callback = sinon.spy()
    @Schedulable()
    class Cat {
      @Interval(100, { leading: true })
      public meow() {
        callback()
      }
    }

    expect(callback.called).to.be.false
    const garfield = new Cat()
    setTimeout(() => {
      expect(callback.callCount).to.equal(4)
      done()
    }, 390)
  })

  it('should stop the intervals if the "stop" function given as option returns true', (done) => {
    const callback = sinon.spy()
    @Schedulable()
    class Cat {

      public shouldStop: boolean = false

      public constructor() {
        setTimeout(() => {
          this.shouldStop = true
        }, 70)
      }

      @Interval(50, {
        stop: (self) => {
          return self.shouldStop
        }
      })
      public meow() {
        callback()
      }
    }

    expect(callback.called).to.be.false
    const garfield = new Cat()
    setTimeout(() => {
      expect(callback.callCount).to.equal(1)
      done()
    }, 190)
  })

  it('should throw an error if the decorated member is not a function', () => {
    const declaration = () => {
      @Schedulable()
      class Cat {
        @Interval(50)
        public name: string = 'Garfield'
      }
    }

    expect(declaration).to.throw('Interval decorator can only be applied to methods')
  })

  it('should throw an error if the method is called manually while the "protectOriginal" property is true', () => {

    @Schedulable()
    class Cat {
      @Interval(50)
      public meow() { }
      @Interval(50)
      public static miaow() { }
    }

    const garfield = new Cat()
    expect(garfield.meow).to.throw('interval method cannot be invoked')
    expect(Cat.miaow).to.throw('interval method cannot be invoked')
  })

  it('should not throw an error if the method is called manually while the "protectOriginal" property is false', () => {

    @Schedulable()
    class Cat {
      @Interval(50, { protectOriginal: false })
      public meow() { }
      @Interval(50, { protectOriginal: false })
      public static miaow() { }
    }

    const garfield = new Cat()
    expect(garfield.meow).not.to.throw('interval method cannot be invoked')
    expect(Cat.miaow).not.to.throw('interval method cannot be invoked')
  })

})
