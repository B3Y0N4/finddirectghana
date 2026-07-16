import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      {/* Kente colour stripe — Red | Gold | Green */}
      <div className="h-1 flex">
        <div className="flex-1 bg-ghana-red" />
        <div className="flex-1 bg-ghana-gold-flag" />
        <div className="flex-1 bg-ghana-green" />
      </div>
      <div className="max-w-content mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-ghana-green flex items-center justify-center flex-shrink-0">
                <span className="text-ghana-gold font-display font-bold text-xs leading-none">FD</span>
              </div>
              <div className="leading-none">
                <span className="font-display font-bold text-white text-sm">Find Direct</span>
                <span className="block text-[10px] font-medium text-ghana-green tracking-wide">Ghana</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Ghana&apos;s first verified owner-to-tenant rental platform. No agents. No viewing fees. No commission.
            </p>
            <p className="mt-4 text-xs text-white/30">
              Accra, Ghana · <a href="mailto:hello@finddirectghana.com" className="hover:text-ghana-gold transition-colors">hello@finddirectghana.com</a>
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">Platform</h3>
            <ul className="space-y-2.5">
              {[
                ['Browse Properties', '/listings'],
                ['List a Property',   '/list'],
                ['Blog',              '/blog'],
                ['How It Works',      '/how-it-works'],
                ['About Us',          '/about'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/60 hover:text-ghana-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">Trust & Safety</h3>
            <ul className="space-y-2.5">
              {[
                ['Verified Owners',     '/how-it-works#verification'],
                ['Report a Listing',    '/report'],
                ['Tenant Guidelines',   '/how-it-works#tenants'],
                ['Landlord Guidelines', '/how-it-works#landlords'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/60 hover:text-ghana-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            © 2026 Find Direct Ghana. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Built for Ghanaians, by Ghanaians.
          </p>
        </div>
      </div>
    </footer>
  )
}
