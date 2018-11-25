import React, { Component } from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  Checkbox
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import * as Datetime from 'react-datetime';
import { editTaskConfirmed } from '../actions/tasks';
import 'react-datetime/css/react-datetime.css';

class TaskEditForm extends Component {
  constructor() {
    super();
    this.state = {
      taskName: '',
      taskDescription: '',
      taskDeadline: '',
      taskNotify: false,
      userId: ''
    };
  }

  componentDidMount() {
    this.setState({
      taskName: this.props.taskData.name,
      taskDescription: this.props.taskData.description,
      taskDeadline: this.props.taskData.deadline,
      taskNotify: this.props.taskData.notify,
      userId: this.props.taskData.userId
    });
  }

  handleInputChange(e) {
    console.log(this.state);
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

  handleSubmit(e) {
    e.preventDefault();
    const task = {
      id: this.props.taskData._id,
      name: this.state.taskName,
      description: this.state.taskDescription,
      deadline: this.state.taskDeadline,
      userId: this.state.userId,
      notify: this.state.taskNotify
    };

    this.props.editTaskConfirmed(task);
  }

  render() {
    const { taskData } = this.props;

    return (
      <form className="form form-horizontal" id="EditTodoForm" onSubmit={e => this.handleSubmit(e)}>
        <div className="row">
          <div className="col-md-12">
            <FormGroup>
              <label htmlFor="taskDeadline">Deadline:</label>
              <Datetime
                id="taskDeadline"
                name="taskDeadline"
                value={moment(this.state.taskDeadline).format('DD.MM.YYYY HH:mm:ss')}
                dateFormat="DD.MM.YYYY"
                timeFormat="HH:mm:ss"
                viewMode="days"
                onChange={date => this.handleDateChange(date)}
                isValidDate={this.isValid}
                closeOnSelect
              />
            </FormGroup>
          </div>
          <div className="col-md-12">
            <FormGroup>
              <ControlLabel>Task: </ControlLabel>
              <input type="hidden" value={taskData._id} name="id"/>
              <FormControl
                type="text"
                placeholder="Enter task"
                name="taskName"
                defaultValue={this.state.taskName}
                onChange={e => this.handleInputChange(e)}
              />
            </FormGroup>
          </div>
          <div className="col-md-12">
            <FormGroup>
              <ControlLabel>Description: </ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder="Enter description"
                name="taskDescription"
                value={this.state.taskDescription}
                onChange={e => this.handleInputChange(e)}
              />
            </FormGroup>
          </div>
          <div className="col-md-12">
            <FormGroup>
              <ControlLabel>Notify: </ControlLabel>
              <Checkbox
                name="taskNotify"
                checked={this.state.taskNotify}
                onChange={e => this.handleInputChange(e)}
              />
            </FormGroup>
          </div>
        </div>
        <FormGroup>
          <Button type="submit" bsStyle="success" bsSize="large" block>Submit</Button>
        </FormGroup>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  taskData: state.tasks.taskToEdit
});

TaskEditForm.propTypes = {
  taskData: PropTypes.object.isRequired,
  editTaskConfirmed: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, { editTaskConfirmed })(TaskEditForm));
