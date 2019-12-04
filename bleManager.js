import {BleManager} from 'react-native-ble-plx';
import xs, {Stream} from 'xstream';
import flattenConcurrently from 'xstream/extra/flattenConcurrently';
import {Buffer as buffer} from 'buffer';

Stream.prototype.flattenConcurrently = function() {
  return flattenConcurrently(this);
};
Stream.prototype.mapPromised = function(f) {
  return this.map(f)
    .map(p => xs.fromPromise(p))
    .flattenConcurrently();
};
global.Buffer = buffer;

export default new BleManager();
