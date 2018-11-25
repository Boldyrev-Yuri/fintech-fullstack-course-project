import {
  ADD_TASK,
  GET_TASKS,
  GET_TASKS_SUCCESS,
  DELETE_TASK,
  DELETE_TASK_SUCCESS,
  EDIT_TASK,
  EDIT_TASK_SUCCESS,
  DELETE_TASK_DENIED,
  EDIT_TASK_DENIED,
  TOGGLE_FILTER,
  TOGGLE_TASK,
  TOGGLE_TASK_DENIED,
  TOGGLE_TASK_SUCCESS
} from '../actions/types';

const initialState = {
  tasks: [],
  isFetching: false,
  showDeleteModal: false,
  taskToDelete: null,
  showEditModal: false,
  taskToEdit: null,
  showToggleModal: false,
  taskToToogle: null,
  visibilityFilter: 'SHOW_ACTIVE'
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
        taskToEdit: null,
        showToggleModal: false,
        taskToToogle: null,
        visibilityFilter: state.visibilityFilter
      };
    case GET_TASKS:
      return {
        ...state,
        tasks: state.tasks,
        isFetching: true,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null,
        showToggleModal: false,
        taskToToogle: null,
        visibilityFilter: state.visibilityFilter
      };
    case GET_TASKS_SUCCESS:
      return {
        ...state,
        tasks: action.payload,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null,
        showToggleModal: false,
        taskToToogle: null,
        visibilityFilter: state.visibilityFilter
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks,
        isFetching: false,
        showDeleteModal: true,
        taskToDelete: action.payload,
        showEditModal: false,
        taskToEdit: null,
        showToggleModal: false,
        taskToToogle: null,
        visibilityFilter: state.visibilityFilter
      };
    case DELETE_TASK_DENIED:
      return {
        ...state,
        tasks: state.tasks,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null,
        showToggleModal: false,
        taskToToogle: null,
        visibilityFilter: state.visibilityFilter
      };
    case DELETE_TASK_SUCCESS:
      const filteredTasks = state.tasks.filter(task => task._id !== state.taskToDelete._id);

      return {
        ...state,
        tasks: filteredTasks,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null,
        showToggleModal: false,
        taskToToogle: null,
        visibilityFilter: state.visibilityFilter
      };
    case EDIT_TASK:
      return {
        ...state,
        tasks: state.tasks,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: true,
        showToggleModal: false,
        taskToToogle: null,
        taskToEdit: action.payload,
        visibilityFilter: state.visibilityFilter
      };
    case EDIT_TASK_DENIED:
      return {
        ...state,
        tasks: state.tasks,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null,
        showToggleModal: false,
        taskToToogle: null,
        visibilityFilter: state.visibilityFilter
      };
    case EDIT_TASK_SUCCESS:
      const updatedTasks = state.tasks.map(task => {
        if (task._id !== action.payload._id) {
          return task;
        }
        return action.payload;
      });

      return {
        ...state,
        tasks: updatedTasks,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null,
        showToggleModal: false,
        taskToToogle: null,
        visibilityFilter: state.visibilityFilter
      };
    case TOGGLE_FILTER:
      return {
        ...state,
        tasks: state.tasks,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null,
        showToggleModal: false,
        taskToToogle: null,
        visibilityFilter: action.payload
      };
    case TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null,
        showToggleModal: true,
        taskToToggle: action.payload,
        visibilityFilter: state.visibilityFilter
      };
    case TOGGLE_TASK_DENIED:
      return {
        ...state,
        tasks: state.tasks,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null,
        showToggleModal: false,
        taskToToogle: null,
        visibilityFilter: action.payload
      };
    case TOGGLE_TASK_SUCCESS:
      const toggledTasks = state.tasks.map(task => {
        if (task._id !== action.payload._id) {
          return task;
        }
        return action.payload;
      });

      return {
        ...state,
        tasks: toggledTasks,
        isFetching: false,
        showDeleteModal: false,
        taskToDelete: null,
        showEditModal: false,
        taskToEdit: null,
        showToggleModal: false,
        taskToToogle: null,
        visibilityFilter: state.visibilityFilter
      };
    default:
      return state;
  }
};
