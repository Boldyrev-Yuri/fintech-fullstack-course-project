import React, { Component } from 'react';
import {
  Label,
  Input,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import * as Datetime from 'react-datetime';
import { editTaskConfirmed } from '../actions/tasks';
import 'react-datetime/css/react-datetime.css';

class TaskEditForm extends Component {
  constructor(props) {
    super(props);
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
      <Form
        className="form form-horizontal"
        onSubmit={e => this.handleSubmit(e)}
      >
        <ModalBody>
          <FormGroup>
            <Label for="taskDeadline">Deadline:</Label>
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
          <FormGroup>
            <Label for="taskName">Task: </Label>
            <Input type="hidden" value={taskData._id} name="id"/>
            <Input
              type="text"
              placeholder="Enter task"
              id="taskName"
              name="taskName"
              value={this.state.taskName}
              onChange={e => this.handleInputChange(e)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="taskDescription">Description: </Label>
            <Input
              type="textarea"
              placeholder="Enter description"
              name="taskDescription"
              id="taskDescription"
              value={this.state.taskDescription}
              onChange={e => this.handleInputChange(e)}
            />
          </FormGroup>
          <FormGroup style={{ marginLeft: '20px' }}>
            <Input
              type="checkbox"
              name="taskNotify"
              id="taskNotify"
              checked={this.state.taskNotify}
              onChange={e => this.handleInputChange(e)}
            />
            <Label for="taskNotify">Notify prior to 30 minutes</Label>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="success">Submit</Button>
          <Button color="danger" onClick={this.hideEditModal}>Close</Button>
        </ModalFooter>
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  taskData: state.tasks.taskToEdit
});

TaskEditForm.propTypes = {
  taskData: PropTypes.object.isRequired,
  hideEditModal: PropTypes.func.isRequired,
  editTaskConfirmed: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, { editTaskConfirmed })(TaskEditForm));
