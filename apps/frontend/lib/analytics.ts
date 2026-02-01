/**
 * Analytics Utility Module
 *
 * Provides a unified interface for tracking user interactions, page views,
 * and conversion events. Integrates with Google Analytics 4 (GA4) using
 * the official @next/third-parties package.
 *
 * @see https://nextjs.org/docs/app/guides/third-party-libraries#google-analytics
 * @see https://developers.google.com/analytics/devguides/collection/ga4/events
 *
 * Key Concepts:
 * - Micro-conversions: Small actions indicating interest (view listing, click CTA)
 * - Macro-conversions: Major actions (booking, signup, quote request)
 *
 * Usage with gtag.js:
 * GA4 uses gtag('event', 'event_name', { parameters }) for custom events.
 * The sendGAEvent helper from @next/third-parties wraps this pattern.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Event categories for organizing analytics data
 */
export type EventCategory =
  | 'navigation' // Page views, routing
  | 'engagement' // User interactions
  | 'conversion' // Conversion events
  | 'ab_test' // A/B test assignments
  | 'error'; // Error tracking

/**
 * Predefined conversion events with structured naming
 * Convention: [action]_[object] in snake_case
 */
export type ConversionEvent =
  // Micro-conversions (engagement signals)
  | 'view_listing' // Viewed ad slot detail page
  | 'view_marketplace' // Viewed marketplace grid
  | 'filter_listings' // Applied filters
  | 'click_cta' // Clicked any call-to-action
  | 'open_modal' // Opened a modal (quote, form)
  | 'scroll_depth' // Scrolled to key sections
  // Macro-conversions (business outcomes)
  | 'submit_booking' // Submitted booking request
  | 'submit_quote' // Submitted quote request
  | 'subscribe_newsletter' // Newsletter subscription
  | 'complete_signup' // User registration
  | 'complete_login'; // User login

/**
 * Event properties that can be attached to any event
 */
export interface EventProperties {
  // Content identifiers
  listingId?: string;
  listingName?: string;
  listingType?: string;
  listingPrice?: number;

  // User context
  userRole?: 'sponsor' | 'publisher' | 'anonymous';
  isLoggedIn?: boolean;

  // Interaction context
  buttonText?: string;
  ctaLocation?: string;
  modalName?: string;
  filterType?: string;
  filterValue?: string;

  // A/B Testing
  experimentId?: string;
  variantId?: string;

  // Custom properties
  [key: string]: string | number | boolean | undefined;
}

/**
 * Page view properties for navigation tracking
 */
export interface PageViewProperties {
  path: string;
  title?: string;
  referrer?: string;
  searchParams?: Record<string, string>;
}

// ============================================================================
// GOOGLE ANALYTICS INTEGRATION
// ============================================================================

/**
 * Type declaration for Google Analytics gtag function
 * GA4 uses the gtag.js library which exposes a global gtag function
 *
 * The @next/third-parties package loads gtag.js and provides sendGAEvent
 * which wraps gtag('event', ...) calls.
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4/events
 */
interface GtagFunction {
  (command: 'config' | 'event' | 'set' | 'js', targetOrDate: string | Date, params?: Record<string, unknown>): void;
}

// Extend Window interface for gtag and dataLayer
declare global {
  interface Window {
    gtag?: GtagFunction;
    dataLayer?: unknown[];
  }
}

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if Google Analytics is available
 * GA may be blocked by ad blockers or not yet loaded
 */
function isGAAvailable(): boolean {
  return isBrowser() && typeof window.gtag === 'function';
}

/**
 * Get the GA4 Measurement ID from environment
 * Falls back to empty string if not configured
 */
function getGAMeasurementId(): string {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
}

/**
 * Send event to GA4 using gtag('event', ...)
 *
 * This is the standard GA4 event format as documented:
 * @see https://developers.google.com/analytics/devguides/collection/ga4/events
 *
 * @param eventName - Name of the event (e.g., 'button_click', 'purchase')
 * @param eventParams - Additional parameters for the event
 */
function sendEvent(eventName: string, eventParams?: Record<string, unknown>): void {
  if (isGAAvailable()) {
    // GA4 event format: gtag('event', 'event_name', { parameters })
    window.gtag?.('event', eventName, eventParams);
  }
}

// ============================================================================
// CORE ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Track a page view event
 *
 * Note: When using @next/third-parties GoogleAnalytics component,
 * page views are tracked automatically on route changes.
 * This function can be called for virtual page views (modals, tabs).
 *
 * @see https://nextjs.org/docs/app/guides/third-party-libraries#tracking-pageviews
 *
 * @param properties - Page view details including path and title
 */
export function trackPageView(properties: PageViewProperties): void {
  const { path, title, referrer } = properties;

  // Log in development for debugging
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[Analytics] Page View:', { path, title });
  }

  // Send page view to Google Analytics using gtag('config', ...)
  // The @next/third-parties component handles this automatically,
  // but we can trigger manual page views for virtual navigation
  if (isGAAvailable()) {
    window.gtag?.('config', getGAMeasurementId(), {
      page_path: path,
      page_title: title,
      page_referrer: referrer,
    });
  }

  // Also track as custom event for additional analytics
  trackEvent('navigation', 'page_view', {
    path,
    title,
  });
}

/**
 * Track a custom event
 *
 * Generic function for tracking any type of event.
 * Uses GA4's gtag('event', ...) format as documented:
 * @see https://developers.google.com/analytics/devguides/collection/ga4/events
 *
 * Prefer using the specific tracking functions (trackConversion, etc.)
 * for better type safety.
 *
 * @param category - Event category for grouping
 * @param action - The specific action being tracked
 * @param properties - Additional event properties
 */
export function trackEvent(
  category: EventCategory,
  action: string,
  properties?: EventProperties
): void {
  const eventData = {
    event_category: category,
    ...properties,
    // Add timestamp for event ordering
    timestamp: Date.now(),
  };

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[Analytics] Event:', action, eventData);
  }

  // Send to Google Analytics using gtag('event', ...)
  // This is the standard GA4 event format
  sendEvent(action, eventData);

  // Also push to data layer for other integrations (GTM, etc.)
  if (isBrowser()) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: action,
      ...eventData,
    });
  }
}

/**
 * Track a conversion event
 *
 * Conversion events are the key metrics for measuring business success.
 * They're automatically tagged with the 'conversion' category.
 *
 * @param event - The conversion event type
 * @param properties - Event properties with context
 *
 * @example
 * trackConversion('submit_booking', {
 *   listingId: 'abc123',
 *   listingPrice: 1000,
 *   userRole: 'sponsor'
 * });
 */
export function trackConversion(event: ConversionEvent, properties?: EventProperties): void {
  trackEvent('conversion', event, {
    ...properties,
    // Mark as conversion for GA4 conversion tracking
    conversion: true,
  });
}

/**
 * Track A/B test variant assignment
 *
 * Called when a user is assigned to an experiment variant.
 * Essential for analyzing test results.
 *
 * @param experimentId - Unique identifier for the experiment
 * @param variantId - The variant the user was assigned to
 * @param properties - Additional context
 */
export function trackExperiment(
  experimentId: string,
  variantId: string,
  properties?: EventProperties
): void {
  trackEvent('ab_test', 'experiment_viewed', {
    experimentId,
    variantId,
    ...properties,
  });
}

/**
 * Track an error event
 *
 * Use for tracking errors that impact user experience.
 *
 * @param errorType - Category of error
 * @param errorMessage - Error description
 * @param properties - Additional context
 */
export function trackError(
  errorType: string,
  errorMessage: string,
  properties?: EventProperties
): void {
  trackEvent('error', errorType, {
    errorMessage,
    ...properties,
  });
}

// ============================================================================
// CONVENIENCE TRACKING FUNCTIONS
// ============================================================================

/**
 * Track when a user views a listing detail page
 */
export function trackListingView(listing: {
  id: string;
  name: string;
  type: string;
  price: number;
}): void {
  trackConversion('view_listing', {
    listingId: listing.id,
    listingName: listing.name,
    listingType: listing.type,
    listingPrice: listing.price,
  });
}

/**
 * Track when a user clicks a CTA button
 */
export function trackCTAClick(
  buttonText: string,
  location: string,
  properties?: EventProperties
): void {
  trackConversion('click_cta', {
    buttonText,
    ctaLocation: location,
    ...properties,
  });
}

/**
 * Track filter interactions on marketplace
 */
export function trackFilterUse(filterType: string, filterValue: string): void {
  trackConversion('filter_listings', {
    filterType,
    filterValue,
  });
}

/**
 * Track booking submission
 */
export function trackBookingSubmit(listing: {
  id: string;
  name: string;
  price: number;
}): void {
  trackConversion('submit_booking', {
    listingId: listing.id,
    listingName: listing.name,
    listingPrice: listing.price,
  });
}

/**
 * Track quote request submission
 */
export function trackQuoteSubmit(listing: {
  id: string;
  name: string;
  price: number;
}): void {
  trackConversion('submit_quote', {
    listingId: listing.id,
    listingName: listing.name,
    listingPrice: listing.price,
  });
}

/**
 * Track newsletter subscription
 */
export function trackNewsletterSubscribe(source: string): void {
  trackConversion('subscribe_newsletter', {
    ctaLocation: source,
  });
}

// ============================================================================
// USER IDENTIFICATION
// ============================================================================

/**
 * Set user properties for analytics
 *
 * Call this when user logs in or when we know their role.
 * Properties persist across events in the session.
 *
 * @param userId - Optional user ID (don't use PII)
 * @param properties - User properties
 */
export function setUserProperties(
  userId?: string,
  properties?: {
    role?: 'sponsor' | 'publisher';
    accountAge?: number;
    [key: string]: string | number | undefined;
  }
): void {
  if (isGAAvailable() && userId) {
    window.gtag?.('config', getGAMeasurementId(), {
      user_id: userId,
    });
  }

  if (isGAAvailable() && properties) {
    window.gtag?.('set', 'user_properties', properties);
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[Analytics] User Properties:', { userId, ...properties });
  }
}
