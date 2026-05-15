import { useEffect, useMemo, useState } from 'react';
import './horariosModal.css';
import { formatearFechaFuncion, formatearDiaAgenda, formatearHora, obtenerSemanaActual } from '../database/horarios';

function HorariosModal({ pelicula, onClose, onSelectHorario }) {
  const agenda = useMemo(() => {
    return pelicula.agenda?.length > 0
      ? pelicula.agenda
      : [{ dia: 1, nombre: 'Lunes', horarios: pelicula.horarios || [] }];
  }, [pelicula.agenda, pelicula.horarios]);
  const semanaActual = obtenerSemanaActual();

  const [diaSeleccionado, setDiaSeleccionado] = useState(() => {
    const diaInicial = agenda.find((dia) => dia.horarios?.length > 0);
    return diaInicial?.dia || agenda[0]?.dia || 1;
  });

  useEffect(() => {
    const diaInicial = agenda.find((dia) => dia.horarios?.length > 0);
    setDiaSeleccionado(diaInicial?.dia || agenda[0]?.dia || 1);
  }, [agenda]);

  const diaActivo = agenda.find((dia) => dia.dia === diaSeleccionado) || agenda[0];
  const diaCalendarioActivo = semanaActual.find((dia) => dia.dia === diaSeleccionado);
  const horarios = diaActivo?.horarios || [];

  if (agenda.length === 0) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
          <h2>Horarios No Disponibles</h2>
          <p>No hay horarios disponibles para esta película.</p>
          <button type="button" className="modal-btn-ok" onClick={onClose}>Entendido</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <div className="modal-banner">
            <img src={pelicula.bannerSrc || pelicula.imageSrc} alt={pelicula.title} />
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-pelicula-info">
            <div className="modal-pelicula-copy">
              <h2>{pelicula.title}</h2>
              <p className="modal-pelicula-genre">{pelicula.genre}</p>
              <p className="modal-pelicula-precio">${pelicula.price.toFixed(3)}</p>
            </div>
            <p className="modal-pelicula-description">{pelicula.description}</p>
            <div className="modal-pelicula-actors">
              <h3>Actores principales</h3>
              <div className="modal-actors-list">
                {pelicula.actors?.map((actor) => (
                  <span key={actor} className="modal-actor-chip">{actor}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-horarios">
            <h3>Agenda de días</h3>
            <div className="agenda-grid">
              {agenda.map((dia) => {
                const isSelected = diaSeleccionado === dia.dia;
                const hasHorarios = (dia.horarios || []).length > 0;
                const diaCalendario = semanaActual.find((item) => item.dia === dia.dia);

                return (
                  <button
                    key={dia.dia}
                    type="button"
                    className={`agenda-btn ${isSelected ? 'agenda-btn--active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDiaSeleccionado(dia.dia);
                    }}
                    disabled={!hasHorarios}
                  >
                    <span className="agenda-btn__numero">{diaCalendario ? formatearFechaFuncion(diaCalendario.fecha) : `Día ${dia.dia}`}</span>
                    <span className="agenda-btn__nombre">{dia.nombre || formatearDiaAgenda(dia.dia)}</span>
                    {!hasHorarios ? <span className="agenda-btn__estado">Sin funciones</span> : null}
                  </button>
                );
              })}
            </div>

            <h3>Selecciona un horario para {diaCalendarioActivo ? formatearFechaFuncion(diaCalendarioActivo.fecha) : (diaActivo?.nombre || formatearDiaAgenda(diaSeleccionado))}</h3>
            <div className="horarios-grid">
              {horarios.length > 0 ? horarios.map((horario, index) => (
                <button
                  key={`${diaSeleccionado}-${index}`}
                  type="button"
                  className="horario-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelectHorario({
                      dia: diaSeleccionado,
                      nombreDia: diaActivo?.nombre || formatearDiaAgenda(diaSeleccionado),
                      fechaFuncion: diaCalendarioActivo?.fecha || null,
                      fechaFuncionTexto: diaCalendarioActivo ? formatearFechaFuncion(diaCalendarioActivo.fecha) : '',
                      horario,
                    });
                  }}
                >
                  {formatearHora(horario.hora, horario.minuto)}
                </button>
              )) : (
                <p className="horarios-vacios">No hay funciones disponibles para este día.</p>
              )}
            </div>
          </div>
        </div>

        <button type="button" className="modal-btn-cancel" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

export default HorariosModal;
