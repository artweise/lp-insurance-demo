/**
 * Alpine.js component for Landing Page interactions
 * Handles mobile navigation, lead generation, analytics, and sticky CTA
 */
function lp() {
  return {
    // === STATE MANAGEMENT ===

    mobileNav: false, // Mobile navigation menu open/closed state - CONNECTED (navbar.hbs)
    showSticky: false, // Sticky CTA visibility after scroll - CONNECTED (sticky_cta.hbs)
    sending: false, // Form submission loading state - NOT CONNECTED (needs lead forms)
    success: false, // Form submission success state - NOT CONNECTED (needs lead forms)
    utm: new URLSearchParams(location.search).toString(), // UTM parameters for analytics tracking

    // === ANALYTICS TRACKING ===

    /**
     * Track CTA button clicks for Google Analytics/GTM
     * CONNECTED: hero_bello.hbs, navbar.hbs, sticky_cta.hbs
     * TODO: Add to other CTA buttons (cta_banner.hbs, how_it_works.hbs, footer, etc.)
     *
     * Usage: @click="trackCta('button_identifier')"
     *
     * @param {string} label - Unique identifier for the CTA button
     */
    trackCta(label) {
      window.dataLayer?.push({ event: 'cta_click', label });
    },

    // === LEAD GENERATION ===

    /**
     * Handle lead form submissions with error handling and analytics
     * NOT CONNECTED - No forms exist yet
     * TODO: Create lead capture forms in:
     *   - Hero section (quote calculator)
     *   - Sidebar forms
     *   - Modal popups
     *   - Footer newsletter signup
     *
     * Usage: <form @submit.prevent="submitLead" data-submit="/custom-endpoint">
     *
     * @param {Event} e - Form submit event
     */
    async submitLead(e) {
      this.sending = true; // Show loading spinner
      this.success = false; // Hide success message

      // Build API endpoint URL with UTM parameters for tracking
      const url =
        (e.target.dataset.submit || '/api/lead') + // Custom endpoint or default
        (this.utm ? '?' + this.utm : ''); // Add UTM params

      // Convert form data to JSON object
      const body = Object.fromEntries(new FormData(e.target).entries());

      try {
        // Send lead data to backend API
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        // Track successful lead submission in GTM/GA
        window.dataLayer?.push({ event: 'lead_submit' });

        // Reset form and show success message
        e.target.reset();
        this.success = true;
      } catch {
        // Show user-friendly error message
        alert('Send error. Please try later.');
      } finally {
        // Always hide loading state
        this.sending = false;
      }
    },

    // === SCROLL-BASED UX ===

    /**
     * Initialize scroll-based sticky CTA behavior
     * Shows bottom CTA after user scrolls 600px (engaged user)
     * CONNECTED: sticky_cta.hbs (mobile only, md:hidden)
     *
     * Features:
     *   - Fixed positioning at bottom
     *   - x-show="showSticky" attribute
     *   - Smooth x-transition animations
     *   - Mobile-only display (md:hidden)
     *   - Backdrop blur effect
     *
     * Lifecycle: Called automatically when Alpine component mounts
     */
    init() {
      const onScroll = () => {
        this.showSticky = window.scrollY > 600; // Show after 600px scroll
      };

      onScroll(); // Check initial scroll position
      window.addEventListener('scroll', onScroll); // Listen for scroll events
    },
  };
}
window.lp = lp;
