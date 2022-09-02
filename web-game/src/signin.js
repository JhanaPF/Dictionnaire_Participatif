import './App.css';
import React from 'react';
import moment from 'moment';
import 'moment/locale/oc-lnc';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Form, FormGroup, Input, Label, Button, Row, Col} from 'reactstrap';
import axios from 'axios';

class SignIn extends React.Component {

    constructor(){
        super();

        this.state={
            date:'',
            email: '',
            password: '',
            loggedin: false
        }   

        this.handleChange = this.handleChange.bind(this);
        this.signIn = this.signIn.bind(this);
    }

    componentDidMount(){
      this.clock = setInterval(() => this.setState({ date: moment().locale('oc-lnc').format('MMMM Do YYYY, h:mm:ss a') }), 1000);
    }


    handleChange = (event) =>{
      const {name, value} = event.currentTarget;
    //  console.log(name, value)
      this.setState({ [name] : value });
    }

    signIn(){
        axios.post('http://localhost:3001/api/auth/signin', { mail: this.state.email, password: this.state.password })
        .then(res => { 
            this.setState({token : res.data.token, loggedin: true});

        //    console.log(res);
        })
        .catch(error => console.log(error))
    }

    componentDidUpdate(){
    //  console.log(this.state.token)
    }

    render() {

        
        return (
            <div className="App">
                    <Col md='6' className='m-auto mt-4'>
                        <Form >
                            <FormGroup >
                              <Label className='text-left' for=" Email">
                                Mail :
                              </Label>                  
                              <Input
                                id="Email"
                                name="email"
                                placeholder="Mail"
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                              />
                            </FormGroup>
                            {' '}
                            <FormGroup >
                              <Label className='text-left' for="Password">
                                Mot de passe :
                              </Label>                  
                              <Input
                                id=" Password"
                                name="password"
                                placeholder="Password"
                                type="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                              />
                            </FormGroup>
                            {' '}
                            <Button onClick={this.signIn}>
                              Submit
                            </Button>
                        </Form>
                    </Col>              
            </div>
        );
    }

}

export default SignIn;