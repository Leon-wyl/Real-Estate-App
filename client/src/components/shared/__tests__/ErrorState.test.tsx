import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorState } from '@/components/shared/ErrorState'

describe('ErrorState', () => {
  it('renders default error message', () => {
    render(<ErrorState />)
    expect(
      screen.getByText('Something went wrong. Please try again.'),
    ).toBeInTheDocument()
  })

  it('renders custom error message', () => {
    render(<ErrorState message="Failed to load data" />)
    expect(screen.getByText('Failed to load data')).toBeInTheDocument()
  })

  it('renders retry button when onRetry is provided', () => {
    render(<ErrorState onRetry={() => {}} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('clicking retry calls onRetry', () => {
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)
    fireEvent.click(screen.getByText('Try Again'))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('has role="alert"', () => {
    render(<ErrorState />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
