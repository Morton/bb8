import React from 'react';
import {View, Text, FlatList, Button, StyleSheet} from 'react-native';
import useStream from './useStream';
import adapterStateStream from './adapterStateStream';
import deviceStream from './deviceStream';
import selectedDeviceStream from './selectedDeviceStream';
import characteristicsStream from './characteristicsStream';
import xs from 'xstream';

const wakeUpStream = characteristicsStream.filter(
  ({uuid}) => uuid === '22bb746f-2bbf-7554-2d6f-726568705327',
);
const antiDosStream = characteristicsStream.filter(
  ({uuid}) => uuid === '22bb746f-2bbd-7554-2d6f-726568705327',
);
const txPowerStream = characteristicsStream.filter(
  ({uuid}) => uuid === '22bb746f-2bb2-7554-2d6f-726568705327',
);

xs.combine(wakeUpStream, antiDosStream, txPowerStream).addListener({
  next: async ([wakeUpStream, antiDosStream, txPowerStream]) => {
    await antiDosStream.writeWithResponse('MDExaTM=');
    await txPowerStream.writeWithResponse('AAc=');
    await wakeUpStream.writeWithResponse('AQ==');
  },
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
      <Button title="↑" />
      <Button title="←" />
      <Button title="→" />
      <Button title="↓" />
      <Text style={styles.collision}>💥</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  collision: {
    fontSize: 100,
    textAlign: 'center',
  },
});

export default App;
