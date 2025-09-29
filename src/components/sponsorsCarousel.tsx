export default function SponsorsInfiniteCarousel() {
  const logos = Array.from({ length: 4 }).map((_, idx) => ({
    src: `/sponsors/sponsor${idx + 1}.png`,
    alt: `Patrocinador ${idx}`,
    name: `Patrocinador ${idx}`,
  }));

  return (
    <div className="mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Empresas parceiras
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Conheça algumas das empresas que contam com a gente!
        </p>
      </div>

      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
        {Array.from({ length: 3 }).map((el, idx) => {
          return (
            <ul
              key={idx}
              aria-hidden={idx !== 0}
              className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll-mobile md:animate-infinite-scroll-desktop"
            >
              {logos.map((image) => (
                <li key={image.alt}>
                  <img
                    src={image.src}
                    width={50}
                    height={50}
                    className="h-12 object-cover w-auto dark:invert"
                    alt={image.alt}
                  />
                </li>
              ))}
            </ul>
          );
        })}
      </div>
    </div>
  );
}
