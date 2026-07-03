import { crearAgendaSemanal } from './horarios';

export const movies = [
  {
    id: 1,
    title: "Michael",
    genre: "Ciencia Ficción",
    price: 5.990,
    imageSrc: "/Michael.jpg",
    bannerSrc: "/MichaelCarrusel.webp",
    agenda: crearAgendaSemanal({
      1: [
        { hora: 16, minuto: 30 },
        { hora: 21, minuto: 0 },
      ],
      2: [
        { hora: 16, minuto: 30 },
        { hora: 21, minuto: 0 },
      ],
      3: [
        { hora: 18, minuto: 0 },
        { hora: 22, minuto: 15 },
      ],
      4: [
        { hora: 16, minuto: 30 },
        { hora: 21, minuto: 0 },
      ],
      5: [
        { hora: 15, minuto: 45 },
        { hora: 20, minuto: 30 },
      ],
      6: [
        { hora: 14, minuto: 30 },
        { hora: 18, minuto: 45 },
        { hora: 22, minuto: 0 },
      ],
      7: [
        { hora: 14, minuto: 30 },
        { hora: 17, minuto: 30 },
      ],
    }),
    horarios: [
      { hora: 16, minuto: 30 },
      { hora: 21, minuto: 0 },
    ],
    description:
      "Una aventura de ciencia ficción cargada de tensión, misterio y visuales impactantes.",
    actors: ["Michael B. Jordan", "Zendaya", "John David Washington"],
  },
  {
    id: 2,
    title: "El diablo viste a la moda",
    genre: "Drama",
    price: 5.990,
    imageSrc: "/ElDiabloVisteALaModa.jpg",
    bannerSrc: "/ElDiabloCarrusel-2.webp",
    agenda: crearAgendaSemanal({
      1: [
        { hora: 15, minuto: 0 },
        { hora: 20, minuto: 15 },
      ],
      2: [
        { hora: 15, minuto: 0 },
        { hora: 20, minuto: 15 },
      ],
      3: [
        { hora: 14, minuto: 30 },
        { hora: 19, minuto: 15 },
      ],
      4: [
        { hora: 15, minuto: 0 },
        { hora: 20, minuto: 15 },
      ],
      5: [
        { hora: 16, minuto: 0 },
        { hora: 21, minuto: 30 },
      ],
      6: [
        { hora: 13, minuto: 45 },
        { hora: 18, minuto: 30 },
        { hora: 22, minuto: 15 },
      ],
      7: [
        { hora: 14, minuto: 0 },
        { hora: 19, minuto: 0 },
      ],
    }),
    horarios: [
      { hora: 15, minuto: 0 },
      { hora: 20, minuto: 15 },
    ],
    description:
      "Un drama elegante y agudo sobre la ambición, la moda y las decisiones que cambian una carrera.",
    actors: ["Meryl Streep", "Anne Hathaway", "Emily Blunt"],
  },
  {
    id: 3,
    title: "Ovejas Detectives",
    genre: "Drama",
    price: 5.990,
    imageSrc: "/OvejasDetectives.jpg",
    bannerSrc: "/DetectiveOvejasCarrusel.webp",
    agenda: crearAgendaSemanal({
      1: [
        { hora: 14, minuto: 45 },
        { hora: 19, minuto: 30 },
      ],
      2: [
        { hora: 14, minuto: 45 },
        { hora: 19, minuto: 30 },
      ],
      3: [
        { hora: 16, minuto: 15 },
        { hora: 21, minuto: 0 },
      ],
      4: [
        { hora: 14, minuto: 45 },
        { hora: 19, minuto: 30 },
      ],
      5: [
        { hora: 15, minuto: 30 },
        { hora: 20, minuto: 45 },
      ],
      6: [
        { hora: 12, minuto: 45 },
        { hora: 17, minuto: 15 },
        { hora: 21, minuto: 45 },
      ],
      7: [
        { hora: 13, minuto: 30 },
        { hora: 18, minuto: 0 },
      ],
    }),
    horarios: [
      { hora: 14, minuto: 45 },
      { hora: 19, minuto: 30 },
    ],
    description:
      "Una historia divertida y distinta donde un grupo de ovejas resuelve un misterio inesperado.",
    actors: ["Emma Stone", "Ryan Reynolds", "Pedro Pascal"],
  }
];

export const featuredSlides = [
  {
    id: 1,
    movieId: 3,
    imageSrc: "/DetectiveOvejaCarrusel.webp",
    background: "linear-gradient(115deg, #0f5bd7 0%, #38bdf8 20%)",
  },
  {
    id: 2,
    movieId: 1,
    imageSrc: "/MichaelCarrusel.webp",
    background: "linear-gradient(115deg, #0f5bd7 0%, #38bdf8 20%)",
  },
  {
    id: 3,
    movieId: 2,
    imageSrc: "/ElDiabloCarrusel-2.webp",
    background: "linear-gradient(115deg, #0f5bd7 0%, #38bdf8 20%)",
  }
];

