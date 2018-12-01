import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  Alert,
  Button,
  ButtonGroup,
  CardTitle,
  CardText,
  CardHeader,
  CardBody
} from 'reactstrap';
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
      isFetching,
      showDeleteModal,
      showEditModal,
      taskToDelete,
      taskToEdit,
      visibilityFilter,
      taskToToggle,
      showToggleModal
    } = taskState;
    let { tasks } = taskState;

    if (visibilityFilter === 'SHOW_ACTIVE') {
      tasks.sort((a, b) => {
        return a.deadline - b.deadline;
      });
    } else if (visibilityFilter === 'SHOW_COMPLETED') {
      tasks.sort((a, b) => {
        const ms = moment(b.createdAt).diff(moment(a.createdAt));
        const d = moment.duration(ms);
        const s = Math.floor(d.asHours()) + moment.utc(ms).format(':mm:ss');

        if (String(s)[0] === '-') {
          return -1;
        }
        return 1;
      });
    }

    return (
      <div className="text-center">
        <ButtonGroup>
          <Button
            color="info"
            onClick={() => this.props.toggleFilter('SHOW_ACTIVE')}
            disabled={visibilityFilter === 'SHOW_ACTIVE'}
          >
            Текущие
          </Button>
          <Button
            color="info"
            onClick={() => this.props.toggleFilter('SHOW_COMPLETED')}
            disabled={visibilityFilter === 'SHOW_COMPLETED'}
          >
            Выполненные
          </Button>
        </ButtonGroup>
        {!tasks && isFetching && (
          <p>Загружаем задачи....</p>
        )}
        {tasks.length <= 0 && !isFetching && visibilityFilter === 'SHOW_ACTIVE' && (
          <div className="container" style={{ marginTop: '40px', maxWidth: '700px' }}>
            <Card body outline color="primary">
              <CardTitle>Текущих задач не найдено. Создайте новую задачу, и она появится здесь.</CardTitle>
            </Card>
          </div>
        )}
        {tasks.length <= 0 && !isFetching && visibilityFilter === 'SHOW_COMPLETED' && (
          <div className="container" style={{ marginTop: '40px', maxWidth: '700px' }}>
            <Card body outline color="primary">
              <CardTitle>Выполненных задач не найдено. Сначала придется немного поработать :)</CardTitle>
            </Card>
          </div>
        )}
        {tasks && tasks.length > 0 && !isFetching && (
          <div className="container">
            {tasks.map((task, i) => (
              <div
                key={task.id}
                className="container"
                style={{ marginTop: '15px', marginBottom: '5px', maxWidth: '700px' }}
              >
                <Card outline color="primary">
                  <CardHeader tag="h4">{task.name}</CardHeader>
                  <CardBody>
                    <CardTitle>{task.description}</CardTitle>
                    <CardText>
                      <span>Создана: {moment(task.createdAt).format('DD.MM.YYYY HH:mm:ss')}</span><br />
                      <span>Дедлайн: {moment(task.deadline).format('DD.MM.YYYY HH:mm:ss')}</span><br />
                      {visibilityFilter !== 'SHOW_COMPLETED' && (
                        <React.Fragment>
                          <span>Статус: {task.status ? 'выполнена' : 'в процессе'}</span><br />
                          <span>Уведомление: {task.notify ? 'да' : 'нет'}</span><br />
                          <Button
                            color="success"
                            onClick={() => this.showToggleModal(task)}
                          >
                            Выполнить
                          </Button>
                          <Button
                            color="warning"
                            onClick={() => this.showEditModal(task)}
                          >
                            Изменить
                          </Button>
                          <Button
                            color="danger"
                            onClick={() => this.showDeleteModal(task)}
                          >
                            Удалить
                          </Button>
                        </React.Fragment>
                      )}
                      {visibilityFilter === 'SHOW_COMPLETED' && (
                        <React.Fragment>
                          <span>Выполнена: {moment(task.updatedAt).format('DD.MM.YYYY HH:mm:ss')}</span><br />
                          <Button
                            color="danger"
                            onClick={() => this.showDeleteModal(task)}
                          >
                            Удалить
                          </Button>
                        </React.Fragment>
                      )}
                    </CardText>
                  </CardBody>
                </Card>
              </div>))
            }
          </div>)
        }

        <Modal
          isOpen={showEditModal}
          className="Modal"
        >
          <ModalHeader>Изменить задачу</ModalHeader>
          {taskToEdit && (
            <TaskEditForm taskData={taskToEdit} hideEditModal={this.hideEditModal} />
          )}
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          className="Modal"
        >
          <ModalHeader>Удалить задачу</ModalHeader>
          <ModalBody>
            {taskToDelete && !isFetching && (
              <Alert color="warning">
                <strong>{taskToDelete.name}</strong><br />
                Вы уверены, что хотите удалить эту задачу?
              </Alert>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.confirmDeleteTask}>Yes</Button>
            <Button onClick={this.hideDeleteModal}>No</Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={showToggleModal}
          className="Modal"
        >
          <ModalHeader>Выполнить</ModalHeader>
          <ModalBody>
            {taskToToggle && !isFetching && (
              <Alert color="warning">
                <strong>{taskToToggle.name} </strong><br />
                Вы уверены, что хотите отметить данную задачу как выполненную? <br />
                <span>Это действие нельзя изменить!</span>
              </Alert>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.confirmToggleTask}>Yes</Button>
            <Button onClick={this.hideDeleteModal}>No</Button>
          </ModalFooter>
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

// Modal.setAppElement('#root');

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
