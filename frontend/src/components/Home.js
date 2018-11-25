import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TaskForm from './TaskForm';
import TaskList from './TaskList';

class Home extends Component {
  render() {
    const { isAuthenticated, user } = this.props.auth;
    const defaultText = (
      <div>
        You have to Sign In in order to start using this app
      </div>
    );
    const userTasks = (
      <div>
        <TaskForm />
        <TaskList />
      </div>
    );
    return (
      <div>
        {isAuthenticated ? userTasks : defaultText}
      </div>
    );
  }
};

Home.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, {})(Home));
