import selectedDeviceStream from './selectedDeviceStream';
import bleManager from './bleManager';
import xs from 'xstream';

export default selectedDeviceStream
  .mapPromised(async device => {
    bleManager.stopDeviceScan();
    return await device.connect();
  })
  .mapPromised(device => device.discoverAllServicesAndCharacteristics())
  .mapPromised(device => device.services())
  .map(services => xs.fromArray(services))
  .flatten()
  .mapPromised(service => service.characteristics())
  .map(characteristics => xs.fromArray(characteristics))
  .flatten();
