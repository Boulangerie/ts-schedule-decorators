import 'reflect-metadata'
import { intervalMetadataKey, IInterval } from './interval'

export function Schedulable(): Function {
  return function decoratorFactory(target: any, decoratedPropertyName?: string): void {

    let staticIntervals: Array<IInterval> = Reflect.getOwnMetadata(intervalMetadataKey, target)
    let instanceIntervals: Array<IInterval> = Reflect.getOwnMetadata(intervalMetadataKey, (<any>target).prototype)

    // execute static intervals
    executeIntervals(staticIntervals, target)

    const f = (Function('f', `return function ${target.name}(){ return f.apply(this, arguments) }`))(function () {
      target.apply(this, arguments)

      // execute instance intervals
      executeIntervals(instanceIntervals, this)
    })

    Object.assign(f, target)
    f.prototype = target.prototype

    copyMetadata(target, f)

    return f
  }
}

function copyMetadata(source: any, dest: any): void {
  const metadataKeys = Reflect.getMetadataKeys(source)
  for (let metadataKey of metadataKeys) {
    const metadata = Reflect.getOwnMetadata(metadataKey, source)
    Reflect.defineMetadata(metadataKey, metadata, dest)
  }
}

function executeIntervals(intervals: Array<IInterval>, target: any): void {
  if (Array.isArray(intervals)) {
    for (let interval of intervals) {
      const fn = target[interval.propertyKey]

      if (interval.options.protectOriginal !== false) {
        target[interval.propertyKey] = () => {
          throw new Error('interval method cannot be invoked')
        }
      }

      (() => {
        const intervalID = setInterval(() => {
          if ((typeof interval.options.stop !== 'function') || (interval.options.stop(target) !== true)) {
            fn.call(target)
          } else {
            clearInterval(intervalID)
          }
        }, interval.delay)
      })()

      if (interval.options.leading) {
        fn.call(target)
      }
    }
  }
}
