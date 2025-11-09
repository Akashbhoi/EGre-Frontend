import { useState } from 'react';

const Calculator = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const calculate = (firstValue, secondValue, op) => {
    switch (op) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '%':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(String(inputValue));
      setEquation(`${inputValue} ${nextOperation}`);
      setDisplay('0');
    } else if (operation) {
      const currentValue = previousValue || '0';
      const newValue = calculate(parseFloat(currentValue), inputValue, operation);

      setDisplay('0');
      setPreviousValue(String(newValue));
      setEquation(`${newValue} ${nextOperation}`);
    } else {
      setEquation(`${inputValue} ${nextOperation}`);
      setDisplay('0');
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(parseFloat(previousValue), inputValue, operation);
      setDisplay(String(newValue));
      setEquation('');
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  const displayValue = equation
    ? (waitingForOperand || display === '0' ? equation : `${equation} ${display}`)
    : display;

  return (
    <div className="calculator-overlay" onClick={onClose}>
      <div className="calculator-container" onClick={(e) => e.stopPropagation()}>
        <div className="calculator-header">
          <h3>🔢 Calculator</h3>
          <button className="calculator-close" onClick={onClose}>✕</button>
        </div>

        <div className="calculator-display">{displayValue}</div>

        <div className="calculator-keypad">
          <button className="calc-btn calc-btn-function" onClick={clear}>C</button>
          <button className="calc-btn calc-btn-function" onClick={toggleSign}>+/-</button>
          <button className="calc-btn calc-btn-function" onClick={() => performOperation('%')}>%</button>
          <button className="calc-btn calc-btn-operator" onClick={() => performOperation('÷')}>÷</button>

          <button className="calc-btn" onClick={() => inputDigit('7')}>7</button>
          <button className="calc-btn" onClick={() => inputDigit('8')}>8</button>
          <button className="calc-btn" onClick={() => inputDigit('9')}>9</button>
          <button className="calc-btn calc-btn-operator" onClick={() => performOperation('×')}>×</button>

          <button className="calc-btn" onClick={() => inputDigit('4')}>4</button>
          <button className="calc-btn" onClick={() => inputDigit('5')}>5</button>
          <button className="calc-btn" onClick={() => inputDigit('6')}>6</button>
          <button className="calc-btn calc-btn-operator" onClick={() => performOperation('-')}>-</button>

          <button className="calc-btn" onClick={() => inputDigit('1')}>1</button>
          <button className="calc-btn" onClick={() => inputDigit('2')}>2</button>
          <button className="calc-btn" onClick={() => inputDigit('3')}>3</button>
          <button className="calc-btn calc-btn-operator" onClick={() => performOperation('+')}>+</button>

          <button className="calc-btn calc-btn-zero" onClick={() => inputDigit('0')}>0</button>
          <button className="calc-btn" onClick={inputDecimal}>.</button>
          <button className="calc-btn calc-btn-equals" onClick={handleEquals}>=</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
