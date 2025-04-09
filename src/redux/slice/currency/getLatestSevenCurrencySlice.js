import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeApiRequest, notify, retryRequest } from "../../../utils/utils";

// Async thunk with retry logic
export const fetchCurrencyPairRate = createAsyncThunk(
  "fetchRate",
  async (fromCurrency = "USD", { rejectWithValue }) => {
    try {
      const response = await retryRequest(() => {
        return makeApiRequest(`https://v6.exchangerate-api.com/v6/72cd37435bd3592e77bea698/latest/${fromCurrency}`);
      });
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Something went wrong");
    }
  }
);

const initialState = {
  data: {},
  loading: false,
  error: "",
  success: false,
};

const getLatestSevenCurrencySlice = createSlice({
  name: "fetchRate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencyPairRate.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(fetchCurrencyPairRate.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.loading = false;
        state.success = true;
        state.error = "";
      })
      .addCase(fetchCurrencyPairRate.rejected, (state, { payload }) => {
        state.loading = false;
        state.success = false;
        state.error = payload;

        const isNetworkError = payload?.toLowerCase().includes("failed to fetch");
        const errorMessage = isNetworkError
          ? "Network error. Please check your internet connection."
          : payload;

        notify(errorMessage, "error");
        console.error("Error:", errorMessage);
      });
  },
});

export default getLatestSevenCurrencySlice.reducer;
