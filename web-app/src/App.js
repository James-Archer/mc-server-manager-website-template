import React from 'react';
import request from 'request';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';

const POST_API_ENDPOINT='https://cy67vlzf05.execute-api.ap-southeast-2.amazonaws.com/default/start-minecraft-server'
const STATUS_API_ENDPOINT='https://cy67vlzf05.execute-api.ap-southeast-2.amazonaws.com/default/status-minecraft-server'

class App extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = 
    {
      bumblePassword: '',
      lotrPassword: '',
      requestStatus: 0,
      appState: 0,
      bumbleState: false,
      lotrState: false
    };
  }

  componentDidMount(){
    this.getServerStatus();
  }

  getServerStatus()
  {
    request.post(STATUS_API_ENDPOINT, (error, response, body)=>
      {
        if (error)
        {
          console.error('error:', error); // Print the error if one occurred
        }
        else if(response.statusCode === 200)
        {
          // Good return value
          const values = JSON.parse(body)
          this.setState({
              bumbleState: values["bumble"],
              lotrState: values["lotr"],
              appState: 1
            })
        }
        });
  }

  postRequest1()
  {
  request.post(POST_API_ENDPOINT,
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
          this.setState({requestStatus: 1})
        }
        else{
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
  request.post(POST_API_ENDPOINT,
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
          this.setState({requestStatus: 1})
        }
        else{
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
      this.setState({requestStatus: 4})
      this.postRequest2()
    }
  }

  getErrorState()
  {
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
    return (error_render)
  }

  render(){

    if (this.state.appState === 0)
    {
      return (
      <div className="App">
          <header className="App-header">
          <img className="App-loading" src={loading} />
          </header>
        </div>
      )
    }

    else{
      var error_render = this.getErrorState()
      var bumble_render, lotr_render
      // render bumble
      if (this.state.bumbleState)
      {
        bumble_render = <div className="App-running">Bumble is running!</div>
      }
      else {
        bumble_render = <div>Bumble
        <input type="password" className='PwdInput' placeholder='Password'
          value={this.state.bumblePassword} 
          onChange={this.setPassword1.bind(this)}
          onKeyPress={this.keyPressed1.bind(this)}
          /></div>
      }
      // render lotr 
      if (this.state.lotrState)
      {
        lotr_render = <div className="App-running">Lord of the Rings is running!</div>
      }
      else {
        lotr_render = <div>Lord of the Rings
        <input type="password" className='PwdInput' placeholder='Password'
          value={this.state.lotrPassword} 
          onChange={this.setPassword2.bind(this)}
          onKeyPress={this.keyPressed2.bind(this)}
          /></div>
      }
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p className="App-Header">
              Start the servers!
            </p>
            {bumble_render}
            {lotr_render}
            {error_render}
          </header>
        </div>
      );
    }
  }
}

export default App;
