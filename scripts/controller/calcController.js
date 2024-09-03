class CalcController {

    constructor() {
        this.locale = 'pt-BR';
        this._displayCalcE1 = document.querySelector('#display');
        this._dateE1 = document.querySelector('#data');
        this._timeE1 = document.querySelector('#hora');
        this._currentDate;
        this._operation = [];
        this.inicialize();
        this.initButtonsEvents();
    }

    inicialize() {
        this.setDisplayDateTime();
        setInterval(() => { 
            this.setDisplayDateTime();
        }, 1000);
    }

    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }
        
    clearAll() {
        this._operation = [];
        this.displayCalc = '0';
    }
    
    clearEntry() {
        this._operation.pop();
        this.displayCalc = this._operation.join('') || '0';
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }
    
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }
    
    isOperator(value) {
        return ['+', '-', '*', '%', '/'].indexOf(value) > -1;
    }

    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {
            this.calc();
        }
    }

    calc() {
        let last = '';
    
        if (this._operation.length > 3) {
            last = this._operation.pop();
        }
    
        let result;
        try {
            result = eval(this._operation.join(''));
        } catch (e) {
            this.setError();
            return;
        }
    
        if (last === '%') {
            result /= 100;
            this._operation = [result];
        } else {
            this._operation = [result];
            if (last) this._operation.push(last);
        }
        this.setLastNumberToDisplay();
    }
    

    setLastNumberToDisplay() {
        let lastNumber;
        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (!this.isOperator(this._operation[i])) {
                lastNumber = this._operation[i];
                break;
            }
        }
        this.displayCalc = lastNumber !== undefined ? lastNumber : '0';
    }

    addOperation(value) {
        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            } else if (isNaN(value)) {
                console.log(value);
                // Lógica adicional para casos não numéricos
            } else {
                this._operation.push(value);
                this.setLastNumberToDisplay();
            }
        } else {
            if (this.isOperator(value)) {
                this._operation.push(value);
                this.calc(); // Adiciona a operação e calcula o resultado
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseFloat(newValue)); // Utilizando parseFloat para garantir precisão
            }
        }
        this.setLastNumberToDisplay();
    }

    setError() {
        this.displayCalc = 'Error';
    }

    execBtn(value) {
        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-'); 
                break;
            case 'divisao':
                this.addOperation('/'); 
                break;
            case 'multiplicacao':
                this.addOperation('*'); 
                break;
            case 'porcento':
                this.addOperation('%'); 
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addOperation('.'); 
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');
    
        buttons.forEach(btn => {
            this.addEventListenerAll(btn, 'click', e => {
                let textBtn = btn.className.baseVal.replace('btn-', '');
                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn, 'mouseover', e => {
                btn.style.cursor = 'pointer';
            });
        });
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this.locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this.locale);
    }

    get displayTime() {
        return this._timeE1.innerHTML;
    }

    set displayTime(value) {
        this._timeE1.innerHTML = value;
    }

    get displayDate() {
        return this._dateE1.innerHTML;
    }

    set displayDate(value) {
        this._dateE1.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcE1.innerHTML;
    }

    set displayCalc(value) {
        this._displayCalcE1.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}
