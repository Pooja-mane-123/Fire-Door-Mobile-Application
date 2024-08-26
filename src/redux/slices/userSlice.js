import {createSlice} from '@reduxjs/toolkit';
import {getInspectorById} from '../thunks/userThunk';

const initState = {
  userData: [],
  loading: false,
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState: initState,
  reducers: {},

  extraReducers: builder => {
    //==> Get Todos By Id Thunk
    builder.addCase(getInspectorById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getInspectorById.fulfilled, (state, action) => {
      state.loading = false;
      state.userData = action.payload;
    });
    builder.addCase(getInspectorById.rejected, (state, action) => {
      state.loading = false;
      error = action.payload;
    });
  },
});

export default userSlice.reducer;
