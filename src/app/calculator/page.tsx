'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/tailgrids/core/button';

const ERROR = 'Error';
const MAX_DIGITS = 9;

export default function Calculator() {
  const [display, setDisplay] = useState<string>('0');
  const [first, setFirst] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [operator, setOperator] = useState<any>(null);
  const [state, setState] = useState<string>('first'); // 'first' | 'operator' | 'second' | 'equal'
  const [overwrite, setOverwrite] = useState<boolean>(false);
  const [memory, setMemory] = useState(0);

  const insertSeparator = (str:string, separator = ',', groupSize = 3) => {
    let resultString = '';
    let counter = 0;
    for (let i = str.length - 1; i >= 0; i--) {
      resultString = str[i] + resultString;
      if (i !== 0 && counter++ % groupSize === 2) {
        resultString = separator + resultString;
      }
    }
    return resultString;
  };

  const formatDisplay = (value:string) => {
    if (!/^-?\d+(\.\d*)?$/.test(value)) return value;
    const sign = value.startsWith('-') ? '-' : '';
    const parts = value.slice(sign.length).split('.');
    const intPart = parts[0];
    const decPart = parts[1];
    return sign + insertSeparator(intPart) + (decPart === undefined ? '' : '.' + decPart);
  };

  const digitCount = (str:string) => str.replace(/[-.]/g, '').length;

  const toDisplayString = (value:number) => {
    if (!isFinite(value)) return ERROR;
    return String(Number(value.toPrecision(MAX_DIGITS)));
  };

  const calculate = (a:number, b:number, op:string) => {
    switch (op) {
      case '+': return toDisplayString(a + b);
      case '=': return toDisplayString(a + b);
      case '-': return toDisplayString(a - b);
      case '*': return toDisplayString(a * b);
      case '/': return b === 0 ? ERROR : toDisplayString(a / b);
      default: return String(b);
    }
  };

  const beginEntry = () => {
    if (state === 'operator') {
      setState('second');
      setOverwrite(true);
    } else if (state === 'equal') {
      setState('first');
      setOverwrite(true);
    }
  };

  const putOnScreen = (value:string) => {
    setDisplay(value);
    if (state === 'operator') setState('second');
    setOverwrite(true);
  };

  const numberClick = (num:number) => {
    if (display === ERROR) return;
    beginEntry();
    if (overwrite) {
      setDisplay(String(num));
      setOverwrite(false);
    } else if (digitCount(display) < MAX_DIGITS) {
      setDisplay((prev) => (prev === '0' ? String(num) : prev + String(num)));
    }
  };

  const dotClick = () => {
    if (display === ERROR) return;
    beginEntry();
    if (overwrite) {
      setDisplay('0.');
      setOverwrite(false);
    } else if (!display.includes('.') && digitCount(display) < MAX_DIGITS) {
      setDisplay((prev) => prev + '.');
    }
  };

  const signClick = () => {
    if (display === ERROR || display === '0' || state === 'operator') return;
    setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
  };

  const percentClick = () => {
    if (display === ERROR) return;
    const value = Number(display);
    if (state !== 'second' && state !== 'operator') {
      putOnScreen(toDisplayString(value / 100));
      return;
    }
    const operand = (operator === '+' || operator === '-') ? (first * value) / 100 : value / 100;
    const res = calculate(first, operand, operator);
    setDisplay(res);
    setFirst(res === ERROR ? 0 : Number(res));
    setState('equal');
    setOverwrite(true);
  };

  const unaryClick = (fn:any) => {
    if (display === ERROR) return;
    putOnScreen(toDisplayString(fn(Number(display))));
  };

  const opeatorClick = (op:any) => {
    if (display === ERROR) return;
    const currentNum = Number(display);
    if (state === 'first' || state === 'equal') {
      setFirst(currentNum);
    } else if (state === 'second') {
      const res = calculate(first, currentNum, operator);
      if (res === ERROR) {
        setDisplay(ERROR);
        setState('equal');
        return;
      }
      setDisplay(res);
      setFirst(Number(res));
    }
    setOperator(op);
    setState('operator');
    setOverwrite(true);
  };

  const equalClick = () => {
    if (state !== 'second') return;
    const secNum:number = Number(display);
    const res = calculate(first, secNum, operator);
    setDisplay(res);
    setFirst(res === ERROR ? 0 : Number(res));
    setState('equal');
    setOverwrite(true);
  };

  const ceClick = () => {
    setDisplay('0');
    setFirst(0);
    setSecond(0);
    setOperator(null);
    setState('first');
    setOverwrite(false);
  };

  const mcClick = () => setMemory(0);
  const mrClick = () => putOnScreen(String(memory));
  const mAddClick = () => {
    if (display === ERROR) return;
    setMemory((m) => m + Number(display));
    setOverwrite(true);
  };
  const mSubClick = () => {
    if (display === ERROR) return;
    setMemory((m) => m - Number(display));
    setOverwrite(true);
  };

  // รองรับ Keyboard
  useEffect(() => {
    const handleKeyDown = (e:any) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        equalClick();
      } else if (e.key === 'Escape') {
        ceClick();
      } else if (e.key >= '0' && e.key <= '9') {
        numberClick(e.key);
      } else if (e.key === '.') {
        dotClick();
      } else if (e.key === '%') {
        percentClick();
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        opeatorClick(e.key);
      } else if (e.key === '=') {
        opeatorClick("+");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });
  
  return (
    <div className="mt-4 mb-4 w-full mx-auto flex flex-col items-center justify-center">
      {/* Calculator */}
      <div className="border-[3px] border-black rounded-[18px] bg-black text-center p-1 select-none max-w-max mx-auto">
        {/* inner */}
        <div className="border-[5px] border-[#606060] rounded-[15px] p-2.5 bg-[#e0dfdf]">
          {/* screen */}
          <div id="screen" className="border border-gray-400 rounded-[10px] bg-[#a9ffee] h-16 mb-4 p-2 text-right flex items-center justify-end font-mono text-2xl font-bold">{formatDisplay(display)}</div>

          <div className="mt-1 grid grid-cols-5 gap-2">
            <Button onClick={mcClick} className="bg-green-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">MC</Button>
            <Button onClick={mrClick} className="bg-green-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">MR</Button>
            <Button onClick={mAddClick} className="bg-green-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">M+</Button>
            <Button onClick={mSubClick} className="bg-green-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">M-</Button>
            <Button onClick={ceClick} className="bg-red-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">CE</Button>
          </div>

          <div className="mt-1 grid grid-cols-5 gap-2">
            <Button onClick={() => numberClick(7)} className="bg-purple-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">7</Button>
            <Button onClick={() => numberClick(8)} className="bg-purple-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">8</Button>
            <Button onClick={() => numberClick(9)} className="bg-purple-600 font-sans font-bold font-bold text-base w-15 h-15 rounded-[10px]">9</Button>
            <Button onClick={() => opeatorClick('/')} className="bg-green-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">÷</Button>
            <Button onClick={() => unaryClick(Math.sqrt)} className="bg-green-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">√</Button>
          </div>

          <div className="mt-1 grid grid-cols-5 gap-2">
            <Button onClick={() => numberClick(4)} className="bg-purple-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">4</Button>
            <Button onClick={() => numberClick(5)} className="bg-purple-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">5</Button>
            <Button onClick={() => numberClick(6)} className="bg-purple-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">6</Button>
            <Button onClick={() => opeatorClick('*')} className="bg-green-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">×</Button>
            <Button onClick={percentClick} className="bg-green-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">%</Button>
          </div>

          <div className="mt-1 grid grid-cols-5 gap-2">
            <Button onClick={() => numberClick(1)} className="bg-purple-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">1</Button>
            <Button onClick={() => numberClick(2)} className="bg-purple-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">2</Button>
            <Button onClick={() => numberClick(3)} className="bg-purple-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">3</Button>
            <Button onClick={() => opeatorClick('-')} className="bg-green-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">-</Button>
            <Button onClick={() => unaryClick((v:any) => 1 / v)} className="bg-green-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">1/x</Button>
          </div>

          <div className="mt-1 grid grid-cols-5 gap-2">
            <Button onClick={() => numberClick(0)} className="bg-purple-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">0</Button>
            <Button onClick={dotClick} className="bg-purple-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">.</Button>
            <Button onClick={signClick} className="bg-purple-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">+/-</Button>
            <Button onClick={() => opeatorClick('+')} className="bg-green-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">+</Button>
            <Button onClick={equalClick} className="bg-green-600 font-sans font-bold text-base w-15 h-15 rounded-[10px]">=</Button>
          </div>
        </div>
      </div>
      </div>
  );
}
