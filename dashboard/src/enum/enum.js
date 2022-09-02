export default class Enum {
     values(values){ return values;  }

     getName(id, values){
        return values.find(value => value.value === id).label;
    }
}