import React, { Component } from 'react';
import '../css/user-details.css'
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

class UserDetails extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            phone: '',
            nickname: '',
            email: ''
        }
    

    }


    changePhoneNumber(e) {
        var that = this;
        var attributeList = [];
        var attribute = {
            Name: 'phone_number',
            Value: this.phone.value
        };
     
        var attribute = new CognitoUserAttribute(attribute);
        attributeList.push(attribute);

        this.props.cognitoUser.updateAttributes(attributeList, function (err, result) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            that.setState({
                phone: that.phone.value
            })
           
        });

    }

    changeNickName(e) {
        var that = this;
        var attributeList = [];
        var attribute = {
            Name: 'nickname',
            Value: this.nickname.value
        };
        var attribute = new CognitoUserAttribute(attribute);
        attributeList.push(attribute);

        this.props.cognitoUser.updateAttributes(attributeList, function (err, result) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            that.setState({
                nickname: that.nickname.value
            })
        });

    }
    render() {

        return (
            <div className="User-details">
                <div className={`Userdetails-modal ${this.props.visible ? '' : 'hidden'}`} >

                    <div className="Userdetails-form">
                        <h1 className="heading">USER DETAILS</h1>
                        <div className="row">
                            <div className="col-md-3">
                                <span>User:</span>
                            </div>
                            <div className="col-md-3">
                                {this.props.username}
                            </div>
                            <div className="col-md-3"></div>
                            <div className="col-md-3"></div>
                        </div>

                        <div className="row">
                            <div className="col-md-3">Email:</div>
                            <div className="col-md-3">{this.props.emailId}</div>
                            <div className="col-md-3"></div>
                            <div className="col-md-3"></div>
                        </div>

                        <div className="row">
                            <div className="col-md-3">Nickname:</div>
                            <div className="col-md-3">{`${this.state.nickname ==='' ? this.props.nickname: this.state.nickname}`}</div>
                            <div className="col-md-3">                        
                                <input type="text" placeholder="nickname" ref={(input) => { this.nickname = input }} />
                            </div>
                            <div className="col-md-3">   
                                <button onClick={(e) => this.changeNickName(e)}>Change</button>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-3">Phone:</div>
                            <div className="col-md-3">{`${this.state.phone === '' ? this.props.phone:this.state.phone}`}</div>
                            <div className="col-md-3">                        
                                <input type="text" placeholder="phone" ref={(input) => { this.phone = input }} />
                            </div>
                            <div className="col-md-3">   
                             <button onClick={(e) => this.changePhoneNumber(e)}>Change</button>
                            </div>
                        </div>

                       
                        <button onClick={(e) => this.props.hideDetails()}>Confirm</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserDetails;
