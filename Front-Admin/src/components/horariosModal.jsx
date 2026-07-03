import { useEffect, useMemo, useState } from 'react';
import './horariosModal.css';
import { formatearHora } from '../utils/horarios';
import { formatCLP } from '../utils/format';
import { api } from '../api';

function HorariosModal({ pelicula, onClose, onSelectHorario }) {
  const [funciones, setFunciones] = useState([]);
  const [salas, setSalas] = useState([]);
  const [loadingFunciones, setLoadingFunciones] = useState(true);
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);

  // Cargar funciones y salas al abrir el modal
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingFunciones(true);

        // Obtener funciones de la película
        const respFunciones = await api.get(`/cartelera/peliculas/${pelicula.id}/funciones`);
        console.log("RESPUESTA DE LA API FUNCIONES:", respFunciones);
        const funcionesData = respFunciones?.data || respFunciones?.data?.data || pelicula.funciones || [];
        setFunciones(funcionesData);

        // Obtener salas
        const respSalas = await api.get('/cartelera/salas');
        const salasData = respSalas?.data || respSalas?.data?.data || [];
        setSalas(salasData);

        // Seleccionar la primera sala disponible por defecto
        if (salasData.length > 0 && !salaSeleccionada) {
          setSalaSeleccionada(salasData[0].id);
        }
      } catch (err) {
        console.error('Error cargando funciones y salas:', err);
        // Fallback a datos locales
        setFunciones(pelicula.funciones || []);
        setSalas([]);
      } finally {
        setLoadingFunciones(false);
      }
    };

    cargarDatos();
  }, [pelicula.id]);

  // Si no hay datos locales ni de API, usar la agenda local
 const agenda = useMemo(() => {
    if (funciones.length > 0) {
      const dias = {};
      
      funciones.forEach((func) => {
        const fechaRaw = func.fecha || func.date; // ej: "2026-07-17" o "2026-09-18"
        if (!fechaRaw) return;

        const horaString = func.hora || func.time || "00:00:00";
        const partesHora = horaString.split(':');

        if (!dias[fechaRaw]) {
          // Extraemos el día exacto y su nombre sin problemas de zona horaria
          const [year, month, day] = fechaRaw.split('-');
          const fechaObj = new Date(year, month - 1, day);
          let nombreDia = new Intl.DateTimeFormat('es-CL', { weekday: 'long' }).format(fechaObj);
          nombreDia = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1); // Mayúscula

          dias[fechaRaw] = {
            dia: fechaRaw, // Usamos la fecha completa "YYYY-MM-DD" como identificador
            nombre: nombreDia,
            numeroDia: day,
            horarios: []
          };
        }

        dias[fechaRaw].horarios.push({
          hora: Number(partesHora[0]),
          minuto: Number(partesHora[1]),
          funcionId: func.id,
          salaId: func.salaId || func.roomId, // Aseguramos tomar el ID de sala
          salaInfo: func,
        });
      });

      // Retornar el array ordenado cronológicamente desde la más cercana
      return Object.values(dias).sort((a, b) => new Date(a.dia) - new Date(b.dia));
    }

    return [];
  }, [funciones]);

  // Manejo inteligente del día seleccionado
  const [diaSeleccionado, setDiaSeleccionado] = useState(() => {
    return agenda.length > 0 ? agenda[0].dia : null;
  });

  useEffect(() => {
    // Si la agenda se actualiza, seleccionamos automáticamente el primer día disponible
    if (agenda.length > 0 && !agenda.find(d => d.dia === diaSeleccionado)) {
      setDiaSeleccionado(agenda[0].dia);
    }
  }, [agenda, diaSeleccionado]);

  const diaActivo = agenda.find((dia) => dia.dia === diaSeleccionado) || agenda[0];
  const horarios = diaActivo?.horarios || [];

  // CORRECCIÓN CRÍTICA: Convertimos ambos a Number para evitar que un string "3" no coincida con un int 3
  const horariosFiltrados = salaSeleccionada
    ? horarios.filter((h) => !h.salaId || Number(h.salaId) === Number(salaSeleccionada))
    : horarios;

  const salaActual = salas.find((s) => Number(s.id) === Number(salaSeleccionada));
  const precioSala = salaActual?.precioBase || pelicula.price || 5990;

  if (agenda.length === 0 && !loadingFunciones) {
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
              <p className="modal-pelicula-precio">${precioSala.toLocaleString('es-CL')}</p>
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

          {/* Selector de salas */}
          {salas.length > 0 && (
            <div className="modal-salas">
              <h3>Selecciona una sala</h3>
              <div className="salas-grid">
                {salas.map((sala) => (
                  <button
                    key={sala.id}
                    type="button"
                    className={`sala-btn ${salaSeleccionada === sala.id ? 'sala-btn--active' : ''}`}
                    onClick={() => setSalaSeleccionada(sala.id)}
                  >
                    <span className="sala-btn__nombre">{sala.nombre}</span>
                    <span className="sala-btn__tipo">{sala.tipo}</span>
                    <span className="sala-btn__precio">${sala.precioBase.toLocaleString('es-CL')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="modal-horarios">
            <h3>Agenda de días</h3>
            <div className="agenda-grid">
              {agenda.map((dia) => {
                const isSelected = diaSeleccionado === dia.dia;
                const hasHorarios = dia.horarios.length > 0;

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
                    <span className="agenda-btn__numero">{dia.nombre.toUpperCase()} {dia.numeroDia}</span>
                    <span className="agenda-btn__nombre">{dia.nombre}</span>
                    {!hasHorarios ? <span className="agenda-btn__estado">Sin funciones</span> : null}
                  </button>
                );
              })}
            </div>

            <h3>Selecciona un horario para {diaActivo ? `${diaActivo.nombre} ${diaActivo.numeroDia}` : ''}</h3>
            <div className="horarios-grid">
              {horariosFiltrados.length > 0 ? horariosFiltrados.map((horario, index) => (
                <button
                  key={`${diaSeleccionado}-${index}`}
                  type="button"
                  className="horario-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelectHorario({
                      dia: diaSeleccionado,
                      nombreDia: diaActivo?.nombre || '',
                      fechaFuncion: diaSeleccionado, // Ej: "2026-07-17"
                      fechaFuncionTexto: diaActivo ? `${diaActivo.nombre} ${diaActivo.numeroDia}` : '', // Ej: "Viernes 17"
                      horario: horario,
                      salaId: horario.salaId,
                      precioSala: precioSala,
                      funcionId: horario.funcionId,
                    });
                  }}
                >
                  {/* 👇 Aquí usamos tu utilidad para mostrar "19:45" en vez de "19:45" */}
                  {formatearHora(horario.hora, horario.minuto)}
                </button>
              )) : (
                <p className="horarios-vacios">No hay funciones disponibles para este día en la sala seleccionada.</p>
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
