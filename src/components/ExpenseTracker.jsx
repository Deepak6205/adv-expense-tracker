import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { ref, push, get } from "firebase/database";

const ExpenseTracker = () => {
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses when component mounts
  useEffect(() => {
    if (!currentUser) return;

    const fetchExpenses = async () => {
      try {
        const snapshot = await get(ref(db, `expenses/${currentUser.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert object to array
          const expensesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setExpenses(expensesArray);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !description) {
      alert("Please fill all fields");
      return;
    }

    const newExpense = {
      amount,
      description,
      category,
      createdAt: Date.now(),
    };

    try {
      // Save in Firebase
      const expenseRef = ref(db, `expenses/${currentUser.uid}`);
      await push(expenseRef, newExpense);

      // Update state locally (optimistic update)
      setExpenses([...expenses, newExpense]);

      // Reset form
      setAmount("");
      setDescription("");
      setCategory("Food");
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense. Try again.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg mt-6">
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
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Add Expense
        </button>
      </form>

      {/* Expense List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Your Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses added yet.</p>
        ) : (
          <ul className="space-y-3">
            {expenses.map((exp, index) => (
              <li
                key={exp.id || index}
                className="border p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{exp.description}</p>
                  <p className="text-sm text-gray-500">{exp.category}</p>
                </div>
                <span className="text-blue-600 font-bold">₹{exp.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;
