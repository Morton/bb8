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

xs.combine(wakeUpStream, antiDosStream, txPowerStream).addListener({
  next: async ([wakeUpStream, antiDosStream, txPowerStream]) => {
    await antiDosStream.writeWithResponse('MDExaTM=');
    await txPowerStream.writeWithResponse('AAc=');
    await wakeUpStream.writeWithResponse('AQ==');
  },
});

xs.combine(sendStream, commandStream).addListener({
  next: ([send, command]) =>
    send.writeWithResponse(command).then(console.log, console.error),
});

const App = () => {
  const adapterState = useStream(adapterStateStream, '');
  const devices = useStream(deviceStream, {});

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
      <Text style={styles.collision}>💥</Text>
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
