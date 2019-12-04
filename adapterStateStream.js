import xsFromCallback from 'xstream-from-callback';
import bleManager from './bleManager';

const onStateChangeAsNodeCallback = x =>
  bleManager.onStateChange(v => x(null, v), true);

export default xsFromCallback(onStateChangeAsNodeCallback)();
