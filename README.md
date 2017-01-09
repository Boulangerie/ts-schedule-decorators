# Schedule decorators for TypeScript
[![Build Status](https://img.shields.io/travis/Boulangerie/ts-schedule-decorators.svg?style=flat-square)](https://travis-ci.org/Boulangerie/ts-schedule-decorators)
[![Coveralls](https://img.shields.io/coveralls/Boulangerie/ts-schedule-decorators.svg?branch=master)](https://coveralls.io/github/Boulangerie/ts-schedule-decorators)
[![npm version](https://img.shields.io/npm/v/ts-schedule-decorators.svg?style=flat-square)](https://www.npmjs.org/package/ts-schedule-decorators)
[![npm downloads](https://img.shields.io/npm/dm/ts-schedule-decorators.svg?style=flat-square)](http://npm-stat.com/charts.html?package=ts-schedule-decorators&from=2016-01-09)
[![npm dependencies](https://img.shields.io/david/Boulangerie/ts-schedule-decorators.svg)](https://david-dm.org/Boulangerie/ts-schedule-decorators)
[![npm devDependencies](https://img.shields.io/david/dev/Boulangerie/ts-schedule-decorators.svg)](https://david-dm.org/Boulangerie/ts-schedule-decorators)
[![npm license](https://img.shields.io/npm/l/ts-schedule-decorators.svg)](https://www.npmjs.org/package/ts-schedule-decorators)

The schedule decorators library provides a simple, ES5+ compatible, lightweight and universal decorator **to easily make recurrent function calls**.
The decorator uses the standard [window.setInterval()](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) function internally, makes the code clearer and avoid code duplication.

## Install
The easiest way is to install `ts-schedule-decorators` as `dependency`:
```sh
npm install ts-schedule-decorators --save
```

## Usage
#### Schedule an instance method
Instance methods will be executed after instantiation.
```ts
@Schedulable()
class Cat {

  @Interval(1000)
  public meow() {
    console.log('Meeeooow')
  }
}

const garfield = new Cat()
// Displays:
// 2017-01-09 12:12:35 Meeeooow
// 2017-01-09 12:12:36 Meeeooow
// 2017-01-09 12:12:37 Meeeooow
...
```

#### Schedule a static method
Static methods will be executed on declaration.
```ts
@Schedulable()
class Cat {

  @Interval(1000)
  public static miaow() {
    console.log('Miaaooow')
  }
}

// Displays:
// 2017-01-09 12:16:41 Miaaooow
// 2017-01-09 12:16:42 Miaaooow
// 2017-01-09 12:16:43 Miaaooow
...
```

#### Allow manual invocation
By default and to be safe, an interval method cannot be invoked manually. However, you can avoid this behavior by setting the `protectOriginal` option to `false`.
```ts
@Schedulable()
class Cat {

  @Interval(1000)
  public static miaow() {
    console.log('Miaaooow')
  }
}

Cat.miaow()
// Displays:
// Uncaught Error: interval method cannot be invoked

@Schedulable()
class Cat {

  @Interval(1000, { protectOriginal: false })
  public static miaow() {
    console.log('Miaaooow')
  }
}

Cat.miaow()
// Displays:
// 2017-01-09 12:55:33 Miaaooow
// 2017-01-09 12:55:34 Miaaooow
// 2017-01-09 12:55:35 Miaaooow
// 2017-01-09 12:55:36 Miaaooow
```

#### Execute the method on the leading edge
If the option `leading` is set to `true`, then the method will be invoked on the leading edge as well.
```ts
@Schedulable()
class Cat {

  @Interval(1000, { leading: true })
  public static miaow() {
    console.log('Miaaooow')
  }
}

// Displays:
// 2017-01-09 12:18:18 Miaaooow
// 2017-01-09 12:18:19 Miaaooow
// 2017-01-09 12:18:20 Miaaooow
// 2017-01-09 12:18:21 Miaaooow
...
```

#### Stopping condition
The execution of the method can be stopped providing a function to the `stop` option. If the invokation of this function returns `true`, then the interval is cleared.
```ts
@Schedulable()
class Cat {

  public static stopIt: boolean = false
  
  @Interval(1000, { stop: self => return self.stopIt })
  public static miaow() {
    console.log('Miaaooow')
    Cat.stopIt = true
  }
}

// Displays:
// 2017-01-09 12:18:18 Miaaooow
// 2017-01-09 12:18:19 Miaaooow
// 2017-01-09 12:18:20 Miaaooow
// 2017-01-09 12:18:21 Miaaooow
...
```

## License
Code licensed under [MIT License](LICENSE).
