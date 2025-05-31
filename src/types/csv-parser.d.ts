import { Transform } from 'stream';

declare module 'csv-parser' {
  function csvParser(): Transform;
  export = csvParser;
} 