import React, { useEffect, useRef } from "react";
import { Container, Row, Col, Button, Badge, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function Calendar(props) {
const styles = {
  calendarContainer: { margin: "20px auto", maxWidth: "85%", maxHeight: "85vh", position: "relative", border: "3px solid #1d1d1dd1", overflowY: "scroll", overflowX: "hidden",backgroundColor: "#f9f9f9", borderRadius: "10px", color: "#a6a6a6" },
  calendarHeader: { position: "sticky", top: 0, zIndex: 20, backgroundColor: "#fff", borderBottom: "1px solid #ccc", padding: "15px", display: "flex", alignItems: "center", justifyContent: "center" },
  btnSecondary: { backgroundColor: "#007bff", borderColor: "#007bff" },
  calendarDay: { borderRight: "1px solid #ddd", padding: "5px", flex: 1, display: "flex", flexDirection: "column" },
  calendarDayWrapper: { padding: "1px", flex: 1, display: "flex", flexDirection: "column" },
  calendarEvent: { minHeight: "100px", maxHeight: "120px" },
  hourText: { fontSize: "12px", fontWeight: "lighter", textAlign: "left" },
  eventBadge: { display: "flex", backgroundColor: "#007bff", color: "white", textAlign: "left", whiteSpace: "normal", overflowWrap: "break-word", fontSize: "14px", alignItems: "top", borderRadius: "8px" },
  eventContent: { padding: "5%", paddingLeft: "7%" },
  currentTimeLine: { position: "absolute", top: 0, left: 0, width: "100%", height: "2px", zIndex: 50, pointerEvents: "none", backgroundColor: "#ff4757" },
  currentTime: { position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#ff4757", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", color: "white" },
};
 const {
    currentDate, //new Date(),
    currentTime, //new Date(),
    showModal, //Bool,
    selectedEvent, //event,
    events, // {id: 4, title: "Lesson", start: new Date("2024-08-22T08:30:00"), end: new Date("2024-08-22T13:20:00"), description: "Attend the React development lesson." }
    handlePrevDay, //function takes a number of days as argument default is 7 change to modify navigation,
    handleNextDay, //function takes a number of days as argument default is 7 change to modify navigation,
    handleEventClick, //function,
    handleDayClick, //function,
    handleCloseModal, //function,
  } = props;




  const startOfWeek = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1);
    return start;
  };

  const renderEvents = (day) => {
    const dayStart = new Date(day.setHours(0, 0, 0, 0));
    return events?.filter(event => event.start >= dayStart && event.start <= new Date(day.setHours(23, 59, 59, 999)));
  };

  const renderDayView = (date, index) => {
    const hours = Array.from({ length: 24 }, (_, i) => new Date(date.setHours(i, 0, 0, 0)));
    const dayEvents = renderEvents(date);
    const isCurrentDay = index === currentDate.getDay() - 1 && currentDate.getDate() === new Date().getDate();
    return (
      <div key={index} style={styles.calendarDay}>
        {hours.map((hour, idx) => renderDayEvents({ hourEvents: dayEvents?.filter(event => event.start >= hour && event.start < new Date(hour.getTime() + 60 * 60 * 1000)), idx, currentHour: hour.getHours(), currentTime, isCurrentDay }))}
      </div>
    );
  };

  const renderDayEvents = ({ hourEvents, idx, currentHour, currentTime, isCurrentDay }) => (
    <Row key={idx} style={styles.calendarEvent}>
      <Col style={styles.eventContent}>
        {hourEvents?.map((event, eventId) => (
          <Badge key={eventId} bg="" onClick={() => handleEventClick(event)} style={{ ...styles.eventBadge, height: `${Math.max((event.end - event.start) / (1000 * 60 * 60) * 100, 55)}%` }}>
            <Col style={styles.eventContent}>
              <Row style={styles.hourText}>{`${event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}</Row>
              <Row>{event.title}</Row>
            </Col>
          </Badge>
        ))}
      </Col>
    </Row>
  );

  const renderWeekView = (date) => {
    const start = startOfWeek(date);
    return (
      <Col xs={12} style={{ padding: "0" }}>
        <Row style={{ display: "flex" }}>
          {Array.from({ length: 7 }, (_, i) => new Date(start.getTime() + i * 24 * 60 * 60 * 1000)).map((day, index) => (
            <Col key={index} md={4} style={styles.calendarDayWrapper} onClick={() => handleDayClick(day)}>
              {renderDayView(day, index)}
            </Col>
          ))}
        </Row>
      </Col>
    );
  };

  const renderWeekDaysText = (date) => {
    const start = startOfWeek(date);
    const days = Array.from({ length: 7 }, (_, i) => new Date(start.getTime() + i * 24 * 60 * 60 * 1000));
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
      <Row style={{ display: "flex", flexDirection: "row", textAlign: "center", padding: "10px 0" }}>
        {days.map((day, index) => (
          <Col key={index}>
            <Button variant="" onClick={() => handleDayClick(day)} style={{ backgroundColor: "transparent", border: "none" }}>
              <h5 style={{ margin: "0", fontSize: "1.25rem" }}>{dayNames[index]} {day.getDate()}</h5>
            </Button>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Container fluid style={styles.calendarContainer}>
      <Row style={styles.calendarHeader}>
        <Col style={{textAlign:"center"}}><Button onClick={()=>handlePrevDay({days: 7})} style={styles.btnSecondary}>Previous</Button></Col>
        <Col style={{ textAlign: "center" }}><h4>{`${startOfWeek(currentDate).toDateString()} - ${new Date(startOfWeek(currentDate).getTime() + 6 * 24 * 60 * 60 * 1000).toDateString()}`}</h4></Col>
        <Col style={{textAlign:"center"}}><Button onClick={()=>handleNextDay({days: 7})} style={styles.btnSecondary}>Next</Button></Col>
        <Row style={{justifyContent:"center"}}>{renderWeekDaysText(currentDate)}</Row>
      </Row>

      <Row>{renderWeekView(currentDate)}</Row>

      {selectedEvent && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton><Modal.Title>{selectedEvent.title}</Modal.Title></Modal.Header>
          <Modal.Body>
            <p><strong>Start:</strong> {selectedEvent.start.toLocaleString()}</p>
            <p><strong>End:</strong> {selectedEvent.end.toLocaleString()}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
}
//export default Calendar;
