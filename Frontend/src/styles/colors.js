/**
 * Centralized color palette for PhotoDock
 * Import and use these constants across all components
 * to ensure consistency and easy theming.
 */

const colors = {

    white: '#f7f7f7ff',
    black: '#000000',

    text: {
        primary: '#000000',
        heading: '#1a1a1a',
        dark: '#333333',
        medium: '#555555',
        light: '#666666',
        muted: '#888888',
        disabled: '#999999',
        faint: '#cccccc',
    },

    accent: {
        primary: '#4a7c59',
        dark: '#4a6d55',
        medium: '#5a7d65',
        hover: 'rgba(90, 125, 101, 0.1)',
        subtle: 'rgba(90, 125, 101, 0.06)',
    },

    button: {
        primary: '#8c958e',
        primaryHover: '#7a837c',
        outlineBorder: '#333333',
        outlineHoverBorder: '#000000',
        outlineHoverBg: 'rgba(0,0,0,0.02)',
    },

    border: {
        light: '1px solid rgba(0,0,0,0.05)',
        card: '1px solid #e0e0e0',
        section: '1px solid #e8e8e8',
        subtle: '1px solid #eee',
    },

    gold: '#8a6e2f',

    scrollbar: {
        thumb: 'rgba(0, 0, 0, 0.2)',
        thumbHover: 'rgba(0, 0, 0, 0.3)',
    },

    shadow: {
        cardHover: '0 10px 30px rgba(0,0,0,0.05)',
    },

    font: {
        serif: 'serif',
        sans: 'system-ui, -apple-system, sans-serif',
    },
};

export default colors;
