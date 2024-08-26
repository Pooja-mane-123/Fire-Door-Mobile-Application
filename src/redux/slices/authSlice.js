import {createSlice} from '@reduxjs/toolkit';
import {
  GetAuthStatusThunk,
  loginUserAction,
  LogoutUserThunk,
} from '../thunks/authThunk';

const initState = {
  isLoggedIn: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState: initState,
  reducer: {},

  extraReducers: builder => {
    //==> Auth Status Thunk
    builder.addCase(GetAuthStatusThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(GetAuthStatusThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.isLoggedIn = action.payload;
    });
    builder.addCase(GetAuthStatusThunk.rejected, (state, action) => {
      state.loading = false;
      error = action.payload;
    });

    //==> Login Thunk
    builder.addCase(loginUserAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
    });
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.loading = false;
      error = action.payload;
    });

    //==> Login Logout Thunk
    builder.addCase(LogoutUserThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(LogoutUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.isLoggedIn = action.payload;
    });
    builder.addCase(LogoutUserThunk.rejected, (state, action) => {
      state.loading = false;
      error = action.payload;
    });
  },
});

export default authSlice.reducer;
