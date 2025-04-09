import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeApiRequest, retryRequest, notify } from "../../../utils/utils";

// Async thunk with retry logic
export const getAllCurrencyRateAction = createAsyncThunk(
  "getAllCurrency",
  async (_, { rejectWithValue }) => {
    try {
      const response = await retryRequest(() =>
        makeApiRequest("https://v6.exchangerate-api.com/v6/72cd37435bd3592e77bea698/latest/USD")
      );
      return response;
    } catch (error) {
      // Cleanly pass error message to the slice
      return rejectWithValue(error?.message || "Something went wrong");
    }
  }
);

const initialState = {
  currencyrate: {},
  loading: false,
  error: "",
  message: "",
  success: false,
};

const getAllCurrencySlice = createSlice({
  name: "getAllCurrency",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCurrencyRateAction.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(getAllCurrencyRateAction.fulfilled, (state, { payload }) => {
        state.currencyrate = payload;
        state.loading = false;
        state.success = true;
        state.message = "Fetched currency rates successfully";
      })
      .addCase(getAllCurrencyRateAction.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.success = false;
        state.message = payload;

        const isNetworkError =
          typeof payload === "string" && payload.toLowerCase().includes("failed to fetch");

        const errorMessage = isNetworkError
          ? "Network error: Please check your internet connection."
          : payload;

        notify(errorMessage, "error");
        console.error("Error:", payload);
      });
  },
});

export default getAllCurrencySlice.reducer;
