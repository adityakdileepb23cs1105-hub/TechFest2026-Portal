import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function loadEvents() {
    axios.get(API + "/events")
      .then((res) => setEvents(res.data))
      .catch(() => setError("Could not load events"));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  function authConfig() {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: "Bearer " + token } };
  }

  async function registerForEvent(eventId) {
    try {
      const res = await axios.post(
        API + "/registrations", { eventId: eventId }, authConfig()
      );
      setMessage(res.data.message);
      loadEvents(); // refresh: seats go down
    } catch (err) {
      if (err.response) setMessage(err.response.data.message);
      else setMessage("Server not reachable");
    }
  }

  async function deleteEvent(id) {
    try {
      await axios.delete(API + "/events/" + id, authConfig());
      loadEvents();
    } catch (err) {
      setMessage(err.response ? err.response.data.message : "Server not reachable");
    }
  }

  const role = localStorage.getItem("role");

  return (
    <div>
      <h2>Events</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
      <div className="cards">
        {events.map((ev) => (
          <div className="card" key={ev._id}>
            <h3>{ev.name}</h3>
            <p>Category: {ev.category}</p>
            <p>Fee: Rs. {ev.fee}</p>
            <p>Seats left: {ev.seats}</p>
            <button
              disabled={ev.seats < 1}
              onClick={() => registerForEvent(ev._id)}
            >
              {ev.seats < 1 ? "SOLD OUT" : "Register"}
            </button>
            {role === "admin" && (
              <button onClick={() => deleteEvent(ev._id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
