import './App.css';
import React from 'react';
import {Modal, ModalBody, FormGroup, Input, Label, Button, Row, Col} from 'reactstrap';
import axios from 'axios';
import Select from 'react-select';
import {validString} from './rgx/regex'
import Classes from './enum/classes';
import Categories from './enum/categories';
import Sources from './enum/sources';

class WordModal extends React.Component {

    constructor(props){
        super(props);
        
        this.categoriesOptions = Categories.values();
        this.sourceOptions = Sources.values();
        this.classOptions = Classes.values();

       
        if(this.props.editModal){

            let categories = [];
            if(this.props.wordData && this.props.wordData.categories){
                this.props.wordData.categories.forEach(cat => {
                    categories.push({value: cat, label: Categories.getName(cat)})
                });
            }

            if(this.props.wordData)
            {
                this.state= {
                  // "translated" = langue pivot, ici le français
                  fieldError: false,
                    
                  word: this.props.wordData ? this.props.wordData.word : undefined,
                  class: this.props.wordData.class ? {value: this.props.wordData.class, label: Classes.getName(this.props.wordData.class)} : undefined,
                  definition: this.props.wordData ? this.props.wordData.definition : undefined, 
                  translated_word: this.props.wordData ? this.props.wordData.translated_word : undefined,
                  translated_definition: this.props.wordData ? this.props.wordData.translated_definition : undefined,
                  level: this.props.wordData.level ? this.props.wordData.level : '1',
                  categories,
                  source: this.props.wordData.source ? {value: this.props.wordData.source, label: Sources.getName(this.props.wordData.source)} : {},
                    
                    
                  story: this.props.wordData.additionalData ? this.props.wordData.additionalData.story : undefined, // Anecdotes
                  riddle: this.props.wordData.additionalData ? this.props.wordData.additionalData.riddle : undefined, // Devinette en niçois
                  translated_riddle: this.props.wordData.additionalData ? this.props.wordData.additionalData.translated_riddle : undefined, // Devinette en français
                  sentence: this.props.wordData.additionalData ? this.props.wordData.additionalData.sentence : undefined, // Mot en contexte dans une phrase
                }
                
            }
            else {
                this.state = {
                    level: '1', 
                    source: 0
                };
            }
            //console.log(this.state)
        }
        else {
            this.state = {
                level: '1', 
                source: 0
            };
        }


        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);

        this.update = this.update.bind(this);
        this.type = this.props.addModal ? 'addModal' : 'editModal';
    }

    handleChange = (event) =>{
        const {name, value} = event.currentTarget;

        if(name !== 'level' && validString.test(value[value.length - 1])){
            this.setState({ [name] : value });
            // Si la chaîne de caractères contient des chiffres, ne pas enregistrer
        }
        else  this.setState({ [name] : null });

        if(name === 'level'){  this.setState({ [name] : value });  }   
        
    }

    handleSelectChange = (param, e) =>{
        this.setState({ [param] : e });
    }

    isValid(){
        if(!this.state.word) return false;
        else return true;
    }

    getData(){
        
        const save = {
            word_id: this.props.wordData ?  this.props.wordData._id : null,
            word:{
                word: this.state.word,
                class: this.state.class ? this.state.class.value : null,
                definition: this.state.definition ? this.state.definition : null,
                translated_definition: this.state.translated_definition ? this.state.translated_definition : null,
                level: this.state.level,
                source: this.state.source ? this.state.source.value : null,
                categories: this.state.categories ? this.state.categories.map(category => category.value) : null
            },
            additionalData:{
                sentence: this.state.sentence ? this.state.sentence : null,
                riddle: this.state.riddle ? this.state.riddle : null,
                translated_riddle: this.state.translated_riddle ? this.state.translated_riddle : null, 
                story: this.state.story ? this.state.story : null,
            },
            userId: this.props.userId
        }
        
        //console.log(save)
        return save;
    }
    
    update(){
        if(!this.isValid()) return; 

        const save = this.getData();
        axios.post(
            'http://217.160.48.167/api/save/updateWord', 
            save, 
            { headers: { 'Authorization': this.props.token }  }
        )
        .then( () => {  this.props.swapModal();  })
        .catch(function (error) {console.log(error);});     
    }

    save = (next) =>{  
        if(this.isValid() === false) return; 
        
        const save = this.getData();
        axios.post(
            'http://217.160.48.167/api/save/word/', 
            save, 
            { headers: { 'Authorization': this.props.token } },
        )
        .then( () => {

            if(next)
                this.props.reloadModal();
            else 
                this.props.swapModal();
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return (
            <Modal isOpen={true} size='lg' style={{ overflowY: 'auto'}}>
                <ModalBody className=''>
                   <Row className='border-bottom pb-3'>
                        <Col md='10'>
                            <h4>
                                {this.props.addModal && 'Ajouter un mot'} 
                                {this.props.editModal && 'Modifier un mot'}                             
                            </h4>
                    
                        </Col>
                        <Col className='text-right ml-auto'>
                            <button onClick={this.props.swapModal && this.props.swapModal.bind(this, this.type)} type="button" className="btn btn-outline-secondary text-right ml-auto">X</button>
                        </Col>                        
                    </Row>
                        <FormGroup className='mx-2'>
                            <Label className='text-left mr-4' for="word">
                                Mot (en niçois)*:
                            </Label>
                            <Input
                                id="word"
                                data-testid="word" 
                                name="word" 
                                value={this.state.word}
                                onChange={this.handleChange}
                                required
                            />

                            <Label className='text-left' for="class">
                                Classe:
                            </Label>
                            <Select
                                id="class"
                                data-testid="class" 
                                name="class"
                                value={this.state.class}
                                onChange={this.handleSelectChange.bind(this, 'class')} 
                                options={this.classOptions}  
                                placeholder=""/>

                        </FormGroup>
                        <FormGroup className='mx-2'>
                        </FormGroup>
                        <FormGroup className='mx-2 mb-3'>
                            <Label className='text-left' for="definition">
                                Définition (en français):
                            </Label>                  
                            <Input
                                id="translated_definition"
                                data-testid="translated_definition" 
                                name="translated_definition"
                                value={this.state.translated_definition}
                                onChange={this.handleChange}  
                                type='textarea'
                                required                              
                            />
                        </FormGroup>
                        <FormGroup className='mx-2 mb-3'>
                            <Label className='text-left' for="definition">
                                Définition (en niçois):
                            </Label>                  
                            <Input
                                id="definition"
                                data-testid="definition" 
                                name="definition"
                                value={this.state.definition}
                                onChange={this.handleChange}
                                type='textarea'
                                required                            
                            />
                        </FormGroup>
                        <FormGroup className='mx-2'>
                            <Label className='text-left' for="riddle">
                                Devinette (pour le mot-croisé) en niçois:
                            </Label>
                            <Input
                                id="riddle"
                                data-testid="riddle" 
                                name="riddle"
                                value={this.state.riddle}
                                onChange={this.handleChange}   
                                type='textarea'                             
                            />
                        </FormGroup>
                        <FormGroup className='mx-2'>
                            <Label className='text-left' for="riddle">
                                Devinette (pour le mot-croisé) en français:
                            </Label>
                            <Input
                                id="translated_riddle"
                                data-testid="translated_riddle" 
                                name="translated_riddle"
                                value={this.state.translated_riddle}
                                onChange={this.handleChange}
                                type='textarea'
                            />
                        </FormGroup>
                        <FormGroup className='mx-2'>
                            <Label className='text-left' for="story">
                                Anecdote(s):
                            </Label>                        
                            <Input
                                id="story"
                                data-testid="story" 
                                name="story"
                                value={this.state.story}
                                onChange={this.handleChange}
                                type='textarea'
                            />                         
                        </FormGroup>
                        <FormGroup className='mx-2'>
                            <Label className='text-left' for="sentence">
                                Mot en contexte dans une phrase:
                            </Label>                  
                            <Input
                                id="sentence"
                                data-testid="sentence" 
                                name="sentence"
                                value={this.state.sentence}
                                onChange={this.handleChange}                                
                            />
                        </FormGroup>
                        <FormGroup className='mx-2'>
                            <Label className='text-left' for="level">
                                Niveau de langage:
                            </Label>                  
                            <Input
                                id="level"
                                data-testid="level" 
                                name="level"
                                type="select" 
                                value={this.state.level}
                                onChange={this.handleChange} 
                                className="ml-1"
                            >                                   
                                <option value={1}>
                                  1 
                                </option>
                                <option value={2}>
                                  2 
                                </option>
                                <option value={3}>
                                  3 
                                </option>
                            </Input>
                        </FormGroup>
                        <FormGroup className='mx-2'>
                            <Label className='text-left' for="categories">
                                Catégorie(s):
                            </Label>      
                            <Select 
                                id="categories"
                                data-testid="categories" 
                                name="categories"
                                isMulti
                                value={this.state.categories}
                                onChange={this.handleSelectChange.bind(this, 'categories')} 
                                options={this.categoriesOptions}
                                placeholder=""/>
                        </FormGroup>                                       
                        <FormGroup className='mx-2'>
                            <Label className='text-left' for="source">
                                Source:
                            </Label>                  
                            <Select 
                                id="source"
                                data-testid="source" 
                                name="source"
                                value={this.state.source}
                                onChange={this.handleSelectChange.bind(this, 'source')} 
                                options={this.sourceOptions}  
                                placeholder=""/>
                        </FormGroup>

                    <Col className='text-right mt-4'>
                        {this.props.addModal &&
                            <>
                                <Button onClick={this.props.swapModal && this.props.swapModal.bind(this, this.type)}>
                                    Quitter
                                </Button>
                                {' '}
                                <Button onClick={this.save.bind(this, false)} className='bg-success'>
                                    Ajouter
                                </Button>    
                                {' '}
                                <Button onClick={this.save.bind(this, true)} className='bg-success'>
                                    Ajouter et continuer
                                </Button>   
                            </>
                        }

                        {this.props.editModal &&
                            <Col className='text-right'>
                                <Button onClick={this.update} className='bg-success'>
                                    Modifier
                                </Button>
                            </Col>
                        }                    
                    </Col>                          
                </ModalBody>
            </Modal>                
       
        );
    }

}

export default WordModal;