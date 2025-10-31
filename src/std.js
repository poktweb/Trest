// Biblioteca padrão Trest para JavaScript/Node.js
// Este arquivo é usado quando compilado para web/exe

export const Math = {
  abs: Math.abs,
  max: Math.max,
  min: Math.min,
  pow: Math.pow,
  sqrt: Math.sqrt,
  ceil: Math.ceil,
  floor: Math.floor,
  round: Math.round,
  PI: Math.PI,
  E: Math.E,
};

export const String = {
  tamanho: (str) => str.length,
  maiuscula: (str) => str.toUpperCase(),
  minuscula: (str) => str.toLowerCase(),
  substituir: (str, antigo, novo) => str.replace(antigo, novo),
  dividir: (str, separador) => str.split(separador),
};

export const Array = {
  comprimento: (arr) => arr.length,
  adicionar: (arr, elemento) => {
    arr.push(elemento);
    return arr;
  },
  remover: (arr, indice) => {
    const novo = [...arr];
    novo.splice(indice, 1);
    return novo;
  },
  inclui: (arr, elemento) => arr.includes(elemento),
  inverter: (arr) => [...arr].reverse(),
  fatiar: (arr, inicio, fim) => arr.slice(inicio, fim),
  ordenar: (arr) => [...arr].sort(),
};

export const IO = {
  lerArquivo: (caminho) => {
    const fs = require('fs');
    return fs.readFileSync(caminho, 'utf-8');
  },
  escreverArquivo: (caminho, conteudo) => {
    const fs = require('fs');
    fs.writeFileSync(caminho, conteudo);
  },
  existeArquivo: (caminho) => {
    const fs = require('fs');
    return fs.existsSync(caminho);
  },
};

