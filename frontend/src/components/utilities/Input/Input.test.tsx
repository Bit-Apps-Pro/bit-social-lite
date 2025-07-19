import EditIcon from '@icons/EditIcon'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import Input from './Input'

describe('test Input component', () => {
  afterEach(cleanup)

  it('should render Input with title', () => {
    render(<Input title="Tag name" />)
    const inputElm = screen.getByText('Tag name')
    expect(inputElm.textContent).toBe('Tag name')
  })
  it('should render Invalid message with isInvalid', () => {
    render(<Input invalidMessage="Invalid message" isInvalid />)
    const inputElm = screen.getByText('Invalid message')
    expect(inputElm.textContent).toBe('Invalid message')
  })
  it('should render Helper Text without isInvalid & invalid Message', () => {
    render(<Input helperText="this is helper text" />)
    const inputElm = screen.getByText('this is helper text')
    expect(inputElm.textContent).toBe('this is helper text')
  })
  it('should render Helper Text with isInvalid & without invalid Message', () => {
    render(<Input helperText="This is helper text" isInvalid />)
    const inputElm = screen.queryByText('This is helper text')
    expect(inputElm?.textContent).toBe('This is helper text')
  })
  it('should render with placeholder', () => {
    render(<Input placeholder="Write tag name" />)
    const inputElm = screen.getByPlaceholderText('Write tag name')
    expect(inputElm.nodeName).toBe('INPUT')
  })
  it('should render with value', () => {
    render(<Input value="This is value" />)
    const inputElm = screen.getByDisplayValue('This is value')
    expect(inputElm).toBeTruthy()
  })
  it('should render with Loader', () => {
    render(<Input isLoading />)
    const inputElm = screen.getByTestId('spinnerLoader')
    expect(inputElm).toBeTruthy()
  })
  it('should render a outline variant Input', () => {
    render(<Input variant="outline" />)
    const inputElm = screen.getByTestId('inputComponent').getAttribute('class')
    expect(inputElm).toMatch(/outline/i)
  })
  it('should render a Input with leadingIcon', () => {
    render(<Input leadingIcon={<EditIcon size={16} stroke={2} />} />)
    const inputElm = screen.getByTestId('inputComponent').getAttribute('class')
    expect(inputElm).toMatch(/leadingicon/i)
  })
  it('should render a Input with trailingIcon', () => {
    render(<Input trailingIcon={<EditIcon size={16} stroke={2} />} />)
    const inputElm = screen.getByTestId('inputComponent').getAttribute('class')
    expect(inputElm).toMatch(/trailingicon/i)
  })
})
