import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DynamicComponent from '../DynamicComponent';
import { ErrorBoundary } from "react-error-boundary";
import NavbarComponent from './NavbarComponent';
import LoadingComponent from './LoadingComponent';


const EXPERIMENT = true

const CalendarAI = ({user, setUser, appType, onAppTypeChange, isSwitchingApp}) => {
  const [timeLeft, setTimeLeft] = useState(localStorage.getItem(`timeLeft_${user.user_id}`))
  const [generating, setGenerating] = useState(false)

  const events = [
    {id: 0, title: 'Meeting with Bob', start: new Date('2025-10-07T10:00:00'), end: new Date('2025-10-07T11:00:00'), description: 'Discuss project progress and next steps.' },
    {id: 1, title: 'Lunch with Alice', start: new Date('2025-10-07T12:00:00'), end: new Date('2025-10-07T13:00:00'), description: 'Casual lunch at the new cafe.' },
    {id: 2, title: 'Doctor Appointment', start: new Date('2025-10-08T11:00:00'), end: new Date('2025-10-08T12:00:00'), description: 'Annual check-up with Dr. Smith.' },
    {id: 3, title: 'Project Deadline', start: new Date('2025-10-09T00:00:00'), end: new Date('2025-10-09T23:59:59'), description: 'Complete the project milestones.' },
    {id: 4, title: 'React Lesson', start: new Date('2025-10-10T08:30:00'), end: new Date('2025-10-10T13:20:00'), description: 'Attend the React development lesson.' },
    {id: 5, title: 'Team Standup', start: new Date('2025-10-06T09:00:00'), end: new Date('2025-10-06T09:30:00'), description: 'Daily team standup meeting.' },
  ];
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(events[0]);

  const startOfWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(start.setDate(diff));
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };
  const handleDayClick = (day) => {
    setCurrentDate(day);
  };
  const handlePrevDay = ({days = 7}) => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - days)));
  };
  const handleNextDay = ({days= 7}) => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + days)));
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000*60);
    return () => clearInterval(interval);
  }, []);

  const props = {
    currentDate,
    currentTime,
    showModal,
    selectedEvent,
    events,
    handlePrevDay,
    handleNextDay,
    handleEventClick,
    handleDayClick,
    handleCloseModal,
  };


  return (
    <>

    <ErrorBoundary fallback={<>
      <NavbarComponent user={user} generating={generating} setGenerating={setGenerating} setUser={setUser} experiment={EXPERIMENT} appType={appType} onAppTypeChange={onAppTypeChange} isSwitchingApp={isSwitchingApp}></NavbarComponent>
      <div>Oh, Something went wrong!</div>
      </>}>
     <NavbarComponent user={user} generating={generating} setGenerating={setGenerating} setUser={setUser} experiment={EXPERIMENT} appType={appType} onAppTypeChange={onAppTypeChange} isSwitchingApp={isSwitchingApp}></NavbarComponent>{
     !generating  ? <DynamicComponent user={user} props={props} appType={appType} isSwitchingApp={isSwitchingApp}></DynamicComponent> :  <LoadingComponent></LoadingComponent>}
    </ErrorBoundary>
    </>
  );
};
export default CalendarAI;
