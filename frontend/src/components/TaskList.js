import React, { Component } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import Modal from 'react-modal';
// import {
//   Modal,
//   ModalHeader,
//   ModalTitle,
//   ModalClose,
//   ModalBody,
//   ModalFooter
// } from 'react-modal-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import * as jquery from 'jquery';
import * as moment from 'moment';
import {
  getTasks,
  deleteTask,
  deleteTaskConfirmed,
  deleteTaskDenied,
  editTask,
  editTaskConfirmed,
  editTaskDenied
} from '../actions/tasks';
import TaskEditForm from './TaskEditForm';

class TaskList extends Component {
  constructor() {
    super();
    this.showEditModal = this.showEditModal.bind(this);
    this.hideEditModal = this.hideEditModal.bind(this);
    this.hideDeleteModal = this.hideDeleteModal.bind(this);
    this.showDeleteModal = this.showDeleteModal.bind(this);
    this.cofirmDeleteTask = this.cofirmDeleteTask.bind(this);
    // this.submitEditTask = this.submitEditTask.bind(this);
  }

  componentWillMount() {
    const { user } = this.props.auth;

    this.props.getTasks({ userId: user.id });
  }

  showEditModal(taskToEdit) {
    console.log('show modal', taskToEdit);
    this.props.editTask(taskToEdit);
  }

  hideEditModal() {
    this.props.editTaskDenied();
  }

  // submitEditTask(e) {
  //   e.preventDefault();
  //   const editForm = document.getElementById('EditTodoForm');
  //   if(editForm.todoText.value !== ""){
  //     const data = new FormData();
  //     data.append('id', editForm.id.value);
  //     data.append('todoText', editForm.todoText.value);
  //     data.append('todoDesc', editForm.todoDesc.value);
  //     this.props.EditTaskConfirmed(data);
  //   } else {
  //     return;
  //   }
  //   this.hideEditModal()
  // }

  hideDeleteModal() {
    this.props.deleteTaskDenied();
  }

  showDeleteModal(taskToDelete) {
    console.log('show', taskToDelete);
    this.props.deleteTask(taskToDelete);
  }

  cofirmDeleteTask() {
    console.log('in component', this.props.tasks.taskToDelete._id);
    this.props.deleteTaskConfirmed({ id: this.props.tasks.taskToDelete._id });
    // if (!this.props.tasks.taskToDelete) {
    //   this.hideDeleteModal();
    // }
  }

  render() {
    const taskState = this.props.tasks;
    const {
      tasks,
      isFetching,
      showDeleteModal,
      showEditModal,
      taskToDelete,
      taskToEdit
    } = taskState;
    console.log('render', taskToEdit);

    console.log(tasks);

    return (
      <div>
        <span>Hiiiiii</span>

        {!tasks && isFetching &&
          <p>Loading tasks....</p>
        }
        {tasks.length <= 0 && !isFetching &&
          <p>No Tasks Available. Add A Task to List here.</p>
        }
        {tasks && tasks.length > 0 && !isFetching && (
          <div className="container">
            {tasks.map((task, i) => (
              <div key={task.id}>
                <h4>{task.name}</h4>
                <p>{task.description}</p>
                <span>{task.deadline}</span>
                <Button onClick={() => this.showEditModal(task)}>Edit this task</Button>
                <Button onClick={() => this.showDeleteModal(task)}>Delete this task</Button>
              </div>))
            }
            {/* {this.getTasks()} */}
            {/* {tasks} */}
          </div>)
        }

        {/* Modal for editing task */}

        {/* <Modal
          show={showEditModal}
          onHide={this.hideEditModal}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <ModalHeader closeButton>
            <ModalClose onClick={this.hideEditModal}/>
            <ModalTitle id="contained-modal-title">Edit Your Task</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="col-md-12">
              {taskToEdit &&
                // <TaskEditForm taskData={taskToEdit} editTodo={this.submitEditTodo} />
                <span>Hello!</span>
              }
              {taskToEdit && isFetching &&
                <Alert bsStyle="info">
                  <strong>Updating...... </strong>
                </Alert>
              }
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.hideEditModal}>Close</Button>
          </ModalFooter>
        </Modal> */}

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
            {taskToEdit && isFetching &&
              <Alert bsStyle="info">
                <strong>Updating...... </strong>
              </Alert>
            }
          </div>
          <Button onClick={this.hideEditModal}>Close</Button>
        </Modal>

        {/* Modal for deleting task */}

        {/* <Modal
          show={showDeleteModal}
          onHide={this.hideDeleteModal}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <ModalHeader closeButton>
            <ModalClose onClick={this.hideDeleteModal}/>
            <ModalTitle id="contained-modal-title">Delete Your Task</ModalTitle>
          </ModalHeader>
          <ModalBody>
            {taskToDelete && !this.props.error && !isFetching && 
              <Alert bsStyle="warning">
                <strong>{taskToDelete.name} </strong><br />
                Are you sure you want to delete this task?
              </Alert>
            }
            {taskToDelete && this.props.error &&
              <Alert bsStyle="warning">
                Failed. <strong>{this.props.error} </strong>
              </Alert>
            }
            {taskToDelete && !this.props.error && isFetching &&
              <Alert bsStyle="success">
                <strong>Deleting.... </strong>
              </Alert>
            }
            {!taskToDelete && !this.props.error && !isFetching&&
              <Alert bsStyle="success">
                Task deleted
              </Alert>
            }
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.cofirmDeleteTask}>Yes</Button>
            <Button onClick={this.hideDeleteModal}>No</Button>
          </ModalFooter>
        </Modal> */}

        <Modal
          isOpen={showDeleteModal}
          // onRequestClose={this.hideDeleteModal}
          contentLabel="Delete Your Task"
          className="Modal"
        >
          {taskToDelete && !this.props.error && !isFetching && 
            <Alert bsStyle="warning">
              <strong>{taskToDelete.name} </strong><br />
              Are you sure you want to delete this task?
            </Alert>
          }
          {taskToDelete && this.props.error &&
            <Alert bsStyle="warning">
              Failed. <strong>{this.props.error} </strong>
            </Alert>
          }
          {taskToDelete && !this.props.error && isFetching &&
            <Alert bsStyle="success">
              <strong>Deleting.... </strong>
            </Alert>
          }
          {!taskToDelete && !this.props.error && !isFetching&&
            <Alert bsStyle="success">
              Task deleted
            </Alert>
          }
          <Button onClick={this.cofirmDeleteTask}>Yes</Button>
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
  editTaskConfirmed: PropTypes.func.isRequired,
  editTaskDenied: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  tasks: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  tasks: state.tasks
});

// Modal.setAppElement('#root');

// export default connect(mapStateToProps, { registerUser })(withRouter(Register));
export default withRouter(connect(mapStateToProps, {
  getTasks,
  deleteTask,
  deleteTaskConfirmed,
  deleteTaskDenied,
  editTask,
  editTaskConfirmed,
  editTaskDenied
})(TaskList));
