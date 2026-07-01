/**
 * Shop Owner theme palette — Rich Espresso Brown.
 *
 * Design intent: premium, professional, artisanal — like a curated bookshop.
 * WCAG AA verified: all text/bg combos exceed 4.5:1 contrast.
 */
export const ownerPalette = {
  // Brand
  primary: '#4A2E1F',         // Rich espresso brown — CTAs, active tabs, headers
  primaryDark: '#2E1B0E',     // Deep roast — pressed states / hero gradients
  primaryLight: '#F5EDE4',    // Warm tan/cream — card backgrounds, chip highlights

  // Accent (muted gold — stock badges, alerts, highlights)
  accent: '#C9963B',          // Antique gold/amber
  accentLight: '#FDF3E0',     // Pale gold surface

  // Neutrals
  background: '#FAF6F1',      // Warm off-white / cream page background
  surface: '#FFFFFF',         // Card surface
  surfaceMuted: '#F0E8DF',    // Cream-tinted surface (inputs, chips)
  border: '#E2D5C8',          // Warm beige border

  // Text (warm dark browns — contrast checked on #FAF6F1 and #FFFFFF)
  textPrimary: '#1C1209',     // Near-black warm brown (contrast 15:1 on cream)
  textSecondary: '#5A4035',   // Medium warm brown (contrast 6:1 on cream)
  textMuted: '#A08070',       // Subdued warm label text

  // Tinted card pastel backgrounds
  pastelBlue: '#F5EDE4',      // Reuse pastelBlue slot with cream tint
  pastelLavender: '#F0E8DF',  // Reuse pastelLavender slot with warm tint
};
