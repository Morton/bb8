import adapterStateStream from './adapterStateStream';
import xsFromCallback from 'xstream-from-callback';
import bleManager from './bleManager';

export default adapterStateStream
  .filter(state => state === 'PoweredOn')
  .map(_ =>
    xsFromCallback(bleManager.startDeviceScan.bind(bleManager))(
      ['22bb746f-2ba0-7554-2d6f-726568705327'],
      {},
    ),
  )
  .flattenConcurrently()
  .fold((p, v) => ({...p, [v.id]: v}), {});
