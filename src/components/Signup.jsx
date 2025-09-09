import React from 'react'
import '../styles/signup.css';
const Signup = () => {
  return (
     <div>
      <div className="navbar">
        <div className="logo">MyWebLink</div>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Products</a></li>
          <li><a href="#">About Us</a></li>
        </ul>
      </div>

      <div className="container">
        <div className="signup-box">
          <h2>SignUp</h2>
          <form>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />
            <button type="submit">Sign up</button>
          </form>
          <a href="#" className="login-link">Have an account? Login</a>
        </div>
      </div>
    </div>
  )
}

export default Signup