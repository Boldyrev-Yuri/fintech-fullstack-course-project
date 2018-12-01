import React, { Component } from 'react';
import {
  Modal,
  Label,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Button,
  FormGroup
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Datetime from 'react-datetime';
import { addTask } from '../actions/tasks';
import 'react-datetime/css/react-datetime.css';

class TaskForm extends Component {
  constructor() {
    super();
    this.state = {
      taskName: '',
      taskDescription: '',
      taskDeadline: '',
      taskNotify: false,
      modalIsOpen: false
    };
    this.onClick = this.onClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addNewTask = this.addNewTask.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  onClick(e) {
    this.addNewTask(this);
    this.closeModal();
  }

  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      taskName: '',
      taskDescription: '',
      taskDeadline: '',
      taskNotify: false
    });
  }

  addNewTask(e) {
    const { user } = this.props.auth;
    const task = {
      name: this.state.taskName,
      description: this.state.taskDescription,
      deadline: this.state.taskDeadline,
      userId: user.id,
      notify: this.state.taskNotify
    };

    this.props.addTask(task);
  }

  handleInputChange(e) {
    const value = e.target.type === 'checkbox' ? !this.state.taskNotify : e.target.value;

    this.setState({
      [e.target.name]: value
    });
  }

  handleDateChange(date) {
    this.setState({
      taskDeadline: date._d
    });
  }

  isValid(current) {
    const yesterday = Datetime.moment().subtract(1, 'day');

    return current.isAfter(yesterday);
  }

  render() {
    return (
      <div>
        <Button
          color="secondary"
          onClick={this.openModal}
        >
          Создать задачу
        </Button>

        <Modal
          isOpen={this.state.modalIsOpen}
          className="Modal"
        >
          <ModalHeader>Новая задача</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="taskDeadline">Дедлайн:</Label>
                <Datetime
                  id="taskDeadline"
                  name="taskDeadline"
                  value={this.state.taskDeadline}
                  dateFormat="DD.MM.YYYY"
                  timeFormat="HH:mm:ss"
                  viewMode="days"
                  onChange={date => this.handleDateChange(date)}
                  isValidDate={this.isValid}
                  closeOnSelect
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="taskName">Название:</Label>
                <Input
                  type="text"
                  placeholder="Введите название задачи"
                  id="taskName"
                  name="taskName"
                  value={this.state.taskName}
                  onChange={e => this.handleInputChange(e)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="taskDescription">Описание:</Label>
                <Input
                  type="textarea"
                  placeholder="Введите описание задачи"
                  id="taskDescription"
                  name="taskDescription"
                  value={this.state.taskDescription}
                  onChange={e => this.handleInputChange(e)}
                  required
                />
              </FormGroup>
              <FormGroup style={{ marginLeft: '20px' }}>
                <Input
                  type="checkbox"
                  id="taskNotify"
                  name="taskNotify"
                  checked={this.state.taskNotify}
                  onChange={e => this.handleInputChange(e)}
                  required
                />
                <Label for="taskNotify">Уведомить за 30 минут до окончания</Label>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              onClick={this.onClick}
              disabled={this.state.taskName === '' || this.state.taskDescription === '' || typeof this.state.taskDeadline === 'undefined'}
            >
              Создать
            </Button>
            <Button
              color="danger"
              onClick={this.closeModal}
            >
              Отменить
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

TaskForm.propTypes = {
  addTask: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { addTask })(TaskForm));
