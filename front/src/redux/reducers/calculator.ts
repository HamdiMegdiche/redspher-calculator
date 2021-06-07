import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface operation {
  value: string; // string to send to API
  computed: string; // computed value from API
}
// Calculator store state
interface calculatorState {
  operations: Array<operation>;
  errors: string;
}

// Initial state
const initialState: calculatorState = {
  operations: [],
  errors: ""
};
// Calculator slice, contains the name of the slice, initial state and actions/reducers combined
const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    addOperation(state, { payload }: PayloadAction<operation>) {
      // Add latest operations to the beginning
      state.operations.unshift(payload);
    },
    clearOperations(state) {
      state.operations = [];
    }
  }
});

// Exporting actions
export const actions = calculatorSlice.actions;

// Exporting reducer
export default calculatorSlice.reducer;
