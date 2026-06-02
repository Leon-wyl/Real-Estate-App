import { render, screen } from '@testing-library/react'
import { EmptyState } from '@/components/shared/EmptyState'
import { BrowserRouter } from 'react-router-dom'

describe('EmptyState', () => {
  it('renders the title text', () => {
    render(<EmptyState title="No results found" />)
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <EmptyState
        title="No results"
        description="Try adjusting your filters"
      />,
    )
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument()
  })

  it('renders action button when action is provided', () => {
    render(
      <BrowserRouter>
        <EmptyState
          title="Empty"
          action={{ label: 'Add Item', onClick: () => {} }}
        />
      </BrowserRouter>,
    )
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('action button has correct text', () => {
    render(
      <BrowserRouter>
        <EmptyState
          title="Empty"
          action={{ label: 'Add Item', onClick: () => {} }}
        />
      </BrowserRouter>,
    )
    expect(screen.getByText('Add Item')).toBeInTheDocument()
  })
})
