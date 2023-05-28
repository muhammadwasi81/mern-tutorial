import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cardService from './cardService';

/// Create new goal
export const createCard = createAsyncThunk(
  'goals/create',
  async (cardData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await cardService.createCard(cardData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user goals
export const getCards = createAsyncThunk(
  'goals/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await cardService.getAllCards(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user goal by id
export const getCardsForCurrentUser = createAsyncThunk(
  'goals/getById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await cardService.getCardsForCurrentUser(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user goal
export const deleteCardById = createAsyncThunk(
  'goals/delete',
  async (_id, thunkAPI) => {
    console.log('id', _id);
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await cardService.deleteCardById(_id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user goal
export const updateCardById = createAsyncThunk(
  'goals/update',
  async ({ payload }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await cardService.updateCardById(payload.id, payload, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  cards: [],
  card: {},
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

const cardSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    removeCards: (state, action) => {
      state.cards = state.cards.filter((card) => card._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCards.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder
      .addCase(getCardsForCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getCardsForCurrentUser.fulfilled, (state, action) => {
        console.log('getCardsForCurrentUser', action.payload);
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.cards = action.payload;
      })
      .addCase(getCardsForCurrentUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = payload;
      })
      .addCase(createCard.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.cards.push(action.payload);
      })
      .addCase(createCard.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateCardById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(updateCardById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.cards = state.cards.map((card) =>
          card._id === action.payload._id ? action.payload : card
        );
      })
      .addCase(updateCardById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { removeCards, reset } = cardSlice.actions;
export default cardSlice.reducer;
