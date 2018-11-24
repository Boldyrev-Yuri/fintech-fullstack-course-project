import axios from 'axios';
import {
  GET_ERRORS,
  ADD_TASK,
  GET_TASKS_SUCCESS,
  GET_TASKS,
  EDIT_TASK,
  EDIT_TASK_SUCCESS,
  DELETE_TASK,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_DENIED
} from './types';

export const addTask = task => dispatch => {
  axios.post('/api/tasks/add', task)
    .then(res => {
      dispatch({
        type: ADD_TASK,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const fetchTasks = () => {
  return {
    type: GET_TASKS
  };
};

export const getTasks = userId => dispatch => {
  dispatch(fetchTasks());
  axios.post('/api/tasks/get', userId)
    .then(res => {
      console.log('res', res.data);
      dispatch({
        type: GET_TASKS_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const deleteTask = task => {
  return {
    type: DELETE_TASK,
    payload: task
  };
};

export const deleteTaskDenied = task => {
  return {
    type: DELETE_TASK_DENIED
  };
};

export const deleteTaskConfirmed = task => dispatch => {
  console.log('action', task);
  axios.post('/api/tasks/delete', task)
    .then(res => {
      console.log('delete res', res);
      dispatch({
        type: DELETE_TASK_SUCCESS,
        payload: res.data
      });
      // dispatch(deleteTaskDenied);
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const editTask = task => {
  console.log('task = ', task);
  return {
    type: EDIT_TASK,
    payload: task
  };
};

export const editTaskDenied = task => {
  return {
    type: EDIT_TASK
  };
};

export const editTaskConfirmed = (user, task) => dispatch => {
  axios.post('/api/tasks/edit', user, task)
    .then(res => {
      dispatch({
        type: EDIT_TASK_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
