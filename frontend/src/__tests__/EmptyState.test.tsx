import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState } from '../EmptyState';
import React from 'react';

describe('EmptyState component', () => {
  it('renders title', () => {
    render(React.createElement(EmptyState, { title: 'No data' }));
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders action button and handles click', () => {
    const onClick = vi.fn();
    render(React.createElement(EmptyState, { title: 'Empty', action: { label: 'Add', onClick } }));
    fireEvent.click(screen.getByText('Add'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
