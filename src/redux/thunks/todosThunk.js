import {createAsyncThunk} from '@reduxjs/toolkit';
import qs from 'query-string';
import {getAxios} from '@src/helpers/axios-interceptor';

// ==> Get Todo By Thunk
export const GetTodosByUserId = createAsyncThunk(
  'todo/GetTodosByUserId',
  async (model, thunkAPI) => {
    try {
      const url = qs.stringifyUrl({
        url: '/todos',
        query: {
          userId: model?.id,
        },
      });

      const res = await getAxios().get(url);

      return res?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// ==> Delete Todo By Id
export const DeleteTodoById = createAsyncThunk(
  'todo/DeleteTodoById',
  async (model, thunkAPI) => {
    try {
      const url = qs.stringifyUrl({
        url: `/todos/${model.id}`,
      });

      const res = await getAxios().delete(url);

      return {...res?.data, id: model.id};
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// ==> Add Todo By
export const AddTodo = createAsyncThunk(
  'todo/AddTodo',
  async (model, thunkAPI) => {
    try {
      const postModel = {
        title: model.title,
        description: model.description,
        completed: false,
      };

      const res = await getAxios().post('todos', postModel);

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// ==> Update Todo By Id
export const UpdateTodo = createAsyncThunk(
  'todo/UpdateTodo',
  async (model, thunkAPI) => {
    try {
      const postModel = {
        id: model.id,
        title: model?.title,
        description: model?.description || '',
        completed: false,
      };

      const res = await getAxios().put(`todos/${postModel.id}`, postModel);

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
