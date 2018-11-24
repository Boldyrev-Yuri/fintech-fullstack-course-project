import React, { Component } from 'react';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import * as jquery from 'jquery';
import * as moment from 'moment';
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
      modalIsOpen: false
      // messageFromServer: ''
    };
    this.onClick = this.onClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addNewTask = this.addNewTask.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  // componentDidMount() {
  //   this.setState({
  //     month: this.props.selectedMonth
  //   });
  //   this.setState({
  //     year: this.props.selectedYear
  //   });
  // }

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
      taskDeadline: ''
      // messageFromServer: ''
    });
  }

  addNewTask(e) {
    const { user } = this.props.auth;
    const task = {
      name: this.state.taskName,
      description: this.state.taskDescription,
      deadline: this.state.taskDeadline,
      userId: user.id
    };

    console.log(user);

    this.props.addTask(task);

    // axios.post('/insert',
    //   querystring.stringify({
    //     desc: e.state.description,
    //     amount: e.state.amount,
    //     month: e.state.month,
    //     year: e.state.year
    //   }), {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     }
    //   }).then(response => {
    //   e.setState({
    //     messageFromServer: response.data
    //   });
    // });
  }

  handleInputChange(e) {
    console.log(this.state);
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleDateChange(date) {
    this.setState({
      // taskDeadline: moment(date._d).format('DD.MM.YYYY HH:mm:ss')
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
          // appElement={el}
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
          <fieldset>
            <label htmlFor="taskDeadline">Deadline:</label>
            <Datetime
              id="taskDeadline"
              name="taskDeadline"
              value={this.state.taskDeadline}
              // dateFormat="DD.MM.YYYY"
              // timeFormat="HH:mm:ss"
              viewMode="days"
              onChange={date => this.handleDateChange(date)}
              isValidDate={this.isValid}
              closeOnSelect
            />
            <label htmlFor="taskName">Task name:</label>
            <input
              type="text"
              id="taskName"
              name="taskName"
              value={this.state.taskName}
              onChange={e => this.handleInputChange(e)}
            />
            <label htmlFor="taskDescription">Task description:</label>
            <textarea
              id="taskDescription"
              name="taskDescription"
              value={this.state.taskDescription}
              onChange={e => this.handleInputChange(e)}
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

// export default connect(mapStateToProps, { registerUser })(withRouter(Register));
export default withRouter(connect(mapStateToProps, { addTask })(TaskForm));
