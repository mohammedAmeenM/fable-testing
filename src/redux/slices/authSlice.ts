import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userId: string | null;
  accessToken: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userId: null,
  accessToken: null,
  userEmail: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signupSuccess: (state, action: PayloadAction<{ userId: string; email: string }>) => {
      state.userId = action.payload.userId;
      state.userEmail = action.payload.email;
    },
    loginSuccess: (state, action: PayloadAction<{ userId: string; accessToken: string; email: string }>) => {
      state.userId = action.payload.userId;
      state.accessToken = action.payload.accessToken;
      state.userEmail = action.payload.email;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userId = null;
      state.accessToken = null;
      state.userEmail = null;
      state.isAuthenticated = false;
    },
  },
});

export const { signupSuccess, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
