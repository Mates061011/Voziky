import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  surname: string;
  email: string;
  phone: number;
  _id: string;
}

interface Appointment {
  _id: string;
  startDate: string;
  endDate: string;
  user: User;
  confirmed: boolean;
  price: number;
  createdAt: string;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return null;
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/appointment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching appointments.");
    } finally {
      setLoading(false);
    }
  };

  const confirmAppointment = async (id: string) => {
    try {
      await axios.get(
        `${baseUrl}/api/appointment/confirm/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the confirmed status locally for immediate feedback
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === id ? { ...appointment, confirmed: true } : appointment
        )
      );
      alert("Appointment confirmed!");
    } catch (err: any) {
      alert(err.message || "Failed to confirm the appointment.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const formatDateInUTC = (date: string | Date): string => {
    const utcDate = new Date(date);
    const formatter = new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC", // Force UTC
    });
    return formatter.format(utcDate);
  };

  return (
    <div>
      <h1>Appointments</h1>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            style={{ border: "1px solid black", margin: "10px", padding: "10px", width: 'fit-content' }}
          >
            <p>
              <strong>ID:</strong> {appointment._id}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {formatDateInUTC(appointment.startDate)}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {formatDateInUTC(appointment.endDate)}
            </p>
            <p>
              <strong>User:</strong> {appointment.user.name} {appointment.user.surname}
            </p>
            <p>
              <strong>Email:</strong> {appointment.user.email}
            </p>
            <p>
              <strong>Phone:</strong> {appointment.user.phone}
            </p>
            <p>
              <strong>Price:</strong> {appointment.price} Kč
            </p>
            <p>
              <strong>Confirmed:</strong> {appointment.confirmed ? "Yes" : "No"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {formatDateInUTC(appointment.createdAt)}
            </p>
            {!appointment.confirmed && (
              <button
                onClick={() => confirmAppointment(appointment._id)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Confirm
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
