// ./react-redux-client/src/components/TodoEditForm.js
import React, { Component } from 'react';
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Button
} from 'react-bootstrap';

class TaskEditForm extends Component {
  render() {
    const { taskData } = this.props;
    console.log('editform', taskData);

    return (
      <form className="form form-horizontal" id="EditTodoForm" onSubmit={this.props.editTask}>
        <div className="row">
          <div className="col-md-12">
            <FormGroup>
              <ControlLabel>Task: </ControlLabel>
              <input type="hidden" value={taskData._id} name="id"/>
              <FormControl
                type="text" placeholder="Enter todo"
                name="todoText" defaultValue={taskData.name}
              />
            </FormGroup>
          </div>
          <div className="col-md-12">
            <FormGroup>
              <ControlLabel>Description: </ControlLabel>
              <FormControl
                componentClass="textarea" placeholder="Enter description"
                name="todoDesc" defaultValue={taskData.description}
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

export default TaskEditForm;
