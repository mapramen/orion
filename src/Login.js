import React, {Component} from 'react';
import { GoogleLogin } from 'react-google-login';

export default class Login extends Component {
  constructor(props){
    super(props);
    this.state = {isAuthenticated : false, email: ''};
  }

  googleResponse = (response) => {
    if (!response.tokenId) {
      console.error("Unable to get tokenId from Google", response)
      return;
    }

    const tokenBlob = new Blob([JSON.stringify({ idtoken: response.tokenId }, null, 2)], { type: 'application/json' });
    const options = {
      method: 'POST',
      body: tokenBlob,
      mode: 'cors',
      cache: 'default'
    };
    fetch('http://localhost:5000/api/auth/google', options)
      .then(r => {
        r.json().then(user => {
          const token = user.token;
          console.log(token);
          this.setState({isAuthenticated:true, email:user.token})
        });
      })
  };

  render(){
    let content = !this.state.isAuthenticated ? <GoogleLogin clientId='' buttonText='Login' onSuccess={this.googleResponse} onFailure={this.googleResponse}/> : <h>{this.state.email}</h>;
    return(<div>
      {content}
    </div>)
  }
}