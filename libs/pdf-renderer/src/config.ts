import { registerAs } from '@nestjs/config';
import { rgb } from 'pdf-lib';

export const pdfRendererConfig = registerAs('pdf-renderer', () => ({
  templates: [
    {
      name: 'niko-tech',
      fixes: {},
    },
    {
      name: 'elegro',
      fixes: {
        date: {
          y: -50,
        },
      },
    },
  ],
  colors: {
    green: rgb(0.505882353, 1, 0.917647059),
    white: rgb(1, 1, 1),
    blue: rgb(0.670588235, 0.941176471, 0.996078431),
    red: rgb(1, 0.505882353, 0.505882353),
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
