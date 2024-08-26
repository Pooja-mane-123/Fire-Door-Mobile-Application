import {configureStore} from '@reduxjs/toolkit';
import auth from '@src/redux/slices/authSlice';
import todo from '../slices/todosSlice';
import user from '../slices/userSlice';

const store = configureStore({reducer: {auth, todo, user}});

export default store;
