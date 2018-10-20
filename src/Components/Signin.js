import React, { Component } from 'react';
import '../css/signin.css'
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';


var poolData = {
  UserPoolId: 'us-east-2_cbPCd8uJE',
  ClientId: '27l6iolk06vo2llg7ofplfcl4u'
};

var cognitoUser;

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.cognitoUser,
      isSignedIn: false,
      isSignUpFormVisible: false,
      isSignInFormVisible: true,
      isConfirmationVisible: false,

    }
  }

  toggleSignInModal() {

    this.setState({
      isSignedIn: !this.state.isSignedIn
    })
  }


  toggleSignUpForm(e) {

    this.setState({
      isSignInFormVisible: !this.state.isSignInFormVisible,
      isSignUpFormVisible: !this.state.isSignUpFormVisible,

    })
  }

  toggleConfirmation() {
    this.setState({
      isConfirmationVisible: !this.state.isConfirmationVisible
    })
  }

  showSignIn(e) {
    this.setState({
      isSignUpFormVisible: false,
      isSignInFormVisible: true
    })
  }


  render() {

    const { isSignedIn } = this.state;
    const { isSignInFormVisible } = this.state;
    const { isSignUpFormVisible } = this.state;
    const { isConfirmationVisible } = this.state;
    const { cogUser } = this.state;

    return (
      <div className={`App ${this.props.visible ? '' : 'hidden'}`}>

        <div className={`Signin-modal ${isSignedIn ? 'hidden' : ''}`} >

          <div className={`Signin-form ${isSignInFormVisible ? '' : 'hidden'}`}>
            <p className="heading">Sign in</p>

            <div className="divider"></div>

            <input type="text" placeholder="username" ref={(input) => { this.username = input }} />
            <input type="password" placeholder="password" ref={(input) => { this.password = input }} />
            <br />
            <button onClick={(e) => this.doLogin()}>Login</button>


            <button onClick={(e) => this.toggleSignUpForm(e)}>Sign up</button>
            {/* <button onClick={(e) => this.doSignOut(e)}>Sign out</button> */}
          </div>

          {/* Sign Up Form */}

          <div className={`Signup-form ${isSignUpFormVisible ? '' : 'hidden'}`}>
            <p className="heading">Sign up</p>

            <div className="divider"></div>
            <input type="text" placeholder="email" ref={(input) => { this.email2 = input }} />
            <input type="text" placeholder="username" ref={(input) => { this.username2 = input }} />
            <input type="text" placeholder="nickname" ref={(input) => { this.nickname2 = input }} />
            <input type="text" placeholder="phone" ref={(input) => { this.phone2 = input }} />
            <input type="password" placeholder="password" ref={(input) => { this.password2 = input }} />

            <button onClick={(e) => this.doRegister(e)}>Register</button>

            <button onClick={(e) => this.showSignIn(e)}>Sign in</button>

            <div className="divider"></div>

            <div className={`${isConfirmationVisible ? '' : 'hidden'}`}>
              <p className="heading">Confirmation Number</p>
              <p>Check your email for the confirmation code!</p>
              <p>
                <input type="text" id="code" placeholder="code" ref={(input) => { this.code = input }} />
                <button onClick={(e) => this.doConfirm(e)}>Confirm</button>
              </p>
              <div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  doLogin(event) {
    var that = this;
    var authenticationData = {
      Username: this.username.value,
      Password: this.password.value,
    };
    var authenticationDetails = new AuthenticationDetails(authenticationData);

    var userPool = new CognitoUserPool(poolData);
    var userData = {
      Username: this.username.value,
      Pool: userPool
    };
    cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        var accessToken = result.getAccessToken().getJwtToken();
        alert(that.username.value + " has logged in!");
        that.toggleSignInModal();
        //  console.log(result);
        //  that.props.updateUser('Swoyen');
        //console.log(cognitoUser.username)
        that.props.updateCognitoUser(cognitoUser);

        that.props.updateUserStatus(true);


      },

      onFailure: function (err) {
        alert(err.message || JSON.stringify(err));
      },

    });
    console.log(cognitoUser);

    // window.location.reload();
  }

  doConfirm(event) {
    var that = this;
    var userPool = new CognitoUserPool(poolData);
    var userData = {
      Username: this.username2.value,
      Pool: userPool
    };

    cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(this.code.value, true, function (err, result) {
      if (err) {
        alert(err.code || JSON.stringify(err));
        return;
      }
      // console.log('call result: ' + result);
      that.showSignIn();
    });
  }

  doRegister(event) {
    var that = this;

    var userPool = new CognitoUserPool(poolData);
    var email = this.email2.value;
    var username = this.username2.value;
    var phone = this.phone2.value;
    var password = this.password2.value;
    var nickname = this.nickname2.value;

    var attributeList = [];

    var dataEmail = {
      Name: 'email',
      Value: email
    }

    var dataPhoneNumber = {
      Name: 'phone_number',
      Value: phone
    }

    var dataNickname = {
      Name: 'nickname',
      Value: nickname
    }

    var attributeEmail = new CognitoUserAttribute(dataEmail);
    var attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
    var attributeNickName = new CognitoUserAttribute(dataNickname);

    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);
    attributeList.push(attributeNickName);

    // console.log(`Register User ${username} ${phone} ${email}`);

    userPool.signUp(username, password, attributeList, null, function (err, result) {
      if (err) {
        console.log(err.name);

        return;
      }
      else {
        cognitoUser = result.user;
        // console.log('user registered as ' + cognitoUser.getUsername());
        that.toggleConfirmation();
      }
    })

  }

  loadAuthenticatedUser() {
    var that = this;
    console.log("Loading Auth User");

    var userPool = new CognitoUserPool(poolData);
    cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          alert(err.message || JSON.stringify(err));
          return;
        }
        // console.log(session)
        // console.log('session validity: ' + session.isValid());

        var creds = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-east-2:f4bc0eae-2b71-4fa0-a9b1-8be3d7a38d9f', // your identity pool id here
          Logins: {
            'cognito-idp.us-east-2.amazonaws.com/us-east-2_cbPCd8uJE': session.getIdToken().getJwtToken()
          }
        }, {
            region: "us-east-2"
          });


        creds.refresh(function (err, data) {
          if (err) {
            console.log(err);
          }
          else {
            // console.log("HERE");
            // console.log(creds);

            var lambda = new AWS.Lambda({
              credentials: creds,
              region: "us-east-2"
            });

            var params = {
              FunctionName: 'test-function01',
              InvocationType: 'RequestResponse',
              Payload: ''
            };
            lambda.invoke(params, function (err, result) {
              if (err) {
                console.log(err, err.stack);
              }
              else {
                var payload = JSON.parse(result.Payload)
                var body = JSON.parse(payload.body)
                that.setState(body);
                // console.log(body);
              }
            })

          }
        });
      });
    }
  }

  doSignOut(event) {
    (cognitoUser.signOut());
    console.log("Signed off");
    window.location.reload();
  }

  componentDidMount() {
    this.loadAuthenticatedUser();

  }

}

export default Signin;
