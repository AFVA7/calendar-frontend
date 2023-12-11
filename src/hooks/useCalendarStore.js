import { useDispatch, useSelector } from 'react-redux'
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store';
import calendarAPI from '../api/calendarAPI';
import { convertEventsToDateEvents } from '../helpers';
import Swal from 'sweetalert2';

export const useCalendarStore = () => {

    const dispatch = useDispatch();
    const {
        events,
        activeEvent,
    } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async (calendarEvent) => {

        try {
            if (calendarEvent.id) {
                //Actualizando
                await calendarAPI.put(`/events/${calendarEvent.id}`, calendarEvent);
                dispatch(onUpdateEvent({ ...calendarEvent, user }));
                return;
            }
            //Creando
            const { data } = await calendarAPI.post('/events', calendarEvent)
            dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }))
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');

        }



    }

    const startDeleteEvent = async () => {
        try {
            await calendarAPI.delete(`/events/${activeEvent.id}`);
            dispatch(onDeleteEvent());
            return;
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data.msg, 'error');

        }
    }

    const startLoadingEvents = async () => {
        const { data } = await calendarAPI.get('/events')
        const events = convertEventsToDateEvents(data.eventos);
        dispatch(onLoadEvents(events));
    }
    return {
        //properties
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,
        //meths
        setActiveEvent,
        startSavingEvent,
        startDeleteEvent,
        startLoadingEvents

    }
}
