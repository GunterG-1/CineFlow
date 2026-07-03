import { useEffect, useState } from 'react';
import './carousel.css';

function HeroCarousel({ slides = [], onSlideClick }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 8000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  if (!slides.length) {
    return null;
  }

  const previousSlide = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
  };

  return (
    <section className="carrusel-hero">
      <div className="carousel-fade">
        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-item ${index === activeIndex ? 'active' : ''} ${onSlideClick ? 'carousel-item--clickable' : ''}`}
              style={{ backgroundImage: `url(${slide.imageSrc})` }}
              role={onSlideClick ? 'button' : undefined}
              tabIndex={onSlideClick ? 0 : undefined}
              onClick={onSlideClick ? () => onSlideClick(slide) : undefined}
              onKeyDown={
                onSlideClick
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onSlideClick(slide);
                      }
                    }
                  : undefined
              }
            >
              {slide.tag || slide.title || slide.ctaText ? (
                <div className="carousel-caption">
                  {slide.tag ? <span className="carousel-tag">{slide.tag}</span> : null}
                  {slide.title ? <h2 className="carousel-title">{slide.title}</h2> : null}
                  {slide.description ? <p className="carousel-description">{slide.description}</p> : null}
                  {slide.ctaText ? (
                    <a
                      href={slide.ctaHref || '#'}
                      className="carousel-cta"
                      aria-label={slide.ctaText}
                    >
                      {slide.ctaText}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              className="carousel-control carousel-control--prev"
              onClick={previousSlide}
              aria-label="Slide anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="carousel-control carousel-control--next"
              onClick={nextSlide}
              aria-label="Siguiente slide"
            >
              ›
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default HeroCarousel;