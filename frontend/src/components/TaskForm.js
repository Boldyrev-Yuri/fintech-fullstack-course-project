import React, { Component } from 'react';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import Modal from 'react-modal';
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
          bsStyle="success"
          bsSize="small"
          onClick={this.openModal}
        >
          <span className="glyphicon glyphicon-plus">Add new task</span>
        </Button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Add Expense"
          className="Modal"
        >
          <Link
            to={{ pathname: '/', search: '' }}
            style={{ textDecoration: 'none' }}
          >
            <Button
              bsStyle="danger"
              bsSize="small"
              onClick={this.closeModal}
            >
              <span className="closebtn glyphicon glyphicon-remove">Close</span>
            </Button>
          </Link>
          <br />
          <form>
            <fieldset>
              <label htmlFor="taskDeadline">Deadline:</label>
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
              <label htmlFor="taskName">Task name:</label>
              <input
                type="text"
                id="taskName"
                name="taskName"
                value={this.state.taskName}
                onChange={e => this.handleInputChange(e)}
                required
              />
              <label htmlFor="taskDescription">Task description:</label>
              <textarea
                id="taskDescription"
                name="taskDescription"
                value={this.state.taskDescription}
                onChange={e => this.handleInputChange(e)}
                required
              /><br />
              <label htmlFor="taskNotify">Notify prior to 30 minutes</label>
              <input
                type="checkbox"
                id="taskNotify"
                name="taskNotify"
                checked={this.state.taskNotify}
                onChange={e => this.handleInputChange(e)}
                required
              />
            </fieldset>
            <div className="button-center">
              <br />
              <Button
                bsStyle="success"
                bsSize="small"
                onClick={this.onClick}
              >
                Confirm
              </Button>
            </div>
          </form>
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

Modal.setAppElement('#root');

export default withRouter(connect(mapStateToProps, { addTask })(TaskForm));
