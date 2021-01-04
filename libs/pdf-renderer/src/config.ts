import { registerAs } from '@nestjs/config';
import { rgb } from 'pdf-lib';

export const pdfRendererConfig = registerAs('pdf-renderer', () => ({
  templates: [
    {
      name: 'elegro',
    },
    {
      name: 'niko-tech',
    },
  ],
  colors: {
    green: '#81ffe9',
    white: rgb(1, 1, 1),
    blue: '#abf0fe',
    red: '#ff8181',
  },
  monthes: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
}));
