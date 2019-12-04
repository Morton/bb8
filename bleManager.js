import {BleManager} from 'react-native-ble-plx';
import xs, {Stream} from 'xstream';
import flattenConcurrently from 'xstream/extra/flattenConcurrently';

Stream.prototype.flattenConcurrently = function() {
  return flattenConcurrently(this);
};
Stream.prototype.mapPromised = function(f) {
  return this.map(f)
    .map(p => xs.fromPromise(p))
    .flattenConcurrently();
};

export default new BleManager();
