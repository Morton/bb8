import React from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import useStream from './useStream';
import adapterStateStream from './adapterStateStream';
import deviceStream from './deviceStream';
import selectedDeviceStream from './selectedDeviceStream';
import characteristicsStream from './characteristicsStream';
import xs from 'xstream';
import buttonStream from './buttonStream';
import commandStream from './commandStream';
import collisionStream from './collisionStream';
import {configureCollisions} from './spheroCommands';
import {encodeFromUint8Array} from './base64';

const wakeUpStream = characteristicsStream.filter(
  ({uuid}) => uuid === '22bb746f-2bbf-7554-2d6f-726568705327',
);
const antiDosStream = characteristicsStream.filter(
  ({uuid}) => uuid === '22bb746f-2bbd-7554-2d6f-726568705327',
);
const txPowerStream = characteristicsStream.filter(
  ({uuid}) => uuid === '22bb746f-2bb2-7554-2d6f-726568705327',
);
const sendStream = characteristicsStream.filter(
  ({uuid}) => uuid === '22bb746f-2ba1-7554-2d6f-726568705327',
);

xs.combine(wakeUpStream, antiDosStream, txPowerStream, sendStream).addListener({
  next: async ([wakeUp, antiDos, txPower, send]) => {
    await antiDos.writeWithResponse('MDExaTM=');
    await txPower.writeWithResponse('AAc=');
    await wakeUp.writeWithResponse('AQ==');

    const command = configureCollisions({
      meth: 0x01,
      xt: 0x20,
      xs: 0x20,
      yt: 0x20,
      ys: 0x20,
      dead: 0x21,
    });
    await send
      .writeWithResponse(encodeFromUint8Array(command))
      .catch(console.error);
  },
});

xs.combine(sendStream, commandStream).addListener({
  next: ([send, command]) =>
    send.writeWithResponse(command).catch(console.error),
});

collisionStream.addListener({next: console.log, error: console.error});

const App = () => {
  const adapterState = useStream(adapterStateStream, '');
  const devices = useStream(deviceStream, {});
  const collisions = useStream(collisionStream, false);

  return (
    <View>
      <Text>Adapter State: {adapterState}</Text>
      <FlatList
        data={Object.values(devices).slice(0, 3)}
        renderItem={({item}) => (
          <Button
            title={item.name || item.id}
            onPress={() => selectedDeviceStream.shamefullySendNext(item)}
          />
        )}
        keyExtractor={device => device.id}
      />
      <TouchableWithoutFeedback
        onPressIn={() => buttonStream.shamefullySendNext('UP')}
        onPressOut={() => buttonStream.shamefullySendNext('STOP')}>
        <Text style={styles.button}>↑</Text>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPressIn={() => buttonStream.shamefullySendNext('LEFT')}
        onPressOut={() => buttonStream.shamefullySendNext('STOP')}>
        <Text style={styles.button}>←</Text>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPressIn={() => buttonStream.shamefullySendNext('RIGHT')}
        onPressOut={() => buttonStream.shamefullySendNext('STOP')}>
        <Text style={styles.button}>→</Text>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPressIn={() => buttonStream.shamefullySendNext('DOWN')}
        onPressOut={() => buttonStream.shamefullySendNext('STOP')}>
        <Text style={styles.button}>↓</Text>
      </TouchableWithoutFeedback>
      {collisions && <Text style={styles.collision}>💥</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  collision: {
    fontSize: 100,
    textAlign: 'center',
  },
  button: {
    fontSize: 70,
  },
});

export default App;
