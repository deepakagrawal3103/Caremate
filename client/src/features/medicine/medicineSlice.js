import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { medicineAPI } from "./medicineAPI";

// Async thunks
export const fetchMedicines = createAsyncThunk(
  "medicine/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.getAllMedicines();
      return response.data.medicines;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch medicines");
    }
  }
);

export const addMedicine = createAsyncThunk(
  "medicine/add",
  async (medicineData, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.addMedicine(medicineData);
      return response.data.medicine;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add medicine");
    }
  }
);

export const updateMedicine = createAsyncThunk(
  "medicine/update",
  async ({ id, medicineData }, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.updateMedicine(id, medicineData);
      return response.data.medicine;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update medicine");
    }
  }
);

export const deleteMedicine = createAsyncThunk(
  "medicine/delete",
  async (id, { rejectWithValue }) => {
    try {
      await medicineAPI.deleteMedicine(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete medicine");
    }
  }
);

export const normalizeMedicine = createAsyncThunk(
  "medicine/normalize",
  async (name, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.normalizeMedicine(name);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to normalize medicine");
    }
  }
);

export const checkInteraction = createAsyncThunk(
  "medicine/checkInteraction",
  async (medicineId, { rejectWithValue }) => {
    try {
      const response = await medicineAPI.checkInteraction(medicineId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to check interaction");
    }
  }
);

const medicineSlice = createSlice({
  name: "medicine",
  initialState: {
    medicines: [],
    loading: false,
    error: null,
    interactionResult: null,
    normalizedResult: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearInteractionResult: (state) => {
      state.interactionResult = null;
    },
    clearNormalizedResult: (state) => {
      state.normalizedResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch medicines
      .addCase(fetchMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add medicine
      .addCase(addMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines.push(action.payload);
      })
      .addCase(addMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update medicine
      .addCase(updateMedicine.fulfilled, (state, action) => {
        const index = state.medicines.findIndex(med => med._id === action.payload._id);
        if (index !== -1) {
          state.medicines[index] = action.payload;
        }
      })
      // Delete medicine
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.medicines = state.medicines.filter(med => med._id !== action.payload);
      })
      // Normalize medicine
      .addCase(normalizeMedicine.fulfilled, (state, action) => {
        state.normalizedResult = action.payload;
      })
      .addCase(normalizeMedicine.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Check interaction
      .addCase(checkInteraction.fulfilled, (state, action) => {
        state.interactionResult = action.payload;
      })
      .addCase(checkInteraction.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearInteractionResult, clearNormalizedResult } = medicineSlice.actions;
export default medicineSlice.reducer;