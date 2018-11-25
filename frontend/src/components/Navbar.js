import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Navbar,
  NavItem,
  Nav,
  NavDropdown,
  MenuItem,
  Button,
  NavbarBrand,
  NavLink,
  NavbarToggler,
  Collapse,
  FormInline,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';

class MyNavbar extends Component {
  onLogout(e) {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <span> Hello, {user.name}! </span>
        <Button className="nav-link" onClick={this.onLogout.bind(this)}>Log Out</Button>
      </ul>

      // <Nav right>
      //   <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
      //     <MenuItem>
      //       <Button className="nav-link" onClick={this.onLogout.bind(this)}>Log Out</Button>
      //     </MenuItem>
      //   </NavDropdown>
      // </Nav>

    );
    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">Sign Up</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">Sign In</Link>
        </li>
      </ul>

      // <Nav right>
      //   <NavItem>
      //     <Link className="nav-link" to="/register">Sign Up</Link>
      //   </NavItem>
      //   <NavItem>
      //     <Link className="nav-link" to="/login">Sign In</Link>
      //   </NavItem>
      // </Nav>
    );

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Redux Node Auth</Link>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </nav>

      // <Navbar inverse collapseOnSelect>
      //   <NavbarBrand>
      //     Fullstack-Fintech
      //   </NavbarBrand>
      //   <Collapse>
      //     {isAuthenticated ? authLinks : guestLinks}
      //   </Collapse>
      // </Navbar>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { logoutUser })(MyNavbar));
