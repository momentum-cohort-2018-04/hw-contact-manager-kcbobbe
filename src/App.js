import React, { Component } from 'react';
import './App.css';
import request from 'superagent'
import 'shoelace-css/dist/shoelace.css'
/* global localStorage */

class App extends Component {
  constructor() {
    super()
    this.state = {
      contacts: [],
      username: null,
      password: null,
      loggedOut: true
    }
  }
    render() {
      return (
        <div>
        {this.state.loggedOut && 
        <div className = "App">
          <div className = "input-field">
            <label>Username: </label>
            <input type='text' onChange = {this.username.bind(this)}/>
          </div>

          <div className="input-field">
            <label>Password: </label>
            <input type="password" onChange = {this.password.bind(this)}/>
          </div>   
                
          <button type="button" className="button" onClick = {this.showContacts.bind(this)}>Submit!</button>
        </div>
        }
        {/* put in else statement */}
          <div>
          <button type="button" className="button" onClick = {this.newContact.bind(this)}>New Contact!</button>
            {this.state.contacts.map(function(contact){
              return <Contacts contactData = {contact} />
              
            })}
           
          </div>
        </div>

      )}
  // componentDidMount () {
  //   request.get('http://localhost:8000/contacts')
  //   .auth(this.state.username,this.state.password)
  //   .then((res) => {
  //     console.log(res.body)
  //   })
  //   .then((contacts) => {
  //     return contacts
  //   })
  //   .then((contacts) => {
  //     this.setState({
  //       contacts: contacts
  //     })
  //   })
  // }

  showContacts () {
    request.get('http://localhost:8000/contacts')
    .auth(this.state.username,this.state.password)
    .then((res) => {
      console.log(res.body[0].id)
      console.log("LOGGED IN")
      this.setState({loggedOut:false})
      this.setState({contacts : res.body})
      console.log(this.state.loggedIn)
    })
  
    .then((contacts) => {
      return contacts
      // e
    })

    }
  
  
  newContact () {
    request.post('http://localhost:8000/contacts')
    .auth(this.state.username,this.state.password)
    .send({
      "id" : 4,
      "name" : "Sarah",
      "city": "Chapel Hill"
    })
    .then((res)=> {
      this.showContacts()
    })
  }

  username(event) {
    this.setState({
      username: event.target.value
    })
    localStorage.username = event.target.value
  }

  password(event){
    this.setState({
      password: event.target.value
    })
    localStorage.password = event.target.value
  }

  componentDidMount () {
    this.setState({
      username: localStorage.username,
      password: localStorage.password})
      console.log("logged in")
    
  }

}

class ContactContainer extends Component {
  constructor() {
    super()
  }
  componentDidMount(){
    
  }
}

class Contacts extends Component {
  constructor() {
    super()
    this.state = {
      contacts: [],
    }
  }
  render() {
    return (
      <div>
        <div>{this.props.contactData.id}</div>
        <div>{this.props.contactData.name}</div>
        <div>{this.props.contactData.city}</div>
        <button type="button" className="button">Edit</button>
        <button type="button" className="button">Delete</button>
      </div>
    )
  }
}
export default App;
