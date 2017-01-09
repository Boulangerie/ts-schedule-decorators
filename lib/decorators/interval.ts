import 'reflect-metadata'

export const intervalMetadataKey = Symbol('interval')

export function Interval(delay: number, options: IIntervalOptions = { leading: false, protectOriginal: true }): Function {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (typeof target[propertyKey] !== 'function') {
      throw new Error('Interval decorator can only be applied to methods')
    }
    const existingIntervals: Array<IInterval> = Reflect.getOwnMetadata(intervalMetadataKey, target) || []
    const interval: IInterval = {
      propertyKey: propertyKey,
      delay: delay,
      options: options
    }
    existingIntervals.push(interval)
    Reflect.defineMetadata(intervalMetadataKey, existingIntervals, target)
  }
}

export interface IInterval {
  propertyKey: string
  delay: number
  options?: IIntervalOptions
}

export interface IIntervalOptions {
  leading?: boolean
  protectOriginal?: boolean
  stop?: Function
}
