const logos = [
  { name: 'Stripe', url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg' },
  { name: 'AWS', url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
  { name: 'Vercel', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg' },
  { name: 'PostgreSQL', url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg' },
  { name: 'React', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
  { name: 'Node.js', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg' },
];

export default function LogoMarquee() {
  return (
    <section className="py-12 border-b border-outline-variant/30 bg-surface-container-low/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-margin-desktop px-margin-mobile flex flex-col items-center">
        <p className="text-sm font-label-sm tracking-widest uppercase text-on-surface-variant mb-8 text-center">
          Powered by the same technology used by global companies
        </p>
        <div className="flex justify-center flex-wrap gap-8 md:gap-16 items-center opacity-60 hover:opacity-100 transition-opacity duration-500">
          {logos.map((logo) => (
            <img 
              key={logo.name}
              src={logo.url} 
              alt={logo.name} 
              className="h-7 max-w-[120px] object-contain grayscale hover:grayscale-0 transition-all duration-300 ease-in-out cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
