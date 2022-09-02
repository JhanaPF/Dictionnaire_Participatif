import './App.css';
import moment from 'moment';
import 'moment/locale/oc-lnc';
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import {
    Modal,  ModalBody,    Button, 
    Row, Col, Card, CardBody, CardTitle,  CardText,
    Table, Collapse
} from 'reactstrap';
import axios from 'axios';
import Select from 'react-select';
import WordModal from './wordModal';
import blasonNice from './img/blasonNice';

import Classes from './enum/classes';
// import Categories from './enum/categories';
import Sources from './enum/sources';

class Dashboard extends React.Component {

    constructor(props){
        super(props);

        this.state={
            loading: true,
            date: null,

            words: [],
            addModal: false,
            editModal: false,
            deleteModal: false,
            selectedWord: undefined, 

            showNativeDefinition: false,
            showTranslatedWord: true,
        }

        this.handleChange = this.handleChange.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount(){
        this.onFetchDictionnary();
        this.clock = setInterval(() => this.setState({ date: moment().locale('oc-lnc').format('MMMM Do YYYY, H:mm') }), 60000);
    }

    componentDidUpdate(){
        //console.log(this.state)
        if(this.state.reloadEditModal) this.setState({editModal: true, reloadEditModal: false});
    }
    
    onFetchDictionnary(){
        axios.get('http://localhost:3001/api/fetch/fetchNissartDictionnary', {  headers: { 'Authorization': this.props.token } } )
        .then(res => {
           // console.log("dictionnaire", res.data.message)
            let setWords = [];
            let newDictionnary =  res.data.message.slice();
            newDictionnary.map(w => setWords.push({label: w.word, value:w._id}));

         
            if(this.state.selectedWordData) {
                console.log(this.state.selectedWordData)
                this.onFetchWord(this.state.selectedWordData._id);
            }

            this.setState({dictionnary : newDictionnary, words: setWords, loading: false});
        })
        .catch(error => console.log(error))        
    }

    onFetchWord(id){
        this.setState({loading: true});

        let word = this.state.dictionnary.find(w => w._id === id);
        axios.get(
            'http://localhost:3001/api/fetch/fetchOneWord/_id/' + id,
            {  headers: { 'Authorization': this.props.token } } 
        )
        .then(res => { 
            //console.log("Requête mot sélectionné = ", res.data.message)
            this.setState({ 
                selectedWordData: res.data.message, 
                loading: false,
                selectedWord: {value: word._id, label: word.word, definition: word.definition, translated_definition: word.translated_definition}, 
            });
        })
        .catch(error => console.log(error))
    }

    handleChange = (event) => {
        const {name, value} = event.currentTarget;
        // console.log(name, value)
       // if([name] === "")
        this.setState({ [name] : value });
    }

    swapModal = (name) =>{
       // console.log("swapModal")

        if(this.state[name]){   this.onFetchDictionnary();   }

        this.setState({[name]: !this.state[name]});
    }

    reloadModal = (name) =>{ 
        if(name === "addModal")
            this.setState({[name]: false, reloadEditModal: true});
    }

    delete(){
        axios.delete(
            'http://localhost:3001/api/save/deleteWord',              
            {
                headers: { "Authorization": this.props.token },
                data: { word_id: this.state.selectedWord.value }, // req.data = req.body dans le serveur
            },
        )
        .then( (res) => {
            //console.log(res)
            this.setState({deleteModal: false, selectedWord: null, selectedWordData: null}, this.onFetchDictionnary);
        })
        .catch(function (error) {console.log(error);});
    }

    selectWord(wordId){
        this.onFetchWord(wordId);
    }

    handleSelectChange = (param, e) =>{
        this.selectWord(e.value) 
    }

    render() {
        return (
            <div className="App">
                {this.state.date}

                <img class=""
                    src={blasonNice}
                    alt="Armoiries de Nice"></img>

                <Row md='6' className='m-auto mt-4 mx-5'>
                    <Col md='6'>
                        <Select     
                            className='mt-3'
                            placeholder="Rechercher un mot" 
                            options={this.state.words} 
                            noOptionsMessage={() => null}
                            value={this.state.selectedWord}
                            onChange={this.handleSelectChange.bind(this, 'selectedWord')}
                            />
                            {!this.state.loading &&
                            
                                <Table className='mt-2' style={{borderRadius:10 }} bordered hover responsive >
                                    <thead>
                                      <tr>
                                        <th>
                                          Mot
                                        </th>
                                        <th>
                                          Définition
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.dictionnary.map((wordData, i) => {
                                            return(
                                                <tr key={i} onClick={this.selectWord.bind(this, wordData._id)}>
                                                    <th scope="row">
                                                        {wordData.word}
                                                    </th>
                                                    <td>
                                                        {wordData.translated_definition}
                                                    </td>
                                                </tr>
                                            )
                                        })}
        
                                    </tbody>
                                </Table>    
                            }
                    </Col>
                    <Col md='6'>
                        <Collapse isOpen={this.state.selectedWordData}>
                        <Card color="warning" className='text-left my-3'>
                            <CardBody className='p-1'>
                                <CardTitle tag="h5">
                                    Détail du mot sélectionné
                                </CardTitle>  
                                <CardText className="p-2"> 
                                    <i onClick={this.swapModal.bind(this, "editModal")} 
                                        className="fas fa-edit position-absolute mr-3 fa-xl" style={{right: 15, top: 0}}/>
                                    <i onClick={this.swapModal.bind(this, 'deleteModal')} 
                                        className="fas fa-trash-alt fa-xl position-absolute mr-1" style={{right: 0, top: 0}}/>
                                    <span className="font-weight-bold">Mot : </span> {this.state.selectedWordData && this.state.selectedWordData.word}{', '}{this.state.selectedWordData && Classes.getName(this.state.selectedWordData.class)} <br/>
                                    <span className="font-weight-bold">Définition en français : </span> {this.state.selectedWordData && this.state.selectedWordData.translated_definition} <br></br>
                                    <span className="font-weight-bold">Définition en niçois : </span> {this.state.selectedWordData && this.state.selectedWordData.definition} <br></br>
                                    <span className="font-weight-bold">Niveau de langage : </span> {this.state.selectedWordData && this.state.selectedWordData.level} <br></br>
                                    <span className="font-weight-bold">Catégorie(s) : </span> {this.state.selectedWordData && this.state.selectedWordData.categories} <br></br>
                                    <span className="font-weight-bold">Source : </span> {this.state.selectedWordData && (this.state.selectedWordData.source !== null) && Sources.getName(this.state.selectedWordData.source)} <br></br>
                                    <span className="font-weight-bold">Devinette en niçois : </span> {this.state.selectedWordData && this.state.selectedWordData.additionalData.riddle} <br></br>
                                    <span className="font-weight-bold">Devinette en français : </span> {this.state.selectedWordData && this.state.selectedWordData.additionalData.translated_riddle} <br></br>
                                    <span className="font-weight-bold">Anecdotes : </span> {this.state.selectedWordData && this.state.selectedWordData.additionalData.story} <br></br>
                                    <span className="font-weight-bold">Mot en contexte : </span> {this.state.selectedWordData && this.state.selectedWordData.additionalData.sentence} <br></br>
                                </CardText>
                            </CardBody>
                        </Card>  
                        </Collapse>

                        <Col className='text-right'>
                            <Button className='text-right mt-1' onClick={this.swapModal.bind(this, "addModal")}>
                                Ajouter un mot 
                            </Button>          
                        </Col> 

                        <Col className='text-right'>
                            <Button disabled className='text-right mt-1'>
                                Jeu de mots croisés 
                            </Button>          
                        </Col> 
                    </Col>

                </Row>  



                {/********** MODALES ***********/}
                
                <Modal size='sm' isOpen={this.state.deleteModal} >   {/* Modale de confirmation de suppression */}             
                    <ModalBody>
                        <Col className='text-center'>
                            <Button onClick={this.swapModal.bind(this, "deleteModal")} >
                                Annuler
                            </Button>
                            {'  '}
                            <Button onClick={this.delete.bind(this)} color='danger'>
                                Supprimer
                            </Button>                       
                        </Col> 
                    </ModalBody>
                </Modal>

                {this.state.addModal &&
                    <WordModal
                        addModal
                        swapModal={this.swapModal.bind(this, "addModal")}
                        token={this.props.token}
                        reloadModal={this.reloadModal.bind(this, "addModal")}
                    />
                }  
                
                {this.state.editModal &&
                    <WordModal
                        editModal
                        wordData={this.state.selectedWordData}
                        swapModal={this.swapModal.bind(this, "editModal")}
                        token={this.props.token}
                        reloadModal={this.reloadModal.bind(this, "editModal")}
                    />
                }               

            </div>
        );
    }

}

export default Dashboard;