import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useItemContext } from "../../context/ItemContext";
import { List, Button, Typography, Space, Tag, Spin, Alert, Card } from "antd";
const { Paragraph } = Typography;

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
  vs: number;
  items: string[];
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return null;
  }

  const { items } = useItemContext();
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
      await axios.get(`${baseUrl}/api/appointment/confirm/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === id ? { ...appointment, confirmed: true } : appointment
        )
      );
    } catch (err: any) {
      alert(err.message || "Failed to confirm the appointment.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDateInUTC = (date: string | Date): string => {
    const utcDate = new Date(date);
    const formatter = new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
    return formatter.format(utcDate);
  };

  const getItemNames = (itemIds: string[]): string[] => {
    return itemIds.map((itemId) => {
      const item = items.find((item) => item._id === itemId);
      return item ? item.name : "Unknown Item";
    });
  };

  if (loading) return <Spin tip="Loading appointments..." />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Potvrzuj objednávky</h2>
      <List
        grid={{
          gutter: 24,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 4,
        }}
        dataSource={appointments}
        renderItem={(appointment) => {
          const itemNames = getItemNames(appointment.items);
          return (
            <List.Item
              style={{
                display: "flex",
                justifyContent: "center",
                minWidth: "380px", // Set minimum width for each List.Item
              }}
            >
              <Card
                style={{
                  width: "100%",
                  maxWidth: "500px", // Allow flexibility but ensure consistent size
                  margin: "0 auto",
                }}
                title={
                  <Space>
                    <Tag color={appointment.confirmed ? "green" : "red"}>
                      {appointment.confirmed ? "Potvrzeno" : "Nepotvrzeno"}
                    </Tag>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span>{`Začátek: ${formatDateInUTC(appointment.startDate)}`}</span>
                      <span>{`Konec: ${formatDateInUTC(appointment.endDate)}`}</span>
                    </div>
                  </Space>
                }
                actions={[
                  !appointment.confirmed && (
                    <Button
                      type="primary"
                      onClick={() => confirmAppointment(appointment._id)}
                    >
                      Potvrdit
                    </Button>
                  ),
                ]}
              >
                <Paragraph>
                  <strong>Uživatel:</strong> {appointment.user.name}{" "}
                  {appointment.user.surname}
                </Paragraph>
                <Paragraph>
                  <strong>Email:</strong> {appointment.user.email}
                </Paragraph>
                <Paragraph>
                  <strong>Telefon:</strong> {appointment.user.phone}
                </Paragraph>
                <Paragraph>
                  <strong>Cena:</strong> {appointment.price} Kč
                </Paragraph>
                <Paragraph>
                  <strong>Produkty:</strong> {itemNames.join(", ")}
                </Paragraph>
                <Paragraph>
                  <strong>Vytvořeno:</strong> {formatDateInUTC(appointment.createdAt)}
                </Paragraph>
              </Card>
            </List.Item>
          );
        }}
      />


    </div>
  );
};

export default AdminPanel;
