import Enum from "./enum";

const options = [
    {value: 0, label:"Autre"},
    {value: 1, label:"Bellanda"},
    {value: 2, label: "Glossaire d'André Compan"}
];

export default class Sources extends Enum{
  
    static values(){ return options;}

    static getName(id){
        let op = options.find(val => val.value === Number(id));
        return op.label;
    }
}