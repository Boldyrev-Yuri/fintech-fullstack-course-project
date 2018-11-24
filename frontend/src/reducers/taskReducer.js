import {
  ADD_TASK,
  GET_TASKS,
  GET_TASKS_SUCCESS,
  DELETE_TASK,
  DELETE_TASK_SUCCESS,
  EDIT_TASK,
  EDIT_TASK_SUCCESS,
  DELETE_TASK_DENIED
} from '../actions/types';
// import isEmpty from '../validation/isEmpty';

const initialState = {
  tasks: [],
  isFetching: false,
  showDeleteModal: false,
  taskToDelete: null,
  showEditModal: false,
  taskToEdit: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null
      };
    case GET_TASKS:
      return {
        ...state,
        tasks: state.tasks,
        isFetching: true,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null
      };
    case GET_TASKS_SUCCESS:
      return {
        ...state,
        tasks: action.payload,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null
      };
    case DELETE_TASK:
      console.log('del task', state.showDeleteModal, state.taskToDelete, action.payload);
      return {
        ...state,
        tasks: state.tasks,
        isFetching: false,
        showDeleteModal: true,
        taskToDelete: action.payload,
        showEditModal: false,
        taskToEdit: null
      };
    case DELETE_TASK_DENIED:
      console.log('deny task', state.showDeleteModal, state.taskToDelete, action.payload);
      return {
        ...state,
        tasks: state.tasks,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null
      };
    case DELETE_TASK_SUCCESS:
      console.log('reducer', state);
      const filteredTasks = state.tasks.filter(task => task._id !== state.taskToDelete._id);

      return {
        ...state,
        tasks: filteredTasks,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null
      };
    case EDIT_TASK:
      return {
        ...state,
        tasks: state.tasks,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: true,
        taskToEdit: action.payload
      };
    case EDIT_TASK_SUCCESS:
      const updatedTasks = state.tasks.map(task => {
        if (task._id !== action.payload._id) {
          return task;
        }
        return { ...task, ...action.payload }
      });

      return {
        ...state,
        tasks: updatedTasks,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null
      };
    default:
      return state;
  }
};
