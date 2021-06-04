import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Student store state
interface calculatorState {
  operations: Array<string>;
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
    // Set errors : used for potential errors from the API
    setErrors(state, { payload }: PayloadAction<string>) {
      state.errors = payload;
    }
  }
});

// Exporting actions
export const actions = calculatorSlice.actions;

// Exporting reducer
export default calculatorSlice.reducer;
