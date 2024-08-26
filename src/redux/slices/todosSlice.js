import {createSlice} from '@reduxjs/toolkit';
import {
  GetTodosByUserId,
  DeleteTodoById,
  AddTodo,
  UpdateTodo,
} from '../thunks/todosThunk';

const initState = {
  todos: [],
  loading: false,
  udpateTodoId: 1,
};

const todoSlice = createSlice({
  name: 'todoSlice',
  initialState: initState,
  reducers: {
    setUpdateTodoId: (state, action) => {
      state.udpateTodoId = action.payload.id;
    },
  },

  extraReducers: builder => {
    //==> Get Todos By Id Thunk
    builder.addCase(GetTodosByUserId.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(GetTodosByUserId.fulfilled, (state, action) => {
      state.loading = false;
      state.todos = action.payload;
    });
    builder.addCase(GetTodosByUserId.rejected, (state, action) => {
      state.loading = false;
      error = action.payload;
    });

    //==> Get Todos By Id Thunk
    builder.addCase(DeleteTodoById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(DeleteTodoById.fulfilled, (state, action) => {
      state.loading = false;
      const findDeletedTodo = state.todos.filter(
        ele => ele.id !== action.payload.id,
      );
      state.todos = [...findDeletedTodo];
    });
    builder.addCase(DeleteTodoById.rejected, (state, action) => {
      state.loading = false;
      error = action.payload;
    });

    //==> Add Todo
    builder.addCase(AddTodo.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(AddTodo.fulfilled, (state, action) => {
      state.loading = false;
      let todos = state.todos;
      state.todos = [action.payload, ...todos];
    });
    builder.addCase(AddTodo.rejected, (state, action) => {
      state.loading = false;
      error = action.payload;
    });

    //==> Update Todo
    builder.addCase(UpdateTodo.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(UpdateTodo.fulfilled, (state, action) => {
      state.loading = false;
      const findItem = state.todos.find(ele => ele.id == action.payload.id);
      const filteredItem = state.todos.filter(ele => {
        return ele.id !== findItem.id;
      });
      state.udpateTodoId = undefined;
      state.todos = [action.payload, ...filteredItem];
    });
    builder.addCase(UpdateTodo.rejected, (state, action) => {
      state.loading = false;
      error = action.payload;
    });
  },
});

export const {setUpdateTodoId} = todoSlice.actions;

export default todoSlice.reducer;
