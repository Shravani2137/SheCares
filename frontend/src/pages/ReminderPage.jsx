import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

function ReminderPage() {
  const { currentUser } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: "",
    time: "",
    type: "medication",
    notes: ""
  });

  useEffect(() => {
    if (!currentUser) return;
    fetchReminders();
  }, [currentUser]);

  const fetchReminders = async () => {
    const q = query(
      collection(db, "reminders"),
      where("userId", "==", currentUser.uid)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setReminders(data);
  };

  const addReminder = async () => {
    if (!newReminder.title || !newReminder.time) return;

    await addDoc(collection(db, "reminders"), {
      ...newReminder,
      userId: currentUser.uid,
      createdAt: new Date(),
      active: true
    });

    setNewReminder({ title: "", time: "", type: "medication", notes: "" });
    fetchReminders();
  };

  const deleteReminder = async (id) => {
    await deleteDoc(doc(db, "reminders", id));
    fetchReminders();
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", color: "#ff4d8d", marginBottom: "30px" }}>
        📅 Health Reminders
      </h1>

      {/* Add New Reminder */}
      <div style={{
        background: "#f8f9fa",
        padding: "25px",
        borderRadius: "12px",
        marginBottom: "30px",
        border: "1px solid #e9ecef"
      }}>
        <h3>Add New Reminder</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
          <input
            placeholder="Reminder Title"
            value={newReminder.title}
            onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
            style={inputStyle}
          />

          <input
            type="time"
            value={newReminder.time}
            onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
            style={inputStyle}
          />

          <select
            value={newReminder.type}
            onChange={(e) => setNewReminder({...newReminder, type: e.target.value})}
            style={inputStyle}
          >
            <option value="medication">💊 Medication</option>
            <option value="exercise">🏃‍♀️ Exercise</option>
            <option value="meal">🍽️ Meal</option>
            <option value="appointment">📅 Appointment</option>
            <option value="water">💧 Water</option>
            <option value="other">📝 Other</option>
          </select>

          <input
            placeholder="Notes (optional)"
            value={newReminder.notes}
            onChange={(e) => setNewReminder({...newReminder, notes: e.target.value})}
            style={inputStyle}
          />
        </div>

        <button
          onClick={addReminder}
          style={{
            padding: "12px 25px",
            background: "#ff4d8d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "15px"
          }}
        >
          Add Reminder
        </button>
      </div>

      {/* Existing Reminders */}
      <div>
        <h3>Your Reminders</h3>

        {reminders.length === 0 ? (
          <p style={{ textAlign: "center", padding: "30px", color: "#666" }}>
            No reminders set yet. Add your first reminder above!
          </p>
        ) : (
          <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
            {reminders.map((reminder) => (
              <div key={reminder.id} style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                border: "1px solid #f0f0f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <h4 style={{ margin: "0 0 5px 0", color: "#ff4d8d" }}>
                    {reminder.title}
                  </h4>
                  <p style={{ margin: "0", color: "#666" }}>
                    ⏰ {reminder.time} • {reminder.type}
                    {reminder.notes && ` • ${reminder.notes}`}
                  </p>
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  style={{
                    background: "#ff6b6b",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div style={{
        background: "#e8f4fd",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "30px",
        border: "1px solid #b3d9ff"
      }}>
        <h4>💡 Reminder Tips</h4>
        <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
          <li>Set medication reminders for consistent PCOS treatment</li>
          <li>Add exercise reminders to maintain healthy routine</li>
          <li>Use meal reminders for balanced eating schedule</li>
          <li>Set water intake reminders for proper hydration</li>
          <li>Schedule regular health check-up appointments</li>
        </ul>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "14px"
};

export default ReminderPage;