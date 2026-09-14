/**
 * stardust/scripts/eds/encoders/market-landing.mjs — market-landing family (archetype nb-bank-privat-html; siblings bedrift, om-oss).
 * Overrides for THIS family: content-columns (tiles via the rail | index columns | editorial cols), card-rail (generic rail: news meta as
 * <em>tag</em> <em>date</em> runs, link-cards, grid-N), split-media (media-right → text-first, SVG media → illu). Hero (campaign) and
 * promo-band (promo-2 / solo) come from the core encoders.
 */
import { contentColumns, rail, themeSplit } from './theme.mjs';

export default {
  'content-columns': contentColumns,
  'card-rail': rail,
  'split-media': themeSplit,
};
