enum operator {
    ADD_NUMBER, 
    SUBTRACT_NUMBER, 
    MULTIPLY_NUMBER, 
    DIVIDE_NUMBER, 
    GREATER_NUMBER,
    SMALLER_NUMBER,
    EQUALS_NUMBER,
    STRING_CONCAT, 
    BOOL_AND, 
    BOOL_OR, 
    CONST
}

interface funct {
    a: any
    b: any
    operator: operator
}


class StringFunction {



    parse<T>(): T {
        let temp: T;
        return temp
    }

    resolve(funct: funct): any {
        switch (funct.operator) {
            case operator.ADD_NUMBER:
                return this.resolve(funct.a) + this.resolve(funct.b)
            case operator.SUBTRACT_NUMBER:
                return this.resolve(funct.a) - this.resolve(funct.b)
            case operator.MULTIPLY_NUMBER:
                return this.resolve(funct.a) * this.resolve(funct.b)
            case operator.DIVIDE_NUMBER:
                return this.resolve(funct.a) / this.resolve(funct.b)
            case operator.GREATER_NUMBER:
                return this.resolve(funct.a) > this.resolve(funct.b)
            case operator.SMALLER_NUMBER:
                return this.resolve(funct.a) < this.resolve(funct.b)
            case operator.EQUALS_NUMBER:
                return this.resolve(funct.a) == this.resolve(funct.b)
            case operator.STRING_CONCAT:
                return this.resolve(funct.a) + " " + this.resolve(funct.b)
            case operator.BOOL_AND:
                return this.resolve(funct.a) && this.resolve(funct.b)
            case operator.BOOL_OR:
                return this.resolve(funct.a) || this.resolve(funct.b)
            case operator.CONST:
                return funct.a
        }
    }
}