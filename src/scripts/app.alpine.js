function lp() {
  return {
    mobileNav: false,
    showSticky: false,
    sending: false,
    success: false,
    utm: new URLSearchParams(location.search).toString(),

    trackCta(label) {
      window.dataLayer?.push({ event: 'cta_click', label });
    },

    async submitLead(e) {
      this.sending = true;
      this.success = false;
      const url =
        (e.target.dataset.submit || '/api/lead') +
        (this.utm ? '?' + this.utm : '');
      const body = Object.fromEntries(new FormData(e.target).entries());
      try {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        window.dataLayer?.push({ event: 'lead_submit' });
        e.target.reset();
        this.success = true;
      } catch {
        alert('Send error. Please try later.');
      } finally {
        this.sending = false;
      }
    },

    // показать нижнюю CTA после прокрутки
    init() {
      const onScroll = () => {
        this.showSticky = window.scrollY > 600;
      };
      onScroll();
      window.addEventListener('scroll', onScroll);
    },
  };
}
window.lp = lp;
