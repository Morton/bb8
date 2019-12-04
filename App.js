import React from 'react';
import {View, Text, FlatList, Button, StyleSheet} from 'react-native';

const App = () => {
  const [adapterState, devices] = ['', {}];

  return (
    <View>
      <Text>Adapter State: {adapterState}</Text>
      <FlatList
        data={Object.values(devices).slice(0, 3)}
        renderItem={({item}) => <Button title={item.id} />}
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
