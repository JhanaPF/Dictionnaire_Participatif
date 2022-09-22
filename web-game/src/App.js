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
        this.virtualGridWithDirections = {};
        
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

    componentDidUpdate(){
      // console.log("UPdate component");
    }

    handleChange = (event) =>{
        const {name, value} = event.currentTarget;
        //  console.log(name, value)
        this.setState({ [name] : value });
    }    

    shuffleArray (array) { // Random array order
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    showAnswers(){
        this.crosswordRef.current.fillAllAnswers();
    }

    setVirtualGrid = (gridDimensions) => { // Virtual grid to test position
        for (let horizontalIndex = 0; horizontalIndex < gridDimensions.x; horizontalIndex++) {
            this.virtualGrid[horizontalIndex] = {};
            this.virtualGridWithDirections[horizontalIndex] = {};

            for (let verticalIndex = 0; verticalIndex < gridDimensions.y; verticalIndex++) {
                this.virtualGrid[horizontalIndex][verticalIndex] = '#';      
                this.virtualGridWithDirections[horizontalIndex][verticalIndex] = null;
            }
        }
      //  console.log('Génération grille virtuelle : ', this.virtualGrid)
    }

    addWordToVirtualGrid = (x, y, dir, word) => {
        //   console.log(x,y, dir, word)

        // this.virtualGrid[row][column], row = y, col = x

        for (let index = 0; index < word.length; index++) { // Boucle chaque lettre du nouevau mot
            if(dir === 'across'){ // Horizontale
                this.virtualGrid[y][x + index] = word[index];
                this.virtualGridWithDirections[y][x + index] = 'across';
            }
            if(dir === "down"){ // Verticale
                this.virtualGrid[y + index][x] = word[index];
                this.virtualGridWithDirections[y + index][x] = 'down';
            }
        }

        // console.log(word, "ajouté,  grille virtuelle = ",this.virtualGrid);
    }

    isWordOverlappingToVirtualGrid = (startCol, startRow, dir, word, correspondingIndex, wordToCompare ) => {
        // this.virtualGris[row][column], row = y, col = x
        //   console.log("isWordOverlappingToVirtualGrid()", startCol,startRow , dir, word)
        let overlap = false;
        let lateralLettersInSameDirection = 0;

        for (let index = 0; index <= word.length + 2 ; index++) { // Boucle chaque lettre
            // Boucle chaque lettre +la case après la dernière lettre de la possible position du mot pour tester si la case est vide
            let xPos = startCol, yPos = startRow;

            if(dir === "across") xPos = startCol + index; // Get pos
            else yPos = startRow + index;

           // console.log(yPos, xPos)
            const testPosition = this.virtualGrid[yPos][xPos]; // Position à tester sur la grille

           // if(index !== word.length) console.log(word[index], testPosition)
            if(index === word.length + 2){ // Si la dernière case après la dernière lettre n'est pas vide (#), alors le mot est en conflit
               // console.log('test dernière case: ', word, ' ', testPosition);

                if(testPosition !== "#") {
                    overlap = true;
                }
                break;
            }

            const letter = word.slice(index, index + 1);
            if(letter !== testPosition && index !== 0 && index <= word.length ){ // Autoriser seulement les mots latérals qui vont dans le même sens si ils sont à une case d'écart
                
                if(dir === "across"){ // Horizontale

                    const upPosFromTestPos = this.virtualGrid[yPos + 1][xPos ];
                    const downPosFromTestPos = this.virtualGrid[yPos - 1][xPos];
                    if(upPosFromTestPos !== "#") {  
                       
                        if(this.virtualGridWithDirections[yPos + 1][xPos] === "down"){
                           // console.log('Conflit latéral: ', word, ' ', testPosition);
                            overlap = true;
                            break;
                        }else lateralLettersInSameDirection++;
                    } 

                    if(downPosFromTestPos !== "#") {  
                        if(this.virtualGridWithDirections[yPos - 1][xPos] === "down"){
                           // console.log('Conflit latéral: ', word, ' ', testPosition);
                            overlap = true;
                            break;
                        }else lateralLettersInSameDirection++;
                    } 
                } 
                else { // Vertical/Down
                    const leftPosFromTestPos = this.virtualGrid[yPos][xPos - 1];    
                    const rightPosFromTestPos = this.virtualGrid[yPos][xPos + 1];
                    if(leftPosFromTestPos !== "#") {  
                        if(this.virtualGridWithDirections[yPos][xPos - 1] === "across"){
                           // console.log('Conflit latéral: ', word, ' ', testPosition);
                            overlap = true;
                            break;
                        } else lateralLettersInSameDirection++;
                    }

                    if(rightPosFromTestPos !== "#") {  
                        if(this.virtualGridWithDirections[yPos][xPos + 1] === "across"){
                          //  console.log('Conflit latéral: ', word, ' ', testPosition);
                            overlap = true;
                            break;
                        } else lateralLettersInSameDirection++;
                    }
                } 
            }
            
            let posToIgnore =  false;
            // const isPositionEmpty = testPosition !== word[index] ? true : false;
            
            if(testPosition === "#" || letter === testPosition || correspondingIndex === index) posToIgnore = true;            
            //console.log(posToIgnore, testPosition, letter, testPosition === "#", letter === testPosition)
            
            if(posToIgnore){                
                continue;
            }
            if(!posToIgnore){
                //console.log("chevauchement : ", word, '/', wordToCompare.answer, "lettre: ", letter, '/', testPosition);
                overlap = true;
                break;
            }
        }

        if(lateralLettersInSameDirection > 3) overlap = true;
        return overlap;
    }

    generateGrid () {

        this.crosswordRef.current.reset();

        // Structure objet des correpondances

        // Résultat attendu pour les correspondances :
        // matches = {
        //     Bonjour: [
        //         {'Excusez-moi': {'e':0, 's': 0} },
        //         {'Escalader': {'e':0, 's': 0 } },
        //     ],
        // }


        let fullWords = [
           // {answer: "Chaise", clue: "Permet de s'asseoir"},
           // {answer: "Arbre", clue: "Les oiseaux se posent dessus"},
           // {answer: "Avion", clue: "Traverse de grandes distances"},
           // {answer: "Télévision", clue: "Fenêtre sur le monde"},
           // {answer: "Montagne", clue: "Rocher de grande taille"},

            {answer: "Pluèia", clue: "Ça mouille"},
            {answer: "Gelada", clue: "C'est froid"},
            {answer: "Frucha", clue: "Se cueille aux branches"},
            {answer: "Trìfoula", clue: "Les chiens les déterrent"},
            {answer: "Bèca-flour", clue: "Oiseau qui vole en arrière"},

        ];

        let words = [];
        fullWords.forEach(w => { // Delete clues for grid algorithme 
            words.push(w.answer);
        });
        
        words = words.map(l => l.toUpperCase()); // Mettre tous les mots en majuscule

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

       // console.log('Liste des correspondances', matches);

        // ------------------------------------------------------
        // ------------  Positionner les mots  ----------------------
        // -------------------------------------------------------
       // console.log("%c" + " SET WORDS POSITIONS ", "color:" + "red" + " ;font-weight:bold;");

        const gridDimensions = {x: 500, y: 500};
        const firstPosGlobal = 20;
        const firstWordPos = { x: firstPosGlobal, y: firstPosGlobal };
        let direction = 0; // 0: horizontale/across (x), 1: verticale/down (y)
        let crossWordsWords = []; // Data complète pour le composant ReactCrossword

        this.setVirtualGrid(gridDimensions); // Virtual grid to test positions


        /**        
            Ordre des boucles
            1. Tous les mots qui seront dans la grille
            2. Tous les mots déjà présent sur la grille pour tester correspondances
            3. Toutes les lettres correspondantes pour le mot itéré
        */

       
       // Default placement for the first word
        let firstWord = {
            answer: words[0],
            direction: 'across', // Default position
            col : firstWordPos.x,
            row : firstWordPos.y,
            clue : fullWords.find(w =>  w.answer.toUpperCase() === words[0]).clue
        };

        crossWordsWords.push(firstWord);
        this.addWordToVirtualGrid(
            firstWord.col, 
            firstWord.row, 
            firstWord.direction, 
            firstWord.answer
        );
        // ---


        for (let index = 1; index < words.length; index++) { // Boucler tous les mots pour établir les positions 
            const currentWord = words[index];
            // console.log(currentWord, previousWord);

            let newWord = {
                clue: 'Devinette' + Math.random(10000),
                answer: currentWord,
                direction: 'across' // Default position
            };

            let tryAnotherWorld = true;
            this.shuffleArray(crossWordsWords);
            for(let wordToCompareIndex = 0; wordToCompareIndex <  crossWordsWords.length; wordToCompareIndex++){ // Loop each word on crossword grid until you find success
                let wordToCompare = crossWordsWords[wordToCompareIndex].answer;
                if(wordToCompare === currentWord || !tryAnotherWorld) continue;
            
                //console.log('Mot actuel et mot comparé : ', currentWord, wordToCompare)
            
                newWord.direction = crossWordsWords[wordToCompareIndex].direction === "across" ? "down" : "across"; // Sens inverse par rapport au mot comparé
                //console.log(newWord.direction, crossWordsWords[wordToCompareIndex].direction)
                direction = newWord.direction === "across" ? 0 : 1;           
                
                let correspondings = matches[currentWord][wordToCompare]; // Lettres correspondantes entre les deux mots
               // console.log(crossWordsWords, correspondings)
                for (let i = 0; i < Object.keys(correspondings).length; i++) {  // Boucle toutes les lettres correpondantes entre currentWord et wordToCompare
                    
                    if(tryAnotherWorld){
                    
                        const getCorrespondingLetter = [Object.keys(correspondings)[i]]; // Retourne  lettre correspondante                         
                        // Maintenant qu'on a la lettre correspondante, calculer la position de cette lettre sur le
                        // tableau, calculer le décalage pour établir la direction
                        const currentWordCorrespondingIndex = currentWord.indexOf([getCorrespondingLetter]);
                        let wordToCompareCorrespondingIndex;
                    
                        // Chaque lettre correspondante peut être présente plusieurs fois dans le mot, il faut donc réitérer
                        for (let correspondingLetterIndex = 0; correspondingLetterIndex < Object.keys(correspondings)[i].length && tryAnotherWorld; correspondingLetterIndex++) {
                        
                            wordToCompareCorrespondingIndex = wordToCompare.indexOf([getCorrespondingLetter], correspondingLetterIndex);    
                        
                            // Placer le mot au même emplacement que celui que l'on compare puis le décaler pour le positionner sur la bonne lettre
                            if(direction){ // Across the way
                                newWord.row = crossWordsWords[wordToCompareIndex].row - currentWordCorrespondingIndex;
                                newWord.col = crossWordsWords[wordToCompareIndex].col + wordToCompareCorrespondingIndex;
                            }
                            else{ // Down the way
                               newWord.row = crossWordsWords[wordToCompareIndex].row + wordToCompareCorrespondingIndex;
                               newWord.col = crossWordsWords[wordToCompareIndex].col - currentWordCorrespondingIndex;
                            }          
                        
                            // Tester position
                            let isOverlapping = this.isWordOverlappingToVirtualGrid(
                                newWord.col, 
                                newWord.row, 
                                newWord.direction, 
                                newWord.answer, 
                                currentWordCorrespondingIndex,
                                { // wordToCompareData
                                    ...crossWordsWords[wordToCompareIndex], 
                                    correspondingIndex: wordToCompareCorrespondingIndex
                                }, 
                            );
                            
                            if(!isOverlapping){ // Success for the word position
                                //console.log("WORD SUCCESS")
                                tryAnotherWorld = false;
                                newWord.clue = fullWords.find(w =>  w.answer.toUpperCase() === currentWord).clue;
                                crossWordsWords.push(newWord);
                                this.addWordToVirtualGrid(
                                    newWord.col,
                                    newWord.row,
                                    newWord.direction,
                                    newWord.answer
                                );
                            }
                        }
                    
                        //   console.log( correspondings,  getCorrespondingLetter,    "mot actuel : ", currentWord,     currentWordCorrespondingIndex,     "mot précédent : ", wordToCompare,    wordToCompareCorrespondingIndex );
                        // console.log(crossWordsWords[wordToCompareIndex].row, currentWordCorrespondingIndex, crossWordsWords[wordToCompareIndex].col, wordToCompareCorrespondingIndex);           
                    
                    }
                }
            
                if(wordToCompareIndex === crossWordsWords.length - 1 && tryAnotherWorld) { 
                    //console.log("Aucun mot n'offre de possibilité de placement");
                }                    
            }
   
        }

        //console.log(  'mots dans la grille sur ' + words.length + " /n Grille virtuelle: ", {grille: this.virtualGrid});

        // --------------------------------------------------------------------
        // ----------------  Trier les mots en fonction de leur direction et rapprocher les mots du bord (pour React-Crossword) ------------------------
        // --------------------------------------------------------------------

        let minXPos, minYpos;
        let firstMinPosTest = true;
        crossWordsWords.forEach(w => { // Calculer la position la plus courte avec les bords du cadres pour rapprocher les mots plus tard
            if(firstMinPosTest){
                minXPos = w.col;
                minYpos = w.row;
                firstMinPosTest = false;
                return;
            }

            minXPos = w.col < minXPos ? w.col : minXPos;       
            minYpos = w.row < minYpos ? w.row : minYpos;
        });

        crossWordsWords.forEach(w => { // Rapprocher les mots du bord
            w.col -= minXPos;
            w.col++;
            w.row -= minYpos;
            w.row++;
        });

        let across = {}, down = {};
        for (let index = 0; index < crossWordsWords.length; index++) {
            if(crossWordsWords[index].direction === 'across'){
                across[index] = crossWordsWords[index];
            }
            if(crossWordsWords[index].direction === 'down'){
                down[index] = crossWordsWords[index];  
            }
        }

        // Ajout des mots dans l'état local pour que le composant React-Crossword puisse les lire
        this.setState({
            data: {
                across: {...across},
                down: {...down}
            },
        }); 
        
    }

    isCrosswordCorrect(){
        return this.crosswordRef.current.isCrosswordCorrect();
    }

    crosswordIsCorrect(){
        //console.log("Mot-croisé complété !")
    }

    hideCrossword(){
        this.crosswordRef.current.reset();
    }

    addSpecialCharacterToCase (character) {
    }

    wordCorrect(){console.log('Mot correct')}

    render() {        
        const buttonHeight=50;
        return (
            <div className="App" >
                <Row>
                    <Row className='w-100'>
                        <Col  style={{ display: 'flex'}}>
                            <Crossword 
                                ref={this.crosswordRef} 
                                columnBreakpoint={'22vh'} 
                                data={this.state.data}
                                acrossLabel="Ourizountal" 
                                downLabel="Vertical"
                                onCorrect={this.wordCorrect.bind(this)}
                                onCrosswordCorrect={this.crosswordIsCorrect.bind(this)} 
                                className='m-auto'
                               // key={(key) => console.log(key)}
                                style={{height:'1000px', width: '1000px'}} />
                        </Col>
                    </Row>

                    <Row className='mx-auto'>
                        <Col className='mx-auto'>
                            <Button style={{height: buttonHeight, width: buttonHeight * 3}} onClick={this.showAnswers} >Solution</Button>
                            <Button style={{height: buttonHeight, width: buttonHeight * 4}} onClick={this.hideCrossword.bind(this)}>Cacher les mots</Button>
                            <Button style={{height: buttonHeight, width: buttonHeight * 4}} onClick={this.generateGrid.bind(this)}>Générer une nouvelle grille</Button>
                        </Col>
                        {/**  Créer un bouton pour chaque caractère spécial
                        <Col className='mx-auto'>
                            {this.specialCharacters.map(c => 
                                <Button onClick={this.addSpecialCharacterToCase.bind(this, c)}>{c}</Button>    
                            )}
                        </Col>
                        */}
                    </Row>
           
                </Row>
            </div>  
        );        
    }
}

export default App;