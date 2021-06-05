export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');
export const ws = new WebSocket('ws://localhost:3000');
export const CANVAS_SIZE = 512;
export const DEFAULT_COLOR = 'white';
