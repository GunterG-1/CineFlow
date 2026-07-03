export const DIAS_AGENDA = [
  { numero: 1, nombre: 'Lunes' },
  { numero: 2, nombre: 'Martes' },
  { numero: 3, nombre: 'Miércoles' },
  { numero: 4, nombre: 'Jueves' },
  { numero: 5, nombre: 'Viernes' },
  { numero: 6, nombre: 'Sábado' },
  { numero: 7, nombre: 'Domingo' },
];

export const crearAgendaSemanal = (disponibilidad = {}) => {
  return DIAS_AGENDA.map((dia) => ({
    dia: dia.numero,
    nombre: dia.nombre,
    horarios: disponibilidad[dia.numero] || [],
  }));
};

export const obtenerSemanaActual = (baseDate = new Date()) => {
  const referencia = new Date(baseDate);
  const dayIndex = referencia.getDay();
  const mondayOffset = (dayIndex + 6) % 7;
  const lunes = new Date(referencia);
  lunes.setDate(referencia.getDate() - mondayOffset);
  lunes.setHours(0, 0, 0, 0);

  return DIAS_AGENDA.map((dia, index) => {
    const fecha = new Date(lunes);
    fecha.setDate(lunes.getDate() + index);

    return {
      dia: dia.numero,
      nombre: dia.nombre,
      fecha,
      numeroDiaMes: fecha.getDate(),
    };
  });
};

export const formatearFechaFuncion = (fecha) => {
  if (!(fecha instanceof Date)) {
    return '';
  }

  const nombreDia = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
  const diaCapitalizado = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);
  return `${diaCapitalizado} ${fecha.getDate()}`;
};

export const formatearDiaAgenda = (diaNumero) => {
  return DIAS_AGENDA.find((dia) => dia.numero === diaNumero)?.nombre || `Día ${diaNumero}`;
};

export const formatearHora = (hora, minuto) => {
  const h = String(hora).padStart(2, '0');
  const m = String(minuto).padStart(2, '0');
  return `${h}:${m}`;
};
