// src/components/ExpenseTracker.jsx
import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { ref, push, get, remove, update } from "firebase/database";
import { useSelector, useDispatch } from "react-redux";
import {
  setExpenses,
  addExpense,
  deleteExpense as deleteExpenseAction,
  updateExpense as updateExpenseAction,
} from "../redux/expensesSlice";

const ExpenseTracker = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { list: expenses, premiumActivated } = useSelector((s) => s.expenses);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ amount: "", description: "", category: "Food" });

  useEffect(() => {
    if (!user?.uid) return;

    const fetchExpenses = async () => {
      try {
        const snapshot = await get(ref(db, `expenses/${user.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const expensesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          dispatch(setExpenses(expensesArray));
        } else {
          dispatch(setExpenses([]));
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [user, dispatch]);

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
      const expenseRef = ref(db, `expenses/${user.uid}`);
      const newRef = await push(expenseRef, newExpense);

      dispatch(addExpense({ id: newRef.key, ...newExpense }));
      setAmount("");
      setDescription("");
      setCategory("Food");
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense. Try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(ref(db, `expenses/${user.uid}/${id}`));
      dispatch(deleteExpenseAction(id));
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
      const payload = {
        amount: Number(editValues.amount),
        description: editValues.description,
        category: editValues.category,
        createdAt: Date.now(),
      };
      await update(ref(db, `expenses/${user.uid}/${id}`), payload);
      dispatch(updateExpenseAction({ id, ...payload }));
      setEditingId(null);
      setEditValues({ amount: "", description: "", category: "Food" });
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Daily Expenses</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="number"
          placeholder="Amount Spent"
          className="border border-gray-300 p-3 rounded-lg"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="border border-gray-300 p-3 rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="border border-gray-300 p-3 rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Food">Food</option>
          <option value="Petrol">Petrol</option>
          <option value="Salary">Salary</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Add Expense
        </button>
      </form>

      {/* Premium */}
      {premiumActivated && (
        <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
          Activate Premium
        </button>
      )}

      {/* Expense List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Your Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses added yet.</p>
        ) : (
          <ul className="space-y-3">
            {expenses.map((exp) => (
              <li key={exp.id} className="border p-3 rounded-lg flex justify-between items-center">
                {editingId === exp.id ? (
                  <div className="flex flex-col gap-2 w-full">
                    <input
                      type="number"
                      className="border p-2 rounded"
                      value={editValues.amount}
                      onChange={(e) => setEditValues({ ...editValues, amount: e.target.value })}
                    />
                    <input
                      type="text"
                      className="border p-2 rounded"
                      value={editValues.description}
                      onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                    />
                    <select
                      className="border p-2 rounded"
                      value={editValues.category}
                      onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                    >
                      <option value="Food">Food</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Salary">Salary</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditSubmit(exp.id)} className="bg-green-600 text-white px-3 py-1 rounded">
                        Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-medium text-gray-800">{exp.description}</p>
                      <p className="text-sm text-gray-500">
                        {exp.category} • ₹{exp.amount}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(exp)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(exp.id)} className="bg-red-600 text-white px-3 py-1 rounded">
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
