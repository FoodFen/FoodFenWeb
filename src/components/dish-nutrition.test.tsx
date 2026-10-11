import { render, screen } from '@testing-library/react'
import { DishNutrition } from '@/components/dish-nutrition'
import type { DietTag } from '@/lib/diet-tag'

const nutrition = { servingG: 450, kcal: 430, proteinG: 25, carbsG: 60, fatG: 10, fiberG: null }

const renderTag = (dietTag: DietTag) => render(<DishNutrition {...nutrition} dietTag={dietTag} />)

test('labels vegan and vegetarian dishes', () => {
  renderTag('vegan')
  expect(screen.getByText('Thuần chay')).toBeInTheDocument()
  renderTag('vegetarian')
  expect(screen.getByText('Chay')).toBeInTheDocument()
})

test('shows no tag label for a dish without a diet tag', () => {
  renderTag('none')
  expect(screen.queryByText('Không chay')).not.toBeInTheDocument()
  expect(screen.queryByText('Chay')).not.toBeInTheDocument()
})
