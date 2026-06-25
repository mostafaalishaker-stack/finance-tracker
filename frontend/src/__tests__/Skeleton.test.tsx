import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkeletonCard, SkeletonList } from '../Skeleton';
import React from 'react';

describe('Skeleton components', () => {
  it('renders SkeletonCard with correct structure', () => {
    const { container } = render(React.createElement(SkeletonCard));
    const items = container.querySelectorAll('.skeleton');
    expect(items.length).toBeGreaterThanOrEqual(3);
  });

  it('renders SkeletonList with default count 3', () => {
    const { container } = render(React.createElement(SkeletonList));
    const items = container.querySelectorAll('.skeleton');
    expect(items.length).toBe(3);
  });

  it('renders SkeletonList with custom count 5', () => {
    const { container } = render(React.createElement(SkeletonList, { count: 5 }));
    const items = container.querySelectorAll('.skeleton');
    expect(items.length).toBe(5);
  });
});
