import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import {
    Pressable,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import Background from './background';
import config from './config.json';
import { alphabetButton, homeScreen } from './styles';

export default function HomeScreen() {
    const appName = config.appName;
    const alphabetLanguage = config.language;
    const navigation =
        useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const { width, height } = useWindowDimensions();

    return (
        <Background>
            <View style={[homeScreen.background]}>
                <ScrollView>
                    <View>
                        <Image
                            contentFit="contain"
                            priority={'high'}
                            source={{
                                uri: config.appImage,
                            }}
                            style={[
                                homeScreen.homeImage,
                                { marginTop: width > height ? 0 : 120 },
                                { width: width > height ? 100 : 130 },
                                { height: width > height ? 100 : 130 },
                            ]}
                        />
                        <Text
                            style={[
                                homeScreen.appTitle,
                                { margin: width > height ? 0 : 20 },
                            ]}
                        >
                            {appName}
                        </Text>
                    </View>
                    <View>
                        <Text
                            style={[
                                homeScreen.tagline,
                                { margin: width > height ? 10 : 38 },
                            ]}
                        >
                            Explore the {appName}. Learn {alphabetLanguage}{' '}
                            letters, words, and pronounciation with audio.
                        </Text>
                    </View>

                    <View
                        style={[
                            homeScreen.button,
                            { width: width > height ? '40%' : '80%' },
                        ]}
                    >
                        <Pressable
                            testID="Menu"
                            onPress={() => navigation.navigate('Menu')}
                        >
                            <Text style={alphabetButton.alphabetName}>
                                Alphabet
                            </Text>
                        </Pressable>
                    </View>

                    <View
                        style={[
                            homeScreen.button,
                            { width: width > height ? '40%' : '80%' },
                        ]}
                    >
                        <Pressable
                            testID="Credits"
                            onPress={() => navigation.navigate('Credits')}
                        >
                            <Text style={alphabetButton.alphabetName}>
                                Credits
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
                <View
                    style={[
                        homeScreen.footer,
                        { display: width > height ? 'none' : 'flex' },
                    ]}
                >
                    <Text style={[homeScreen.footerText]}>
                        A project built on the
                        <View
                            style={{
                                justifyContent: 'center',
                                alignSelf: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={{
                                    uri: config.coscradLogoUrl,
                                }}
                                alt="Coscrad"
                                contentFit="cover"
                                style={{
                                    height: 120,
                                    width: 120,
                                    marginVertical: -53,
                                    alignContent: 'center',
                                }}
                                contentPosition={'bottom'}
                            />
                        </View>
                        platform.
                    </Text>
                </View>
            </View>
        </Background>
    );
}
