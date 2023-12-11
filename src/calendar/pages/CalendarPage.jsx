import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { localizer, getMessagesEs } from '../../helpers'
import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, Navbar } from '../'
import { useEffect, useState } from 'react'
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks'


export const CalendarPage = () => {

  const { user } = useAuthStore();

  const { openDateModal } = useUiStore();
  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
  const [lastView, setlastView] = useState(localStorage.getItem('lastView') || 'week');

  const eventStyleGetter = (event, start, end, isSelected) => {

    const isMyEvent = user.uid === event.user._id || user.uid === event.user.uid;
    const style = {
      backgroundColor: isMyEvent? '#347CF7' : '#465660',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
    }
    return { style }
  }

  const onDoubleClick = (e) => {
    openDateModal();
  }
  const onSelect = (e) => {
    setActiveEvent(e);
  }
  const onViewChange = (e) => {
    localStorage.setItem('lastView', e);
  }

  useEffect(() => {
    startLoadingEvents();
  }, []);


  return (
    <>
      <Navbar />

      <Calendar
        culture="es"
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 80px)' }}
        messages={getMessagesEs()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent,
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChange}
      />

      <CalendarModal />

      <FabAddNew />
      <FabDelete />
    </>
  )
}
