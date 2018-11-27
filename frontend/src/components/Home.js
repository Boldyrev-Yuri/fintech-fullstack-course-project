import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardTitle } from 'reactstrap';
import TaskList from './TaskList';

const Home = props => {
  const { isAuthenticated } = props.auth;
  const defaultText = (
    <div className="container" style={{ marginTop: '40px', maxWidth: '700px' }}>
      <Card body outline color="primary">
        <CardTitle>Перед тем, как создать задачу, Вы должны войти в свой аккаунт или зарегистрироваться</CardTitle>
      </Card>
    </div>
  );
  const userTasks = (
    <div>
      <TaskList />
    </div>
  );

  return (
    <div>
      {isAuthenticated ? userTasks : defaultText}
    </div>
  );
};

Home.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, {})(Home));
