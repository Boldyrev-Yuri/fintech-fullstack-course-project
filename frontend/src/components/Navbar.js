import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';
import TaskForm from './TaskForm';

class MyNavbar extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
    this.toggle = this.toggle.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  onLogout(e) {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const authLinks = (
      <React.Fragment>
        <Nav className="mr-auto">
          <NavItem>
            <TaskForm />
          </NavItem>
        </Nav>
        <Nav className="ml-auto">
          <NavItem>
            <NavLink>Добро пожаловать, {user.name}!</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" onClick={e => this.onLogout(e)}>Выйти</NavLink>
          </NavItem>
        </Nav>
      </React.Fragment>
    );
    const guestLinks = (
      <Nav className="ml-auto">
        <NavItem>
          <NavLink tag={Link} to="/register">Регистрация</NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/login">Вход</NavLink>
        </NavItem>
      </Nav>
    );

    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Fullstack-Fintech</NavbarBrand>
        {isAuthenticated ? authLinks : guestLinks}
      </Navbar>
    );
  }
}

MyNavbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { logoutUser })(MyNavbar));
