
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string | null;
  email: string | null;
  image: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  name: null,
  email: null,
  image: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name: string; email: string; image: string | null }>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.image = action.payload.image;
      state.isAuthenticated = true;
      state.error = null;
    },
    updateUserProfile: (state, action: PayloadAction<{ name?: string; email?: string; image?: string | null }>) => {
      if (action.payload.name) state.name = action.payload.name;
      if (action.payload.email) state.email = action.payload.email;
      if (action.payload.image !== undefined) state.image = action.payload.image;
    },
    logout: (state) => {
      state.name = null;
      state.email = null;
      state.image = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, updateUserProfile, logout, setLoading, setError } = userSlice.actions;

// Thunk for fetching user data
export const fetchUser = <TDispatch extends Dispatch>() => async (dispatch: TDispatch): Promise<void> => {
  try {
    dispatch(setLoading(true));
    const response = await (await fetch('/api/auth')).json()
    const result = response.data
    if (result) {
      dispatch(setUser({ ...result }));
    }
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch user data'));
  } finally {
    dispatch(setLoading(false));
  }
};

export default userSlice.reducer; 