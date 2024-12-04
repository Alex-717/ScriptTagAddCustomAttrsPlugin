

const sum = (a, b) => {
  return a + b
}

console.log(sum(1, 3))

export {
  sum as default,
  sum
}

import('./test.js').then(module => {
  console.log('dddd+', module)
  const test = module.default
  console.log(test(10086, 5))
})