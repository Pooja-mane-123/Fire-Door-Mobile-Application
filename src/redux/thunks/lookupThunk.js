import {createAsyncThunk} from '@reduxjs/toolkit';
import qs from 'query-string';
import {getAxios} from '@src/helpers/axios-interceptor';

// ==> Get Lookup By Thunk
export const getLookupAction = createAsyncThunk(
  'lookup/getLookupAction',
  async (model, thunkAPI) => {
    try {
      const res = await getAxios().get('/lookup');

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getLookupByTypeAction = createAsyncThunk(
  'lookup/getLookupByTypeAction',
  async (model, thunkAPI) => {
    try {
      const {type} = model;
      const res = await getAxios().get(`/lookupType`);

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
