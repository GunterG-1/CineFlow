import "./footer.css";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.2-1.5 1.5-1.5h1.8V4.2c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6v2.1H7V13.8h2.6V22h3.9Z" fill="currentColor" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.75 1.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" fill="currentColor" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M19.9 7.2c.01.2.01.4.01.6C19.9 14 15.5 20 7.3 20c-1.6 0-3.1-.5-4.4-1.2 1.5.2 3-.2 4.2-1-1.3 0-2.4-.9-2.8-2.1.5.1 1 .1 1.5 0-1.4-.3-2.4-1.5-2.4-2.9v-.1c.4.2.9.4 1.4.4-1.2-.8-1.9-2.1-1.9-3.5 0-.8.2-1.5.6-2.1 1.5 1.8 3.8 3 6.3 3.2 0-.2-.1-.5-.1-.8 0-2 1.6-3.7 3.7-3.7 1 0 1.9.4 2.5 1 .8-.1 1.6-.4 2.3-.8-.3.8-.8 1.5-1.5 1.9.7-.1 1.4-.3 2-.6-.5.7-1 1.3-1.7 1.8Z" fill="currentColor" />
  </svg>
);

const Footer = () => {
  const sections = [
    {
      title: "Cine",
      links: ["Ubicaciones", "Restricciones"],
    },
    {
      title: "Otros Servicios",
      links: ["Venta de entradas corporativas", "Empresas"],
    },
    {
      title: "Contactos",
      links: ["Escribenos", "Trabaja con nosotros"],
    },
    {
      title: "Ayuda",
      links: ["Preguntas Frecuentes", "Reimprimir boleta electrónica", "Política de Cambios o Devoluciones"],
    },
    {
      title: "Legal",
      links: ["Términos y Condiciones", "Política de Privacidad", "Política y Uso de Cookies"],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer__container">


          <nav className="footer__navigation">
            {sections.map((section) => (
              <section key={section.title} className="footer__section">
                <h3 className="footer__section-title">{section.title}</h3>
                <ul className="footer__list">
                  {section.links.map((link) => (
                    <li key={link}>
                      <button type="button" className="footer__link footer__link--button">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>

        <div className="footer__divider"></div>

        <div className="footer__bottom">
          <div className="footer__social">
            <span className="footer__social-label">Síguenos</span>
            <a href="https://www.facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer"><FacebookIcon /></a>
            <a href="https://www.instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer"><InstagramIcon /></a>
            <a href="https://x.com" aria-label="Twitter" target="_blank" rel="noreferrer"><TwitterIcon /></a>
          </div>
          <p className="footer__copyright">
            © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>

    </footer>
  );
};

export default Footer;
