import React from 'react';
import request from 'request';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';

const API_ENDPOINT='https://cy67vlzf05.execute-api.ap-southeast-2.amazonaws.com/default/start-minecraft-server'

class App extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = 
    {
      bumblePassword: '',
      lotrPassword: '',
      requestStatus: 0
    };
  }

  postRequest1()
  {
  request.post(API_ENDPOINT,
    {form:{
        server: "bumble",
        password: this.state.bumblePassword
    }}, (error, response, body)=>
    {
      if (error)
      {
        console.error('error:', error); // Print the error if one occurred
        this.setState({requestStatus: -1})
      }
      else if(response.statusCode === 200)
      {
        console.log('response:', body); // Print the error if one occurred
        const bdy = JSON.parse(body)
        if (bdy[0] === 'Incorrect password!')
        {
          console.log('bad')
          this.setState({requestStatus: 1})
        }
        else{
          console.log('good')
          if (bdy[3] === true)
          {
            this.setState({requestStatus: 3})
          }
          else{ this.setState({requestStatus: 2}) }
        }
      }
      });
  }

  postRequest2()
  {
  request.post(API_ENDPOINT,
    {form:{
        server: "lotr",
        password: this.state.lotrPassword
    }}, (error, response, body)=>
    {
      if (error)
      {
        console.error('error:', error); // Print the error if one occurred
      }
      else if(response.statusCode === 200)
      {
        console.log('response:', body); // Print the error if one occurred
        const bdy = JSON.parse(body)
        if (bdy[0] === 'Incorrect password!')
        {
          console.log('bad')
          this.setState({requestStatus: 1})
        }
        else{
          console.log('good')
          if (bdy[3] === true)
          {
            this.setState({requestStatus: 3})
          }
          else{ this.setState({requestStatus: 2}) }
        }
      }
      });
  }

  setPassword1(event)
  {
    var pw = event.target.value
    this.setState({bumblePassword: pw})
  }

  setPassword2(event)
  {
    var pw = event.target.value
    this.setState({lotrPassword: pw})
  }

  keyPressed1(event)
  {
    if (event.key === "Enter")
    {
      console.log("Submitting password for bumble: " + this.state.bumblePassword)
      this.setState({requestStatus: 4})
      this.postRequest1()
    }
  }

  keyPressed2(event)
  {
    if (event.key === "Enter")
    {
      console.log("Submitting password for lotr: " + this.state.lotrPassword)
      this.postRequest2()
    }
  }

  render(){
    var error_txt, error_render
    if (this.state.requestStatus === 1)
    {
      error_txt = 'Incorrect password!'
      error_render = <p className='App-error'>{error_txt}</p>
    }
    else if (this.state.requestStatus === 2)
    {
      error_txt = 'Error starting server!'
      error_render = <p className='App-error'>{error_txt}</p>
    }
    else if (this.state.requestStatus === 3)
    {
      error_txt = 'Server starting!'
      error_render = <p className='App-success'>{error_txt}</p>
    }
    else if (this.state.requestStatus === -1)
    {
      error_txt = 'Something went wrong :( Tell James'
      error_render = <p className='App-error'>{error_txt}</p>
    }
    else if (this.state.requestStatus === 4)
    {
      error_render = <img className="App-loading" src={loading} />
    }
    else { error_txt = '' }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p className="App-Header">
            Start the servers!
          </p>
          Bumble
          <input type="password" className='PwdInput' placeholder='Password'
            value={this.state.bumblePassword} 
            onChange={this.setPassword1.bind(this)}
            onKeyPress={this.keyPressed1.bind(this)}
            />
          Lord of the Rings
          <input type="password" className='PwdInput' placeholder='Password'
            value={this.state.lotrPassword} 
            onChange={this.setPassword2.bind(this)}
            onKeyPress={this.keyPressed2.bind(this)}
            />
            {error_render}
        </header>
      </div>
    );
  }
}

export default App;
