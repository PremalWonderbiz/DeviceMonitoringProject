import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Badge from '@/components/customcomponents/Badge';

describe('Badge', () => {
    it('renders the label', () => {
        render(<Badge label="Test Label" />);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('applies default styles when no bgColor or textColor is provided', () => {
        render(<Badge label="Default Styles" />);
        const badge = screen.getByText('Default Styles');
        expect(badge.className).toContain('badge');
    });

    it('applies bgColor and textColor styles when provided', () => {
        render(<Badge label="Colored Badge" bgColor="red" textColor="white" />);
        const badge = screen.getByText('Colored Badge');
        expect(badge.className).toContain('badgebg--red');
        expect(badge.className).toContain('badgetext--white');
    });
});