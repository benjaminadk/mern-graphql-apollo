import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { PropsRoute } from './helpers';
import { Button, Menu, Icon, Image } from 'semantic-ui-react';
import Home from './Home';
import Login from './Login';
import Logout from './Logout';
import Signup from './Signup';
import NoMatch from './NoMatch';
import UserProfileWithInfo from './UserProfile';
import jwt from 'jwt-decode';

const LoggedOutButtons = () => (
          <Menu.Menu position='right'>
            <Menu.Item>
              <Link to='/login'><Button>Login</Button></Link>
            </Menu.Item>
            <Menu.Item>
              <Link to='/signup'><Button>Signup</Button></Link>
            </Menu.Item>
          </Menu.Menu>
  );


const LoggedInButtons = () => {
  let token = window.localStorage.getItem('token');
  let decoded = token ? jwt(token) : null;
  let profileLink = decoded ? `/user/${decoded.username}` : '/';
  return(
          <Menu.Menu position='right'>
            <Menu.Item>
              <Image shape='rounded' width={50} src='http://via.placeholder.com/150x150' />
            </Menu.Item>
            <Menu.Item>
            <Link to={profileLink}><Button>Profile</Button></Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/logout'><Button>Logout</Button></Link>
            </Menu.Item>
          </Menu.Menu>
  );
}


class Routes extends Component{
  constructor(){
    super();
    this.state = {
      userLoggedIn: false
    }
  }
  
  toggleUserLogin = () => this.setState({userLoggedIn: !this.state.userLoggedIn});
  
  render(){
    
    const loggedIn = this.state.userLoggedIn;
    
    return(
    <Router>
      <div id='App'>
        
        <Menu>
          <Menu.Item>
            <Link to='/'>
              <Icon name='chrome' size='huge'/>
            </Link>
          </Menu.Item>
          
          {loggedIn ? <LoggedOutButtons/> : <LoggedInButtons/>}
        
        </Menu>
        
        <Switch>
          <Route exact path='/' component={Home}/>
          <PropsRoute path='/login' component={Login} login={this.toggleUserLogin}/>
          <PropsRoute path='/logout' component={Logout} logout={this.toggleUserLogin}/>
          <Route path='/signup' component={Signup}/>
          <Route path='/user/:username' component={UserProfileWithInfo}/>
          <Route component={NoMatch}/>
        </Switch>
        
      </div>
    </Router>
      )
  }
}

export default Routes