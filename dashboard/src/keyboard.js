import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from 'reactstrap';

class Keyboard extends React.Component {

    constructor(){
        super();

        const allSpecialCharacters = 'ÁÀÇÉÈÍÌÓÒÚÙùúòóìíèéçàá';
        this.specialCharacters = [];
        for (let index = 0; index < allSpecialCharacters.length; index++) {      
            this.specialCharacters.push(allSpecialCharacters[index])
        }
    }

    render() {        
        return (
            <div>
                {this.specialCharacters.map(c => 
                    <Button onClick={this.addSpecialCharacterToCase.bind(this, c)}>{c}</Button>    
                )}
            </div>
        );
    }
}

export default Keyboard;