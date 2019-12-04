import buttonStream from './buttonStream';
import {encodeFromUint8Array} from './base64';
import {roll} from './spheroCommands';

export default buttonStream
  .map(str => {
    switch (str) {
      case 'LEFT':
        return [80, 90];
      case 'UP':
        return [80, 0];
      case 'RIGHT':
        return [80, 180];
      case 'DOWN':
        return [80, 270];
      case 'STOP':
        return [0, 0];
    }
  })
  .map(([speed, angle]) => roll(speed, angle))
  .map(encodeFromUint8Array);
