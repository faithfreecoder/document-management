import React from 'react';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import { connect } from 'react-redux';
import * as auth from '../../actions/auth';

/**
 *
 *
 * @class LoginPage
 * @extends {React.Component}
 */
export class LoginPage extends React.Component {

  /**
   * Creates an instance of LoginPage.
   * @param {Object} props
   * @param {Object} context
   *
   * @memberof LoginPage
   */
  constructor(props, context) {
    super(props, context);
    this.state = {
      login: {
        email: '',
        password: '' }
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   *
   * @param {any} nextProps
   * @returns {void}
   *
   * @memberof LoginPage
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      browserHistory.push('/dms/document');
    } else if (nextProps.auth.error) {
      toastr.error(nextProps.auth.error);
    }
  }

  /**
   *
   * @returns {void}
   * @param {Object} event
   *
   * @memberof LoginPage
   */
  onChange(event) {
    const login = this.state.login;
    const field = event.target.name;
    login[field] = event.target.value;
    this.setState(
      {
        login
      }
    );
  }

  /**
   *
   *
   * @returns {void}
   * @memberof LoginPage
   */
  onSubmit(event) {
    event.preventDefault();
    if (!this.state.email && !this.state.password) {
      this.props.actions.login(this.state.login);
    }
  }

  /**
   *
   *
   * @returns {Object} contains JSX code
   *
   * @memberof LoginPage
   */
  render() {
    return (
      <div id="login-padding">
        <h3>Log In</h3>
        <form action="#" onSubmit={this.onSubmit} method="post">
          <div className="">
            <div className="input-field col s6">
              <i className="material-icons prefix">email</i>
              <input
                onChange={this.onChange}
                value={this.state.login.email}
                name="email"
                type="email"
                className="col 5 s12" required />
              <label htmlFor="email">Email</label>
            </div>
          </div>
          <div className="">
            <div className="input-field col s6">
              <i className="material-icons prefix">lock</i>
              <input
                onChange={this.onChange}
                value={this.state.login.password}
                name="password"
                type="password"
                className="col 5 s12" required />
              <label htmlFor="password">Password</label>
            </div>
          </div>
          <div className="button-right">
          <input
          type="submit"
          value="Log in"
          className="waves-effect waves-light btn"
          />
          </div>
        </form>
      </div>
    );
  }
}

LoginPage.propTypes = {
  auth: React.PropTypes.object.isRequired
};

/**
 *
 *
 * @param {any} dispatch
 * @returns {Object} action
 */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(auth, dispatch)
  };
}

function matchStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(matchStateToProps,
 mapDispatchToProps)(LoginPage);
