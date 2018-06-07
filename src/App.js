import React, { Component } from 'react';
import './App.css';
import request from 'superagent'
import 'shoelace-css/dist/shoelace.css'
import uuid from 'uuid/v4'

/* global localStorage */

class App extends Component {
  constructor () {
    super()
    this.state = {
      contacts: [],
      username: null,
      password: null,
      loggedOut: true,
      addContact: false,
      contactName: null,
      contactCity: null
    }
    // this.logout = this.logout.bind(this)
    console.log(this.state);
    // localStorage.loggedOut = 0
  }
  render() {
    return (
      <div>
    {
        this.state.loggedOut ?(
          <div>
          {/* <h1>logged out</h1> */}
          <div className = "App">
          <h1>THE CONTACT MANAGER</h1>
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
          </div>
        ) :
        this.state.addContact ?(
        <div>
          <h1>Add a Contact!</h1>
        <div className = "input-field">
          <label>Name</label>
          <input type = 'text' onChange = {this.contactName.bind(this)} />
        </div>
        <div className = "input-field">
          <label>City</label>
          <input type= 'text' onChange = {this.contactCity.bind(this)}/>
          <button type = "button" onClick = {this.newContact.bind(this)}>Submit!</button>
          <button type = "button" onClick = {this.cancelAdd.bind(this)}>Cancel</button>

        </div>
        </div>
      ) 
      
        : (
        <div>
          <div className = "input-field">
          <label>Search for Contacts</label>
          <input type = 'text'/>
        </div>
        <div className = "header">
        <button type = "button" className="button" onClick = {this.logout.bind(this)}>LOGOUT</button>
        <button type="button" className="button" onClick = {this.clickNewContact.bind(this)}>New Contact!</button>
        </div>
        
          {this.state.contacts.map(function(contact){
            return <Contacts contactData = {contact}
            // delete={this.deleteContact}
            />
            
          })}
          
        </div>
      )}
        {/*end else statement */}
      </div>

    )}
  // componentDidMount () {
  //   request.get('http://localhost:8000/contacts')
  //   . auth(this.state.username,this.state.password)
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
        console.log("LOGGED IN")
        this.setState({loggedOut:false})
        this.setState({contacts : res.body})
        console.log(this.state.loggedOut)
        localStorage.loggedOut = false
      })
  }

  clickNewContact () {
    this.setState({
      addContact: true
    })
  }

  contactName(event) {
    this.setState({
      contactName: event.target.value
    })
  }

  contactCity(event) {
    this.setState({
      contactCity: event.target.value
    })
  }

  newContact () {
    const newId = uuid()
    request.post('http://localhost:8000/contacts')
      .auth(this.state.username,this.state.password)
      .send({
        "id" : newId,
        "name" : this.state.contactName,
        "city": this.state.contactCity,
      })
      .then((res)=> {
        this.setState({
          addContact: false,
          contactName: 'null',
          contactCity: 'null'
        })
        this.setState({loggedOut:false})

        this.showContacts()
      })
  }

  cancelAdd() {
    this.setState({
      addContact: false
    })
  }
  // deleteContact(){
  //   request.delete('http://localhost:8000/contacts/4')
  //   .auth(this.state.username,this.state.password)
  //   .then((res)=> {
  //     this.showContacts()
  //   })
  //   } 

  username (event) {
    this.setState({
      username: event.target.value
    })
    localStorage.username = event.target.value
  }

  password (event) {
    this.setState({
      password: event.target.value
    })
    localStorage.password = event.target.value
  }

  logout (event) {
    this.setState({
      loggedOut: true,
      username:null,
      password:null
    })
    localStorage.loggedOut = true
    localStorage.username = null
    localStorage.password = null
    console.log(this.state) 
  }

  componentDidMount () {
    request.get('http://localhost:8000/contacts')
      .auth(localStorage.username,localStorage.password)
      .then((res) => {
      this.setState({loggedOut:false})
        this.setState({contacts : res.body})
        console.log(this.state.loggedOut)
      })
      .catch((err)=> {
        if (err.status === 401){
          localStorage.clear()
          
        }
      })

    this.setState({
      username: localStorage.username,
      password: localStorage.password
      // loggedOut: localStorage.loggedOut,
    })
    console.log("logged in")
  }
}

// class ContactContainer extends Component {
//   constructor() {
//     super()
//   }
//   componentDidMount(){
    
//   }
// }

class Contacts extends Component {
  constructor () {
    super()
    this.state = {
      contacts: [],
      editContact: false,
      editedName: 'null',
      editedCity: 'null'
    }
  }

  deleteContact () {
    const id = this.props.contactData.id
    request.delete('http://localhost:8000/contacts/'+id)
      .auth(localStorage.username,localStorage.password)
      .then((res)=> {
        console.log(this.state.contacts)
        // let deletedArray = this.state.contacts
        // deletedArray = deletedArray.filter(contact => contact !==id)

      })
  }

  clickEditContact () {
    this.setState({
      editContact : true
    })
  }

  editedName(event) {
    this.setState({
      editedName: event.target.value
    })
  }

  editedCity(event) {
    this.setState({
    editedCity: event.target.value
    })
  }
  

  editContact() {
    const id = this.props.contactData.id
    request.put('http://localhost:8000/contacts/'+id)
      .auth(localStorage.username,localStorage.password)
      .send({
        "name" : this.state.editedName,
        "city": this.state.editedCity})
      .then((res)=> {
       console.log('edited')
       this.setState({
          editContact:false,
          contactName:'null',
          contactCity:'null'
    })
    // this.showContacts()
  })
  }

  showContacts () {
    request.get('http://localhost:8000/contacts')
    .auth(localStorage.username,localStorage.password)
    .then((res) => {
      console.log(res.body[0].id)
      this.setState({contacts : res.body})
      console.log(this.state.contacts)
    })
  
    .then((contacts) => { 
      // e
    })

    }



  render() {
    return (
      <div className= "contact-list">
        {this.state.editContact ?(
          <div>
            <label>Name</label>
            <input type = 'text' onChange = {this.editedName.bind(this)} />
            <label>City</label>
            <input type= 'text' onChange = {this.editedCity.bind(this)}/>
            <button type = "button" onClick = {this.editContact.bind(this)}>Submit!</button>
          </div>       
         ) : (
        <div>
          <div><strong>{this.props.contactData.name}</strong></div>
          <div>{this.props.contactData.city}</div>
          <button type="button" className="button" onClick = {this.clickEditContact.bind(this)}>Edit</button>
          <button type="button" className="button" onClick={this.deleteContact.bind(this)}>Delete</button>
        </div>
        )}

      </div>
    )
  }


  
}
export default App;
