export const events = [
    {
        id: '1',
        start: new Date('2022-10-21 13:00:00'),
        end: new Date('2022-10-21 15:00:00'),
        title: 'Cumpleaños del Andres',
        notes: 'Nota1',
    },
    {
        id: '2',
        start: new Date('2022-11-09 13:00:00'),
        end: new Date('2022-11-09 15:00:00'),
        title: 'Cumpleaños del Zay',
        notes: 'Nota2',
    },
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
}
export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [...events],//romper las referencias
    activeEvent: null,
}
export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [...events],//romper las referencias
    activeEvent: { ...events[0] }, //romper las referencias
}