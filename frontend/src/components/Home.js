import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardTitle } from 'reactstrap';
import TaskList from './TaskList';

const Home = (props) => {
  const { isAuthenticated } = props.auth;
  const defaultText = (
    <div className="container" style={{ marginTop: '40px', maxWidth: '700px' }}>
      <Card body outline color="primary">
        <CardTitle>You have to Sign In in order to start using this app</CardTitle>
        {/* <CardText>With supporting text below as a natural lead-in to additional content.</CardText> */}
        {/* <Button color="secondary">Button</Button> */}
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
