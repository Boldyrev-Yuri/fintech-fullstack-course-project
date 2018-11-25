import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { registerUser } from '../actions/authentication';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
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
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm
    };

    this.props.registerUser(user, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="container" style={{ marginTop: '40px', maxWidth: '500px' }}>
        <Form onSubmit={this.handleSubmit}>
          <h2 style={{ marginBottom: '20px' }}>Registration</h2>
          <FormGroup>
            <Label for="name">Email</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              onChange={this.handleInputChange}
              value={this.state.name}
              className={classnames('form-control form-control-lg', {
                'is-invalid': errors.name
              })}
            />
            {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
          </FormGroup>
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
          <FormGroup>
            <Label for="passwordConfirm">Confirm Password</Label>
            <Input
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              placeholder="Confirm Password"
              onChange={this.handleInputChange}
              value={this.state.passwordConfirm}
              className={classnames('form-control form-control-lg', {
                'is-invalid': errors.password_confirm
              })}
            />
            {errors.password_confirm && (<div className="invalid-feedback">{errors.password_confirm}</div>)}
          </FormGroup>
          <Button color="primary">Submit</Button>
        </Form>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(mapStateToProps, { registerUser })(Register));
