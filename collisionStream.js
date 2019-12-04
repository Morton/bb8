import characteristicsStream from './characteristicsStream';
import xsFromCallback from 'xstream-from-callback';
import {decodeToUint8Array} from './base64';
import delay from 'xstream/extra/delay';

export default characteristicsStream
  .filter(({uuid}) => uuid === '22bb746f-2ba6-7554-2d6f-726568705327')
  .compose(delay(100))
  .map(characteristic =>
    xsFromCallback(characteristic.monitor.bind(characteristic))(),
  )
  .flattenConcurrently()
  .map(characteristic => characteristic.value)
  .map(decodeToUint8Array)
  .map(binary => {
    if (binary.length < 5) {
      return {};
    }

    const dataView = new DataView(binary.buffer);
    const dataLength = dataView.getUint8(4);
    const data = binary.slice(5, 5 + dataLength);

    return {
      async: dataView.getUint8(1) !== 0xff,
      idCode: dataView.getUint8(2),
      dataLength,
      data,
    };
  })
  .filter(
    ({async, dataLength, idCode}) => async && dataLength > 0 && idCode === 7,
  )
  .filter(({idCode}) => idCode === 7);
