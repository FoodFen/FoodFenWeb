import { resources } from './resources'

// Languages differ in plural forms (Vietnamese has only `_other`), so `days_one` counts as `days`.
const PLURAL = /_(zero|one|two|few|many|other)$/

const keys = (value: object, prefix = ''): string[] => [
  ...new Set(
    Object.entries(value).flatMap(([key, child]) =>
      typeof child === 'object' && child !== null
        ? keys(child, `${prefix}${key}.`)
        : [`${prefix}${key.replace(PLURAL, '')}`],
    ),
  ),
]

describe.each(Object.keys(resources.vi) as (keyof typeof resources.vi)[])('namespace %s', (ns) => {
  test('en has exactly the keys of vi', () => {
    expect(keys(resources.en[ns]).sort()).toEqual(keys(resources.vi[ns]).sort())
  })
})
