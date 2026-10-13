import { resources } from './resources'

const keys = (value: object, prefix = ''): string[] =>
  Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'object' && child !== null
      ? keys(child, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )

describe.each(Object.keys(resources.vi) as (keyof typeof resources.vi)[])('namespace %s', (ns) => {
  test('en has exactly the keys of vi', () => {
    expect(keys(resources.en[ns]).sort()).toEqual(keys(resources.vi[ns]).sort())
  })
})
