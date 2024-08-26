import * as yup from 'yup';

// -------------------------- Login Valiation Schema -------------------------------------

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Username Is Required')
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      'Invalid email',
    ),
  password: yup
    .string()
    .required('Password Is Required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
      'Must be at least 6 characters, include 1 letter, 1 number and 1 special character',
    ),
});

// -------------------------- Add Todo Schema -------------------------------------

export const AddTodoSchema = yup.object().shape({
  title: yup.string().required('Title Required'),
  description: yup.string(),
});
