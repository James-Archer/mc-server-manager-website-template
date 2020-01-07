import React from 'react';
import request from 'request';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';

const POST_API_ENDPOINT='<YOUR start-minecraft-server API ENDPOINT HERE'
const STATUS_API_ENDPOINT='YOUR status-minecraft-server API ENDPOINT HERE'

class App extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = 
    {
      serverPassword: '',
      requestStatus: 0,
      appState: 0,
      serverState: false,
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
              serverState: values["<SERVER-NAME-HERE>"],
              appState: 1
            })
        }
        });
  }

  postRequest()
  {
  request.post(POST_API_ENDPOINT,
    {form:{
        server: "<SERVER-NAME-HERE>",
        password: this.state.serverPassword
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


  setPassword(event)
  {
    var pw = event.target.value
    this.setState({serverPassword: pw})
  }

  keyPressed(event)
  {
    if (event.key === "Enter")
    {
      this.setState({requestStatus: 4})
      this.postRequest()
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
      error_txt = 'Something went wrong :('
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
      var server_render
      // render server stuff
      if (this.state.serverState)
      {
        server_render = <div className="App-running">SERVER-NAME is running!</div>
      }
      else {
        server_render = <div>SERVER-NAME
        <input type="password" className='PwdInput' placeholder='Password'
          value={this.state.serverPassword} 
          onChange={this.setPassword.bind(this)}
          onKeyPress={this.keyPressed.bind(this)}
          /></div>
      }
      
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p className="App-Header">
              Start the servers!
            </p>
            {server_render}
            {error_render}
          </header>
        </div>
      );
    }
  }
}

export default App;
