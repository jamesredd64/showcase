import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventContentArg } from "@fullcalendar/core";
import { useAuth0 } from "@auth0/auth0-react";
import { useMongoDbClient } from "../services/mongoDbClient";
import Loader from "../components/common/custom.loader";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "../styles/calendar.css";
import { useRef } from "react";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";
import type { CalendarEvent } from "../types/calendar.types";
import { useScheduledEvents } from '../context/ScheduledEventsContext';
import { useLocation } from 'react-router-dom';
import type  FullCalendarApi  from '@fullcalendar/react';

const CalendarPage: () => JSX.Element = () => {
  const { user } = useAuth0();
  const { getAllScheduledEvents } = useMongoDbClient();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { setScheduledEvents } = useScheduledEvents();
  const location = useLocation();
  const selectedEventId = location.state?.selectedEventId;
  const scrollToEvent = location.state?.scrollToEvent;
  const navigate = useNavigate();
  const calendarRef = useRef<FullCalendar | null>(null);
  
  useEffect(() => {
    const state = location.state as {
      selectedEventId?: string;
      scrollToEvent?: boolean;
    };
    console.log("state  ", state);
    console.log("state?.selectedEventId  ", state?.selectedEventId);
    console.log("state?.scrollToEvent  ", state?.scrollToEvent);
    console.log("calendarRef.current  ", calendarRef.current);
    
    if (state?.selectedEventId && state?.scrollToEvent && calendarRef.current) {
      console.log("state?.selectedEventId && state?.scrollToEvent  ", state?.selectedEventId && state?.scrollToEvent);
      // && calendarRef.current
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const calendar = calendarRef.current?.getApi();
        console.log("calendar  ", calendar);

        if (!calendar) return;

        if (!state.selectedEventId) return;
        const event = calendar.getEventById(state.selectedEventId);
        if (!event) return;

        // Go to the date of the event
        calendar.gotoDate(event.start || new Date());

        // Use setTimeout to ensure the calendar has updated
        setTimeout(() => {
          // First ensure selectedEventId exists
          if (!state.selectedEventId) return;

          // Get the event and cast it to include the el property
          const event = calendar.getEventById(state.selectedEventId);
          if (!event) return;

          // Access the DOM element using getEl() method
          const eventEl = document.getElementById(
            `event-${state.selectedEventId}`
          );
          if (eventEl) {
            eventEl.scrollIntoView({ behavior: "smooth", block: "center" });

            // Highlight the event
            event.setProp("backgroundColor", "#ffeb3b");

            // Reset the highlight after a delay
            setTimeout(() => {
              event.setProp("backgroundColor", "");
            }, 2000);
          }
        }, 100);
      });
    }
  }, [location.state]);
  
  const mapToCalendarEvent = (scheduledEvent: any) => {
    return {
      id: scheduledEvent._id,
      title: scheduledEvent.eventDetails.summary || "Untitled Event",
      start: scheduledEvent.eventDetails.startTime,
      end: scheduledEvent.eventDetails.endTime,
      allDay: !scheduledEvent.eventDetails.endTime,
      extendedProps: {
        ...scheduledEvent,
        status: scheduledEvent.status,
        eventDetails: scheduledEvent.eventDetails,
        selectedUsers: scheduledEvent.selectedUsers || [],
      },
    };
  };

  useEffect(() => {
    const loadEvents = async () => {
      if (events.length > 0 && isInitialized) {
        return;
      }

      if (!user?.sub) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const fetchedScheduledEvents = await getAllScheduledEvents();
        const calendarEvents = fetchedScheduledEvents.map(mapToCalendarEvent);
        console.log("fetchedScheduledEvents ", fetchedScheduledEvents);
        console.log("Fetched calendarEvents ", calendarEvents);
        // setEvents(fetchedScheduledEvents);
        setEvents(calendarEvents);
        // Add new context and set events for search query
        setScheduledEvents(fetchedScheduledEvents);
        console.log("setScheduledEvents ", fetchedScheduledEvents);
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [user?.sub, events.length, isInitialized, getAllScheduledEvents]);

  

  const renderEventContent = (eventInfo: EventContentArg): JSX.Element => {
    const currentView = "dayGridMonth";
    const tooltipPlacement = currentView === "dayGridMonth" ? "top" : "right";

    const statusColorMap: Record<string, string> = {
      pending: "border-orange-500",
      processing: "border-blue-500",
      completed: "border-green-500",
      failed: "border-red-500",
    };

    const status = eventInfo.event.extendedProps.status;
    const borderColorClass =
      statusColorMap[status as keyof typeof statusColorMap] || "border-gray-500";
    const eventDetails = eventInfo.event.extendedProps.eventDetails;
    const selectedUsers = eventInfo.event.extendedProps.selectedUsers || [];
   

    const tooltipContent = (
      <div className="p-3 max-w-xs">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${borderColorClass}`}></span>
              <h6 className="font-medium text-gray-800 dark:text-gray-200">
                {eventDetails.summary || "No title"}
              </h6>
            </div>
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${borderColorClass} text-white`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>

          <div className="mt-1 space-y-1 text-sm">
            {eventDetails.startTime && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">When:</span>{" "}
                {new Date(eventDetails.startTime).toLocaleString()}
                {eventDetails.endTime &&
                  ` - ${new Date(eventDetails.endTime).toLocaleTimeString()}`}
              </p>
            )}

            {eventDetails.location && (
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-medium">Where:</span> {eventDetails.location}
              </p>
            )}
          </div>

          {eventDetails.description && (
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              {eventDetails.description}
            </p>
          )}

          {eventDetails.organizer && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Organizer
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {eventDetails.organizer.name || eventDetails.organizer.email}
              </p>
            </div>
          )}

          {selectedUsers.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {selectedUsers.length}{" "}
                {selectedUsers.length === 1 ? "Attendee" : "Attendees"}
              </p>
              <div className="mt-1 space-y-1">
                {selectedUsers.slice(0, 3).map((user: any, index: number) => (
                  <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
                    {user.name || user.email}
                  </p>
                ))}
                {selectedUsers.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +{selectedUsers.length - 3} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );

    return (
      <Tippy
        content={tooltipContent}
        animation="shift-away"
        placement={tooltipPlacement}
        className="!bg-white !text-gray-800 !border !border-gray-200 !shadow-lg !rounded-lg dark:!bg-gray-800 dark:!text-gray-200 dark:!border-gray-700"
        arrow={false}
        delay={[100, 0]}
        interactive={true}
        appendTo={() => document.body}
        zIndex={9999}
      >
        <div
          className={`fc-event-main flex items-center p-1 rounded border-2 ${borderColorClass} bg-gray-50 dark:bg-gray-200`}
          id={`event-${eventInfo.event.id}`}
        >
          <div className="fc-daygrid-event-dot"></div>
          <div className="fc-event-time">{eventInfo.timeText}</div>
          <div className="fc-event-title">{eventInfo.event.title}</div>
        </div>
      </Tippy>
    );
  };

  if (isLoading) {
    return <Loader />;
    // return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center p-4 text-red-800 bg-red-100 rounded-lg">
          <span className="font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  // Ensure a valid JSX element is always returned
  if (!events.length && !isLoading && !error) {
      return <div>No events to display.</div>;
  }

  
  return (
    <>
      <PageMeta title="Calendar Display" description="Display-only Calendar Page" />
      <PageBreadcrumb pageTitle="Calendar Display" />
      <div className="p-2 md:p-6 2xl:p-3">
      
        <div className="mx-auto max-w-full">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            events={events}
            selectable={false}
            editable={false}
            eventStartEditable={false}
            eventDurationEditable={false}
            droppable={false}
            eventContent={renderEventContent}
            height="auto"
            dayMaxEvents={true}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonIcons={{
              prev: "chevron-left",
              next: "chevron-right",
            }}
            buttonText={{
              today: "Today",
            }}
            timeZone="UTC"
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            nextDayThreshold="23:59:59"
            displayEventEnd={true}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
