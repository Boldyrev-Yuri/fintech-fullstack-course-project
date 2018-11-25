import React, { Component } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as moment from 'moment';
import {
  getTasks,
  deleteTask,
  deleteTaskConfirmed,
  deleteTaskDenied,
  editTask,
  editTaskDenied,
  toggleFilter,
  toggleTask,
  toggleTaskConfirmed,
  toggleTaskDenied
} from '../actions/tasks';
import TaskEditForm from './TaskEditForm';

const getVisibleTasks = (tasks, filter) => {
  switch (filter) {
    case 'SHOW_COMPLETED':
      return tasks.filter(t => t.status);
    case 'SHOW_ACTIVE':
      return tasks.filter(t => !t.status);
    default:
      throw new Error(`Unknown filter: ${filter}.`);
  }
};

class TaskList extends Component {
  constructor() {
    super();
    this.showEditModal = this.showEditModal.bind(this);
    this.hideEditModal = this.hideEditModal.bind(this);
    this.hideDeleteModal = this.hideDeleteModal.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.showToggleModal = this.showToggleModal.bind(this);
    this.hideToggleModal = this.hideToggleModal.bind(this);
    this.confirmDeleteTask = this.confirmDeleteTask.bind(this);
    this.confirmToggleTask = this.confirmToggleTask.bind(this);
  }

  componentWillMount() {
    const { user } = this.props.auth;

    this.props.getTasks({ userId: user.id });
  }

  showEditModal(taskToEdit) {
    this.props.editTask(taskToEdit);
  }

  showToggleModal(taskToToggle) {
    this.props.toggleTask(taskToToggle);
  }

  showDeleteModal(taskToDelete) {
    this.props.deleteTask(taskToDelete);
  }

  hideEditModal() {
    this.props.editTaskDenied();
  }

  hideToggleModal() {
    this.props.toggleTaskDenied();
  }

  hideDeleteModal() {
    this.props.deleteTaskDenied();
  }

  confirmDeleteTask() {
    this.props.deleteTaskConfirmed({ id: this.props.tasks.taskToDelete._id });
  }

  confirmToggleTask() {
    this.props.toggleTaskConfirmed({ id: this.props.tasks.taskToToggle._id });
  }

  render() {
    const taskState = this.props.tasks;
    const {
      tasks,
      isFetching,
      showDeleteModal,
      showEditModal,
      taskToDelete,
      taskToEdit,
      visibilityFilter,
      taskToToggle,
      showToggleModal
    } = taskState;

    return (
      <div>
        <Button
          onClick={() => this.props.toggleFilter('SHOW_ACTIVE')}
          disabled={visibilityFilter === 'SHOW_ACTIVE'}
        >
          Active
        </Button>
        <Button
          onClick={() => this.props.toggleFilter('SHOW_COMPLETED')}
          disabled={visibilityFilter === 'SHOW_COMPLETED'}
        >
          Completed
        </Button>
        {!tasks && isFetching &&
          <p>Loading tasks....</p>
        }
        {tasks.length <= 0 && !isFetching && visibilityFilter === 'SHOW_ACTIVE' &&
          <p>No active tasks available. Add a task to list here.</p>
        }
        {tasks.length <= 0 && !isFetching && visibilityFilter === 'SHOW_COMPLETED' &&
          <p>You have no completed tasks available. Do some work first, please.</p>
        }
        {tasks && tasks.length > 0 && !isFetching && (
          <div className="container">
            {tasks.map((task, i) => (
              <div key={task.id}>
                <h4>{task.name}</h4>
                <p>{task.description}</p>
                <span>Created: {moment(task.createdAt).format('DD.MM.YYYY HH:mm:ss')}</span><br />
                <span>Deadline: {moment(task.deadline).format('DD.MM.YYYY HH:mm:ss')}</span><br />
                {visibilityFilter !== 'SHOW_COMPLETED' && (
                  <div>
                    <span>Status: {task.status ? 'Done' : 'In progress'}</span><br />
                    <span>Notify: {task.notify ? 'Yes' : 'No'}</span><br />
                    <Button onClick={() => this.showToggleModal(task)}>Mark as completed</Button>
                    <Button onClick={() => this.showEditModal(task)}>Edit this task</Button>
                    <Button onClick={() => this.showDeleteModal(task)}>Delete this task</Button>
                  </div>
                )}
                {visibilityFilter === 'SHOW_COMPLETED' && (
                  <div>
                    <span>Completed: {moment(task.updatedAt).format('DD.MM.YYYY HH:mm:ss')}</span>
                  </div>
                )}
              </div>))
            }
          </div>)
        }

        <Modal
          isOpen={showEditModal}
          // onRequestClose={this.hideEditModal}
          contentLabel="Edit Your Task"
          className="Modal"
        >
          <div className="col-md-12">
            {taskToEdit &&
              <TaskEditForm taskData={taskToEdit} editTask={this.submitEditTodo} />
            }
          </div>
          <Button onClick={this.hideEditModal}>Close</Button>
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          contentLabel="Delete Your Task"
          className="Modal"
        >
          {taskToDelete && !isFetching && 
            <Alert bsStyle="warning">
              <strong>{taskToDelete.name} </strong><br />
              Are you sure you want to delete this task?
            </Alert>
          }
          <Button onClick={this.confirmDeleteTask}>Yes</Button>
          <Button onClick={this.hideDeleteModal}>No</Button>
        </Modal>

        <Modal
          isOpen={showToggleModal}
          contentLabel="Toggle Your Task"
          className="Modal"
        >
          {taskToToggle && !isFetching && 
            <Alert bsStyle="warning">
              <strong>{taskToToggle.name} </strong><br />
              Are you sure you want to mark this task as completed? <strong>This action cannot be udone!</strong>
            </Alert>
          }
          <Button onClick={this.confirmToggleTask}>Yes</Button>
          <Button onClick={this.hideDeleteModal}>No</Button>
        </Modal>


      </div>
    );
  }
}

TaskList.propTypes = {
  getTasks: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  deleteTaskConfirmed: PropTypes.func.isRequired,
  deleteTaskDenied: PropTypes.func.isRequired,
  editTask: PropTypes.func.isRequired,
  editTaskDenied: PropTypes.func.isRequired,
  toggleFilter: PropTypes.func.isRequired,
  toggleTask: PropTypes.func.isRequired,
  toggleTaskConfirmed: PropTypes.func.isRequired,
  toggleTaskDenied: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  tasks: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  tasks: {
    tasks: getVisibleTasks(state.tasks.tasks, state.tasks.visibilityFilter),
    isFetching: state.tasks.isFetching,
    showDeleteModal: state.tasks.showDeleteModal,
    showEditModal: state.tasks.showEditModal,
    taskToDelete: state.tasks.taskToDelete,
    taskToEdit: state.tasks.taskToEdit,
    visibilityFilter: state.tasks.visibilityFilter,
    showToggleModal: state.tasks.showToggleModal,
    taskToToggle: state.tasks.taskToToggle
  }
});

Modal.setAppElement('#root');

export default withRouter(connect(mapStateToProps, {
  getTasks,
  deleteTask,
  deleteTaskConfirmed,
  deleteTaskDenied,
  editTask,
  editTaskDenied,
  toggleFilter,
  toggleTask,
  toggleTaskConfirmed,
  toggleTaskDenied
})(TaskList));
