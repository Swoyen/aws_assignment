import React, { Component } from 'react';
import olympic_rings from './img/olympic_rings.png';
import overlay from './img/play-overlay.png';
import Signin from './Components/Signin';
import UserDetails from './Components/UserDetails';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSignInVisible: false,
      cognitoUser: '',
      loggedIn: false,
      userDetailVisible: false,
      nickname: 'Test',
      phone: '+61623912312',
      username: 'Test',
      email: 'Test'
    }
    this.updateUser = this.updateUser.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.hideUserDetails = this.hideUserDetails.bind(this);
  }

  updateUserAttributes() {
    var that = this;
    this.setState({
      username: this.state.cognitoUser.username
    })

    this.state.cognitoUser.getUserAttributes(function (err, result) {
      if (err) {
        alert(err.message || JSON.stringify(err));
        return;
      }
      for (var i = 0; i < result.length; i++) {
        console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        if (result[i].getName() === "email") {
          that.setState({
            email: result[i].getValue()

          })
        }
        else if (result[i].getName() === "phone_number") {
          that.setState({
            phone: result[i].getValue()
          })
        }
        else if (result[i].getName() === "nickname") {
          that.setState({
            nickname: result[i].getValue()
          })
        }
      }
    });
  }

  updateUser(user) {
    this.setState({
      cognitoUser: user,

    })
    console.log("ATT:" + user)
    this.updateUserAttributes();

  }

  hideUserDetails(){
    this.setState({
      userDetailVisible: false
    })
  }

  updateStatus(cond) {
    this.setState({
      loggedIn: cond
    });

  }

  handleSignIn(e) {
    this.setState({
      isSignInVisible: !this.state.isSignInVisible,

    })
  }


  doSignOut(e) {
    var that = this;
    this.state.cognitoUser.signOut(function (error, result) {
      if (error) {

      }
      else {
        that.loggedIn = false;
        window.location.reload();
      }
    })
    console.log(this.state.cognitoUser);

    window.location.reload();
  }

  componentDidMount() {

  }

  displayUserDetails() {
    return <UserDetails />
  }


  handleSignInOrSignUp(e) {
    if (this.state.loggedIn) this.doSignOut(e)
    else this.handleSignIn(e);
  }

  changeUserDetails(e) {
    this.setState({
      userDetailVisible: !this.state.userDetailVisible
    })

  }

  showDetails(e) {
    console.log(this.state.cognitoUser.username)
  }

  render() {

    const { isSignInVisible } = this.state;
    //  const { cognitoUser } = this.state;
    const { loggedIn } = this.state;
    const { userDetailVisible } = this.state;
    return (


      <div className="App">
        <UserDetails visible={this.state.userDetailVisible} hideDetails={this.hideUserDetails} cognitoUser={this.state.cognitoUser} username={this.state.username} phone={this.state.phone} emailId={this.state.email} nickname={this.state.nickname} />
         
        <Signin visible={isSignInVisible} updateCognitoUser={this.updateUser} updateUserStatus={this.updateStatus} />
        <div className="video-modal">
          <div className="video">
            <video width="800" height="500" controls>
              <source src="http://techslides.com/demos/sample-videos/small.mp4" type="video/mp4" />
            </video>
          </div> <div id="close-button">
            <i id="close-icon" className="fa fa-window-close" aria-hidden="true"></i></div>
        </div>
        <header>

          <div className="logo">
            <img id="olympic_rings" src={olympic_rings} alt="Olympics Logo" />
          </div>
          <nav>
            <ul>
              <li>Home</li>
              <li>Home</li>
              <li>Home</li>
              <li className={`${loggedIn ? '' : 'hidden'}`}>
              
                <button onClick={(e) => this.changeUserDetails(e)} >
                  Change details
                </button>

              </li>

              <li>
                <button onClick={(e) => this.handleSignInOrSignUp(e)}>
                  {`${this.state.loggedIn ? 'Sign-out' : 'Sign-in'}`}
                </button>
              </li>
            </ul>
          </nav>
          <div className="menu-toggle">
            <i className="fa fa-bars" aria-hidden="true"></i>
          </div>
        </header>

        <div className="content">
          <div className={`${this.state.userDetailVisible ? '' : 'hidden'}`}>
          </div>
          <h1>Sports</h1>
          <div className="channel">
            <h2>Archery</h2>
            <div className="videos">
              <div className="row">
                <div className="col">
                  <div className="video-group">
                    <div className="thumbnail">
                      <img className="overlay-image" src={overlay} alt="" />
                    </div>
                    <div className="description">
                      Title
                    </div>
                  </div>

                </div>
                <div className="col">
                  <div className="video-group">
                    <div className="thumbnail">
                      <div className="overlay"></div>
                    </div>
                    <div className="description">
                      Title
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="video-group">
                    <div className="thumbnail">
                      <div className="overlay"></div>
                    </div>
                    <div className="description">
                      Title
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
