import {BleManager} from 'react-native-ble-plx';
import {Stream} from 'xstream';
import flattenConcurrently from 'xstream/extra/flattenConcurrently';

Stream.prototype.flattenConcurrently = function() {
  return flattenConcurrently(this);
};

export default new BleManager();
