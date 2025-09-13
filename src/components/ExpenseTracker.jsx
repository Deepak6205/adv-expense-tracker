import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { ref, push, get, remove, update } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import {
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../redux/expensesSlice";
import { toggleTheme } from "../redux/themeSlice";

const ExpenseTracker = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);
  const expenses = useSelector((state) => state.expenses.list);
  const premiumActivated = useSelector(
    (state) => state.expenses.premiumActivated
  );
  const darkMode = useSelector((state) => state.theme.darkMode);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    amount: "",
    description: "",
    category: "Food",
  });

  useEffect(() => {
    if (!currentUser) return;
    const fetchExpenses = async () => {
      try {
        const snapshot = await get(ref(db, `expenses/${currentUser.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const expensesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          dispatch(setExpenses(expensesArray));
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, [currentUser, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !description) {
      alert("Please fill all fields");
      return;
    }
    const newExpense = {
      amount: Number(amount),
      description,
      category,
      createdAt: Date.now(),
    };
    try {
      const expenseRef = ref(db, `expenses/${currentUser.uid}`);
      const newRef = await push(expenseRef, newExpense);
      dispatch(addExpense({ id: newRef.key, ...newExpense }));
      setAmount("");
      setDescription("");
      setCategory("Food");
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `expenses/${currentUser.uid}/${id}`));
      dispatch(deleteExpense(id));
      console.log("Expense successfully deleted");
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditValues({
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
    });
  };

  const handleEditSubmit = async (id) => {
    try {
      await update(ref(db, `expenses/${currentUser.uid}/${id}`), editValues);
      dispatch(updateExpense({ id, ...editValues }));
      setEditingId(null);
      setEditValues({ amount: "", description: "", category: "Food" });
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleDownloadCSV = () => {
    const headers = ["Amount", "Description", "Category", "Date"];
    const rows = expenses.map((exp) => [
      exp.amount,
      exp.description,
      exp.category,
      new Date(exp.createdAt).toLocaleString(),
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } shadow-md rounded-lg p-6 w-full max-w-lg mt-6`}
    >
      <h2 className="text-xl font-bold mb-4">Daily Expenses</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          placeholder="Amount Spent"
          className="border p-3 rounded-lg text-black"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="border p-3 rounded-lg text-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="border p-3 rounded-lg text-black"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Food">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Salary">Salary</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Add Expense
        </button>
      </form>

      {premiumActivated && (
        <div className="mt-6 space-y-3">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 w-full"
          >
            {darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
          </button>
          <button
            onClick={handleDownloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full"
          >
            Download Expenses (CSV)
          </button>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Your Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses added yet.</p>
        ) : (
          <ul className="space-y-3">
            {expenses.map((exp) => (
              <li
                key={exp.id}
                className="border p-3 rounded-lg flex justify-between items-center"
              >
                {editingId === exp.id ? (
                  <div className="flex flex-col gap-2 w-full">
                    <input
                      type="number"
                      className="border p-2 rounded text-black"
                      value={editValues.amount}
                      onChange={(e) =>
                        setEditValues({ ...editValues, amount: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="border p-2 rounded text-black"
                      value={editValues.description}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          description: e.target.value,
                        })
                      }
                    />
                    <select
                      className="border p-2 rounded text-black"
                      value={editValues.category}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="Food">Food</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Salary">Salary</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSubmit(exp.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-medium">{exp.description}</p>
                      <p className="text-sm">
                        {exp.category} • ₹{exp.amount}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(exp)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
