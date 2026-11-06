import Script from 'next/script';

// Google Analytics 4. The measurement ID is public (it ships in every page's HTML),
// so it lives here; NEXT_PUBLIC_GA_ID can override it per environment.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-L6PRLN28MM';

// Bookings happen over WhatsApp and phone, so those clicks are the conversions.
// One delegated listener covers every wa.me / tel: link on the site, including
// links added later. Mark whatsapp_click and phone_click as key events in GA4.
const CLICK_TRACKING = `
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
  if (!a || typeof gtag !== 'function') return;
  var href = a.getAttribute('href') || '';
  var name = /^https:\\/\\/(wa\\.me|api\\.whatsapp\\.com)\\//.test(href) ? 'whatsapp_click'
           : href.indexOf('tel:') === 0 ? 'phone_click' : null;
  if (!name) return;
  gtag('event', name, {
    link_url: href.split('?')[0],
    link_text: (a.textContent || '').trim().slice(0, 80),
    page_path: location.pathname
  });
}, { capture: true });
`;

export function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());if(!/^\\/(admin|owner-analytics)/.test(location.pathname)){gtag('config','${GA_ID}');${CLICK_TRACKING}}`}
      </Script>
    </>
  );
}
