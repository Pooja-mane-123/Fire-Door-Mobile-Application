import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {getAxios} from '@src/helpers/axios-interceptor';
import axios from 'axios';

// ==> Login Thunk
// export const LoginUserThunk = createAsyncThunk(
//   'auth/LoginUserThunk',
//   async (model, thunkAPI) => {
//     try {
//       let userLoginModel = {
//         username: 'mor_2314',
//         password: '83r5^_',
//       };
//       let res = await axios.post(
//         `https://fakestoreapi.com/auth/login`,
//         userLoginModel,
//       );
//       await AsyncStorage.setItem('token', res?.data?.token);
//       return res.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error);
//     }
//   },
// );

export const loginUserAction = createAsyncThunk(
  'auth/loginUserAction',
  async (model, thunkAPI) => {
    try {
      const res = await getAxios().post('/auth/signin', model);
      console.log('res.data', res.data);

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// ==> User Logged In Checking Thunk
export const GetAuthStatusThunk = createAsyncThunk(
  'auth/GetAuthStatusThunk',
  async (model, thunkAPI) => {
    try {
      let res = await AsyncStorage.getItem('token');
      if (res) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// ==> Log Out User Thunk
export const LogoutUserThunk = createAsyncThunk(
  'auth/LogoutUserThunk',
  async (model, thunkAPI) => {
    try {
      let res = await AsyncStorage.removeItem('token');
      if (res) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
