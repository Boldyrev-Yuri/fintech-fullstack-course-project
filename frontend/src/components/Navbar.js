import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authentication';

class Navbar extends Component {
  onLogout(e) {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <span> {user.name} </span>
        <button type="button" className="nav-link" onClick={this.onLogout.bind(this)}>
          (Logout)
        </button>
      </ul>
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
    );

    return(
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Redux Node Auth</Link>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </nav>
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

// export default connect(mapStateToProps, { logoutUser })(withRouter(Navbar));
export default withRouter(connect(mapStateToProps, { logoutUser }));
