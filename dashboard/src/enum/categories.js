import Enum from "./enum";

const options = [
    {value: 1, label:"L'eau"},
    {value: 2, label: "Le feu"}
];

export default class Categories extends Enum{

    static values(){ return options;  }

    static getName(id, values){
        return options.find(value => value.value === id).label;
    }
}