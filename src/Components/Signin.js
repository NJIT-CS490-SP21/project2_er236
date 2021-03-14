import React from 'react';
import PropTypes from 'prop-types';

export const Signin = (props) =>(<form onSubmit={props.func}>
        <h1>Hello User</h1>
        <p>Enter your username:</p>
        <input type="text" />
        <br />
        <select name="What are you doing">
          <option value="login">login</option>
          <option value="register">registering</option>
        </select>
        <input type="submit" value="Submit" />
      </form>);
Signin.propType={
      func:PropTypes.any
}