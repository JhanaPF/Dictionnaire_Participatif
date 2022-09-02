import './App.css';
import React from 'react';
import {Col, Row, Button} from 'reactstrap';
import 'moment/locale/oc-lnc';
import 'bootstrap/dist/css/bootstrap.min.css';
import Crossword from '@jaredreisinger/react-crossword';

class App extends React.Component {

    constructor(){
        super();
        
        this.state={ 
            data: {
                across : {
                    1: { clue: 'This', answer: 'XXX', row: 0, col: 0 },
                    4: { clue: 'is', answer: 'XXX', row: 0, col: 4 },
                },
                down : {
                    1: { clue: 'This', answer: 'XXX', row: 0, col: 0 },
                    4: { clue: 'is', answer: 'XXX', row: 0, col: 4 },
                }
            }
        }
        
        this.crosswordRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.data = null;
        this.showAnswers = this.showAnswers.bind(this);
        this.virtualGrid = {};
        
        const allSpecialCharacters = 'ÁÀÇÉÈÍÌÓÒÚÙùúòóìíèéçàá';
        this.specialCharacters = [];
        for (let index = 0; index < allSpecialCharacters.length; index++) {      
            this.specialCharacters.push(allSpecialCharacters[index])
        }
    }   

    componentDidMount(){
       this.generateGrid();
       // this.clock = setInterval(() => this.setState({ date: moment().locale('oc-lnc').format('MMMM Do YYYY, h:mm:ss a') }), 1000);
    }


    handleChange = (event) =>{
        const {name, value} = event.currentTarget;
        //  console.log(name, value)
        this.setState({ [name] : value });
    }
    

    componentDidUpdate(){
       //console.log(this.state);
    }

    showAnswers(){
        this.crosswordRef.current.fillAllAnswers();
    }

    setVirtualGrid = (gridDimensions) => {
        for (let horizontalIndex = 0; horizontalIndex < gridDimensions.x; horizontalIndex++) {
            this.virtualGrid[horizontalIndex] = {};
            for (let verticalIndex = 0; verticalIndex < gridDimensions.y; verticalIndex++) {
                this.virtualGrid[horizontalIndex][verticalIndex] = '#';      
            }
        }
      //  console.log('Génération grille virtuelle : ', this.virtualGrid)
    }

    addWordToVirtualGrid = (x, y, dir, word) => {
        //   console.log(x,y, dir, word)

        // this.virtualGrid[row][column], row = y, col = x

        for (let index = 0; index < word.length; index++) { // Boucle chaque lettre du nouevau mot
            if(dir === 'across') // Horizontale
            {              
                this.virtualGrid[y][x + index] = word[index];
            }
            if(dir === "down") // Verticale
            {
                this.virtualGrid[y + index][x] = word[index];
            }
        }

        // console.log(word, "ajouté,  grille virtuelle = ",this.virtualGrid);
    }


    isWordOverlappingToVirtualGrid = (startCol, startRow, dir, word, correspondingIndex, wordToCompare ) => {
        // this.virtualGris[row][column], row = y, col = x
        //   console.log("isWordOverlappingToVirtualGrid()", startCol,startRow , dir, word)
        let overlap = false;

        for (let index = 0; index < word.length + 1; index++) { // Boucle chaque lettre du mot pour tester la position
            let xPos = startCol, yPos = startRow;
            
            if(dir === "across") xPos = startCol + index; 
            else yPos = startRow + index; 

            const testPosition = this.virtualGrid[yPos][xPos]; // Position à tester sur la grille
            if(index === word.length + 1){  
                if(testPosition !== "#") {  // Si la dernière case après la derniere lettre n'est pas vide (#), alors le mot est en conflit
                   // console.log(testPosition)
                    overlap = true;
                }                
                break;
            }

            

            const letter = word.slice(index, index + 1);
            let posToIgnore =  false;
           // const isPositionEmpty = testPosition !== word[index] ? true : false;
            
            if(testPosition === "#") posToIgnore = true;
            if(letter === testPosition) posToIgnore = true;
            if(correspondingIndex === index) posToIgnore = true;            
            //   console.log(posToIgnore, testPosition, letter, testPosition === "#", letter === testPosition)

            if(posToIgnore) continue;
            if(!posToIgnore){
                overlap = true;
                //   console.log("chevauchement : ", word, '/', wordToCompare.answer, "lettre: ", letter, '/', testPosition);
                break;
            }
        }
        //console.log(overlap)
        return overlap;
    }

    generateGrid (words) {
        // Structure objet des correpondances

        // Résultat attendu pour les correspondances :
        // matches = {
        //     Bonjour: [
        //         {'Excusez-moi': {'e':0, 's': 0 },
        //         {'Escalader': {total: 1, correspondings: {'e':0, 's': 0 }}},
        //     ]
        // }

        words = [
            "chaise",
            "PATATE",
            "BOUTEILLE",
            "ESCALADER",
        "BONJOUR"  
        ];
        
        words = words.map(l => l.toUpperCase());
        console.log(words)

        // --------------------------------------------------
        // ---------- Obtenir toutes les correspondances -------------
        // ---------------------------------------------------

        let matches = {};
        words.forEach(word => { // Boucle chaque mot
            matches[word] = {};

            words.forEach(wordToCompare => { // Reboucle tous les mots
                if(word !== wordToCompare){
                    let wordMatches = {};
                    for (let letter = 0; letter < word.length; letter++) {  // Boucle chaque caractère du mot                      
                        // Pour comparer chaque caractère et établir les correspondances
                        for (let index = 0; index < wordToCompare.length; index++) {   
                            if(word[letter] === wordToCompare[index]){
                               // console.log('hey', word[letter], wordToCompare[index])
                               //let correspondingLetter =  wordToCompare[index];
                               if(wordMatches[wordToCompare[index]])
                                wordMatches[wordToCompare[index]]++;
                               else
                                wordMatches[wordToCompare[index]] = 1;
                            }                            
                        }
                    }
                   // console.log(wordMatches)
                    matches[word][wordToCompare] = {...wordMatches};
                }            

            });                            

        });

        console.log(matches);

        // ------------------------------------------------------
        // ------------  Positionner les mots  ----------------------
        // -------------------------------------------------------


        const gridDimensions = {x:50, y:50};
        const firstWordPos = {x:5, y:7 };
        let direction = 0; // 0: horizontale/across (x), 1: verticale/down (y)
        let crossWordsWords = [];

        this.setVirtualGrid(gridDimensions);


        /**
        
            Ordre 
            1 . Tous les mots qui seront dans la grille
            2 . Toutes les lettres correspondantes pour le mot itéré 
        
        */

        for (let index = 0; index < words.length; index++) { // Boucler tous les mots pour établir les positions 
            const currentWord = words[index];
            // console.log(currentWord, previousWord);

            let newWord = {
                clue: 'Devinette',
                answer: currentWord,
                direction: 'across'
            };

            if(index === 0){
                newWord.col = firstWordPos.x;
                newWord.row = firstWordPos.y;

                crossWordsWords.push(newWord);
                this.addWordToVirtualGrid(
                    newWord.col, 
                    newWord.row, 
                    newWord.direction, 
                    newWord.answer
                );
            }
            else
            {
                direction = !direction; // A chaque changement de mot on change l'orientation

                newWord.direction = direction ? 'down' : 'across';
                let wordToCompareIndex = 0; // On commence avec le mot précédent
                let wordToCompare = crossWordsWords[wordToCompareIndex].answer;

                let correspondings = matches[currentWord][wordToCompare]; // Lettres correspondantes entre les deux mots
                let tryAnotherWord = false;
                // console.log(correspondings);

                let isOverlapping = false;
                let stop = false;
                
              //  console.log(correspondings, currentWord, wordToCompare) 

                // Tester les collisions 

                for (let i = 0; i < Object.keys(correspondings).length; i++) { 
                    /*
                        Boucle toutes les lettres correpondantes avec le mot à placer
                        pour trouver une position sans collision
                    */

                    if(tryAnotherWord){
                        tryAnotherWord = false;
                        i = 0;  
                        if(wordToCompareIndex === 0) { 
                            console.log("aucun mot n'offre de possibilité de placement");
                            break;
                        }
                        wordToCompareIndex--
                        wordToCompare = crossWordsWords[wordToCompareIndex].answer;
                        correspondings = matches[currentWord][wordToCompare];  
                        continue;                       
                    }

                    if(!stop){

                        const getCorrespondingLetter = [Object.keys(correspondings)[i]]; // Retourne  lettre correspondante                         
                        // Maintenant qu'on a la lettre correspondante, calculer la position de cette lettre sur le
                        // tableau, calculer le décalage pour établir la direction
                        const currentWordCorrespondingIndex = currentWord.indexOf([getCorrespondingLetter]);
                        let wordToCompareCorrespondingIndex;
                     
                        // Chaque lettre correspondante peut être présente plusieurs fois dans le mot, il faut donc réitérer
                        for (let correspondingLetterIndex = 0; correspondingLetterIndex < Object.keys(correspondings)[i].length && !stop; correspondingLetterIndex++) {
                            
                            wordToCompareCorrespondingIndex = wordToCompare.indexOf([getCorrespondingLetter], correspondingLetterIndex);    
                            
                            // Placer le mot au même emplacement que celui que l'on compare puis le décaler pour le positionner sur la bonne lettre
                            if(direction){
                                newWord.row = crossWordsWords[wordToCompareIndex].row - currentWordCorrespondingIndex;
                                newWord.col = crossWordsWords[wordToCompareIndex].col + wordToCompareCorrespondingIndex;
                            }
                            else
                            {
                               newWord.row = crossWordsWords[wordToCompareIndex].row + wordToCompareCorrespondingIndex;
                               newWord.col = crossWordsWords[wordToCompareIndex].col - currentWordCorrespondingIndex;
                            }          

                            const wordToCompareData = {
                                ...crossWordsWords[wordToCompareIndex], 
                                correspondingIndex: wordToCompareCorrespondingIndex
                            };

                            // Si le mot percute un autre mot et que les deux lettres ne correspondent pas chercher une autre position 
                            isOverlapping = this.isWordOverlappingToVirtualGrid(
                                newWord.col, 
                                newWord.row, 
                                newWord.direction, 
                                newWord.answer, 
                                currentWordCorrespondingIndex,
                                wordToCompareData, 
                            );
                            //  console.log(isOverlapping)

                            if(!isOverlapping){
                                stop = true;
                                crossWordsWords.push(newWord);
                                this.addWordToVirtualGrid(
                                    newWord.col,
                                    newWord.row,
                                    newWord.direction,
                                    newWord.answer
                                );
                            }
                        }

                        
                        //  console.log( correspondings,  getCorrespondingLetter,    "mot actuel : ", currentWord,     currentWordCorrespondingIndex,     "mot précédent : ", wordToCompare,    wordToCompareCorrespondingIndex );
                        // console.log(crossWordsWords[wordToCompareIndex].row, currentWordCorrespondingIndex, crossWordsWords[wordToCompareIndex].col, wordToCompareCorrespondingIndex);

                        if( (i === Object.keys(correspondings).length - 1)){
                            // Toutes les possibilités entre les deux mot ont été épuisés / Dernière itération de la boucle
                            i= 0; // Relancer la boucle
                            tryAnotherWord = true; // Condition qui changera l'index du mot
                        }               

                    }
                }
            }
   
        }

        //console.log("grille virtuelle = ", this.virtualGrid);

        // --------------------------------------------------------------------
        // ----------------  Trier les mots en fonction de leur direction (pour React-Crossword) ------------------------
        // --------------------------------------------------------------------

        let across = {}, down = {};
        for (let index = 0; index < crossWordsWords.length; index++) {
            if(crossWordsWords[index].direction === 'across'){
                across[index] = crossWordsWords[index];
            }
            if(crossWordsWords[index].direction === 'down'){
                down[index] = crossWordsWords[index];  
            }
        }

       // const debugTabs = crossWordsWords.map(word => (
       //     {name: word.answer, row: word.row, col: word.col }
       // ))

        //console.log("Positions des mots sur la grille : ", debugTabs);


        // Ajout des mots dans l'état local pour que le composant Crossword puisse les lire

        this.setState({
            data: {
                across: {...across},
                down: {...down}
            }
        });        
    }

    generateNewGrid(){
        this.generateGrid();
    }

    isCrosswordCorrect(){
        return this.crosswordRef.current.isCrosswordCorrect();
    }

    crosswordIsCorrect(){
        console.log("Mot-croisé complété !")
    }

    resetCrossword(){
        this.crosswordRef.current.reset();
    }

    addSpecialCharacterToCase (character) {

    }

    wordCorrect(){console.log('Mot correct')}


    render() {        
        return (
            <div className="App" style={{ display: 'flex' }} >
                <Row>
                    <Row className='w-100'>
                        <Col>
                            <Crossword 
                                ref={this.crosswordRef} 
                                columnBreakpoint={'3vh'} 
                                data={this.state.data}
                                acrossLabel="Ourizountal" 
                                downLabel="Vertical"
                                onCorrect={this.wordCorrect.bind(this)}
                                onCrosswordCorrect={this.crosswordIsCorrect.bind(this)} 
                                className='m-auto'
                                key={(key) => console.log(key)}
                                style={{height:'1800px', width: '2800px'}} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Button style={{height:'200px', width: '200px'}} onClick={this.showAnswers} >Révéler solution</Button>
                            <Button style={{height:'200px', width: '200px'}} onClick={this.resetCrossword.bind(this)}>Réinitialiser</Button>
                        </Col>
                        <Col className='mx-auto'>
                            {this.specialCharacters.map(c => 
                                <Button onClick={this.addSpecialCharacterToCase.bind(this, c)}>{c}</Button>    
                            )}
                        </Col>
                    </Row>
           
                </Row>
            </div>  
        );        
    }
}

export default App;