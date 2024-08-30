import {createAsyncThunk} from '@reduxjs/toolkit';
import qs from 'query-string';
import {getAxios} from '@src/helpers/axios-interceptor';

// ==> Get All User By Thunk
export const getAllUserAction = createAsyncThunk(
  'user/getAllUserAction',
  async (model, thunkAPI) => {
    try {
      const query = qs.stringify(model);
      const res = await getAxios().get('/user?${query}');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// ==> Get User By Id
// GET /api/inspector/[id]
export const getInspectorById = createAsyncThunk(
  'user/getInspectorById',
  async (model, thunkApi) => {
    try {
      const {userId, profile} = model;
      const res = await getAxios().get(`inspector/${model}`, {
        params: {},
      });
      console.log('res.data', res.data);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

export const getDirectorById = createAsyncThunk(
  'user/getDirectorById',
  async (model, thunkApi) => {
    try {
      const {userId, profile} = model;
      const res = await getAxios().get(`director/${model}`, {
        params: {},
      });
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

export const getTodaysInspectionByInspectorId = createAsyncThunk(
  'user/getTodaysInspectionByInspectorId',
  async (model, thunkApi) => {
    try {
      const {userId, profile} = model;
      const res = await getAxios().get(`inspector/${model}/inspection`, {
        params: {},
      });
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

export const getQrCodeById = createAsyncThunk(
  'user/getQrCodeById',
  async (model, thunkApi) => {
    try {
      const {qrCodeId} = model;
      const res = await getAxios().get(`door/qRCode/${model}`, {
        params: {},
      });
      console.log('res.data', res.data);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

export const createDoorInspectionReport = createAsyncThunk(
  'user/createDoorInspectionReport',
  async (model, thunkApi) => {
    try {
      const res = await getAxios().post(
        `door/${model.doorId}/doorInspectionReport`,
        model,
      );
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);
