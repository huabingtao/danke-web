import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdSlot from '../components/AdSlot';
import { AD_CONFIG } from '../lib/ad-config';
afterEach(() => { AD_CONFIG['page-bottom'] = { enabled: false }; });
describe('AdSlot', () => {
  it('renders no wrapper or reserved space when disabled or incomplete', () => {
    const { container, rerender } = render(<AdSlot slot="page-bottom" className="mt-8" />);
    expect(container).toBeEmptyDOMElement();
    AD_CONFIG['page-bottom'] = { enabled: true };
    rerender(<AdSlot slot="page-bottom" />);
    expect(container).toBeEmptyDOMElement();
  });
  it('labels configured banners and uses the configured destination', () => {
    AD_CONFIG['page-bottom'] = { enabled: true, imageSrc: '/assets/strategy-cover-4th.png', href: 'https://example.com', alt: '合作推广' };
    render(<AdSlot slot="page-bottom" />);
    expect(screen.getByRole('complementary', { name: '广告' })).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByRole('img')).toHaveAttribute('alt', '合作推广');
  });
});
