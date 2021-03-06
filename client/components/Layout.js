import React, { PropTypes } from 'react';
import Header from './common/Header';
// import Footer from './common/Footer';

/**
 *
 *
 * @class Layout
 * @extends {React.Component}
 */
export class Layout extends React.Component {
  /**
   *
   *
   * @returns  contains JSX code
   *
   * @memberof Layout
   */
  render() {
    return (
      <div className="header">
        <Header />
        {this.props.children}
        {/* <Footer />*/}
      </div>
    );
  }
}

export default Layout;
