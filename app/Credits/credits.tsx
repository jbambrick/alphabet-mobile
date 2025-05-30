import { StyleSheet, Text, View } from 'react-native';
import config from './../config.json';

export default function CreditsScreen() {

  const contributions = config.credits;

  return (
    <View style={styles.container}>
      <Text>Credits</Text>
      <Text>{contributions}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
