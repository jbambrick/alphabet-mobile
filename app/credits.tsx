import { Text, View } from 'react-native';
import Background from './background';
import config from './config.json';
import { creditsScreen } from './styles';

export default function CreditsScreen() {
    const contributions = config.credits;

    return (
        <Background>
            <View style={[creditsScreen.page]}>
                <Text style={[creditsScreen.text]}>{contributions}</Text>
            </View>
        </Background>
    );
}
