import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ title: "", amount: "", date: "", category: "" });
  const [filterDate, setFilterDate] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const { data } = await axios.get("http://localhost:5000/expenses");
    setExpenses(data);
  };

  const addExpense = async () => {
    if (editingExpense) {
      await axios.put(`http://localhost:5000/expenses/${editingExpense._id}`, newExpense);
      setEditingExpense(null);
    } else {
      await axios.post("http://localhost:5000/expenses", newExpense);
    }
    fetchExpenses();
    setNewExpense({ title: "", amount: "", date: "", category: "" });
  };

  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/expenses/${id}`);
    fetchExpenses();
  };

  const startEditing = (expense) => {
    setEditingExpense(expense);
    setNewExpense(expense);
  };

  const cancelEditing = () => {
    setEditingExpense(null);
    setNewExpense({ title: "", amount: "", date: "", category: "" });
  };

  const filteredExpenses = filterDate
    ? expenses.filter((exp) => exp.date === filterDate)
    : expenses;

  const pieData = {
    labels: [...new Set(filteredExpenses.map((exp) => exp.category))],
    datasets: [
      {
        data: [...new Set(filteredExpenses.map((exp) => exp.category))].map((cat) =>
          filteredExpenses
            .filter((exp) => exp.category === cat)
            .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
        ),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8e44ad", "#2ecc71"],
        hoverBackgroundColor: ["#FF7594", "#48B2FB", "#FFDE76", "#9e54bd", "#3fd781"],
      },
    ],
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Expense Tracker</h1>
      <div style={styles.section}>
        <h2 style={styles.subHeader}>Add or Edit Expense</h2>
        <div style={styles.form}>
          <input
            type="text"
            placeholder="Title"
            value={newExpense.title}
            onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            style={styles.input}
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Category"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            style={styles.input}
          />
          <button onClick={addExpense} style={styles.button}>
            {editingExpense ? "Update Expense" : "Add Expense"}
          </button>
          {editingExpense && (
            <button onClick={cancelEditing} style={styles.cancelButton}>
              Cancel
            </button>
          )}
        </div>
      </div>
      <div style={styles.section}>
        <h2 style={styles.subHeader}>Filter Expenses</h2>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={styles.input}
        />
      </div>
      <div style={styles.section}>
        <h2 style={styles.subHeader}>Expense List</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableThTd}>Title</th>
              <th style={styles.tableThTd}>Amount</th>
              <th style={styles.tableThTd}>Date</th>
              <th style={styles.tableThTd}>Category</th>
              <th style={styles.tableThTd}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((exp) => (
              <tr key={exp._id}>
                <td style={styles.tableThTd}>{exp.title}</td>
                <td style={styles.tableThTd}>{exp.amount}</td>
                <td style={styles.tableThTd}>{exp.date}</td>
                <td style={styles.tableThTd}>{exp.category}</td>
                <td style={styles.tableThTd}>
                  <button onClick={() => startEditing(exp)} style={styles.editButton}>
                    Edit
                  </button>
                  <button onClick={() => deleteExpense(exp._id)} style={styles.deleteButton}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={styles.section}>
        <h2 style={styles.subHeader}>Expense Summary</h2>
        <div style={styles.chartContainer}>
          <Pie data={pieData} options={{ plugins: { legend: { labels: { color: "#fff" } } } }} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#121212",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
  },
  header: { textAlign: "center", marginBottom: "20px", fontSize: "2rem" },
  subHeader: { marginBottom: "10px", fontSize: "1.5rem" },
  section: { marginBottom: "30px", padding: "20px", background: "#1e1e1e", borderRadius: "10px" },
  form: { display: "flex", gap: "10px", flexWrap: "wrap" },
  input: { padding: "10px", borderRadius: "5px", border: "none", background: "#333", color: "#fff" },
  button: {
    padding: "10px 20px",
    borderRadius: "5px",
    background: "#3498db",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 0 10px #3498db",
  },
  cancelButton: {
    padding: "10px 20px",
    borderRadius: "5px",
    background: "#e67e22",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },
  deleteButton: {
    background: "#e74c3c",
    padding: "5px 10px",
    borderRadius: "5px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },
  editButton: {
    background: "#2ecc71",
    padding: "5px 10px",
    borderRadius: "5px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    background: "#333",
  },
  tableThTd: {
    border: "1px solid #555",
    padding: "10px",
    textAlign: "center",
    color: "#fff",
  },
  chartContainer: { width: "40%", margin: "auto" },
};

export default App;
