import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { loginUser } from '../actions/authentication';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/');
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(user);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="container" style={{ marginTop: '40px', maxWidth: '500px' }}>
        <Form onSubmit={this.handleSubmit}>
          <h2 style={{ marginBottom: '20px' }}>Login</h2>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={this.handleInputChange}
              value={this.state.email}
              className={classnames('form-control form-control-lg', {
                'is-invalid': errors.email
              })}
            />
            {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={this.handleInputChange}
              value={this.state.password}
              className={classnames('form-control form-control-lg', {
                'is-invalid': errors.password
              })}
            />
            {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
          </FormGroup>
          <Button color="primary">Submit</Button>
        </Form>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(mapStateToProps, { loginUser })(Login));
