import Enum from "./enum";

const options = [
    {value: 1, label:"nom féminin"},
    {value: 2, label:"nom masculin"},
    {value: 3, label:"déterminant"},
    {value: 4, label:"pronom"},
    {value: 5, label:"verbe"},
    {value: 6, label:"adjectif"},
    {value: 7, label:"préposition"},
    {value: 8, label:"conjonction"},
    {value: 9, label:"adverbe"},
];

export default class Classes extends Enum {
        
    static values(){ return options; }

    static getName(id){
        return options.find(value => value.value === id).label;
    }
}