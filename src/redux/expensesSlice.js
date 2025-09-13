import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  premiumActivated: false,
};

const calcPremium = (list) => {
  const total = list.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  return total > 10000;
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenses(state, action) {
      state.list = action.payload.map((e) => ({
        ...e,
        amount: Number(e.amount),
      }));
      state.premiumActivated = calcPremium(state.list);
    },
    addExpense(state, action) {
      state.list.push({
        ...action.payload,
        amount: Number(action.payload.amount),
      });
      state.premiumActivated = calcPremium(state.list);
    },
    updateExpense(state, action) {
      const idx = state.list.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1)
        state.list[idx] = {
          ...action.payload,
          amount: Number(action.payload.amount),
        };
      state.premiumActivated = calcPremium(state.list);
    },
    deleteExpense(state, action) {
      state.list = state.list.filter((e) => e.id !== action.payload);
      state.premiumActivated = calcPremium(state.list);
    },
    clearExpenses(state) {
      state.list = [];
      state.premiumActivated = false;
    },
  },
});

export const {
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  clearExpenses,
} = expensesSlice.actions;
export default expensesSlice.reducer;
