import { AppAudio } from '@/components/audio/app-audio';
import { useConfig } from '@/components/Redux/config';
import { fetchAlphabets } from '@/components/Redux/store/slices/alphabet-slice';
import { selectAlphabet } from '@/components/Redux/store/slices/selectors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './../components/Redux/store';
import Background from './background';
import config from './config.json';
import { alphabetCard } from './styles';
/**
 *
 * TODO Fix the project.json (remove package.json?) so that you can import
 * from libs and then import these from the validation lib.
 */

type AlphabetCardDetailRouteProp = RouteProp<{
    params: {
        selectedCardNumber: number;
    };
}>;

const isNull = (input: unknown): input is null => input === null;

const isUndefined = (input: unknown): input is undefined =>
    typeof input === 'undefined';

const isNullOrUndefined = (input: unknown): input is null | undefined =>
    isNull(input) || isUndefined(input);

//TODO use a proper type
export function AlphabetCardDetailScreen({ route }: { route: any }) {
    const {
        env: { BASE_API_URL, TARGET_ALPHABET_NAME },
    } = useConfig();

    const dispatch = useDispatch<AppDispatch>();

    const {
        isLoading,
        errorInfo,
        data: alphabetData,
    } = useSelector(selectAlphabet);

    const initialCardNumber = route.params?.selectedCardNumber || 1;

    // TODO create a `useLoadableAlphabet` hook
    // Better yet, createa  `useLoadableCardBySequenceNumber` hooks
    useEffect(() => {
        if (isNull(alphabetData)) dispatch(fetchAlphabets());
    }, [alphabetData, dispatch]);

    const [imageError, setImageError] = useState(false);

    // Sequence numbers are indexed starting at 1
    const [selectedLetterSequenceNumber, setSelectedLetterSequenceNumber] =
        useState<number>(initialCardNumber);

    if (isLoading || isNull(alphabetData)) {
        return (
            <View>
                <Image
                    source={{
                        uri: config.appImage,
                    }}
                />
                <Text>Loading</Text>
            </View>
        );
    }

    if (!isNullOrUndefined(errorInfo)) {
        // TODO display error code
        return <Text>Error: {errorInfo.message}</Text>;
    }

    const {
        data: { alphabet_cards: alphabetCards },
    } = alphabetData;

    const selectedCard = alphabetCards.find(
        ({ sequence_number: sequenceNumber }) => {
            return (
                Number.parseInt(sequenceNumber) === selectedLetterSequenceNumber
            );
        }
    );

    // The data is validate so really this is a system error
    if (isUndefined(selectedCard)) {
        // TODO handle this properly
        return <Text>Card not found.</Text>;
    }

    const { word, letter, letter_audio, word_audio, standalone_image } =
        selectedCard;

    const swipeRight = () => {
        setSelectedLetterSequenceNumber(
            selectedLetterSequenceNumber === 1
                ? alphabetCards.length
                : selectedLetterSequenceNumber - 1
        );
    };

    const swipeLeft = () => {
        setSelectedLetterSequenceNumber(
            (selectedLetterSequenceNumber % alphabetCards.length) + 1
        );
    };

    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(animatedValue, {
                toValue: 5,
                duration: 600,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    }, [animatedValue]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 2],
        outputRange: [0, 10],
    });

    return (
        <Background>
            <GestureRecognizer
                onSwipeLeft={swipeLeft}
                onSwipeRight={swipeRight}
            >
                <View
                    style={{ height: '100%', marginTop: 20 }}
                    testID="AlphabetCardDetail"
                >
                    <View style={alphabetCard.card}>
                        <AppAudio
                            url={`${BASE_API_URL}/resources/mediaitems/download?name=${letter_audio}`}
                            message={letter}
                        />
                        {!imageError ? (
                            <Image
                                style={alphabetCard.image}
                                testID={`loadedImage`}
                                onError={() => setImageError(true)}
                                resizeMode="contain"
                                source={{
                                    uri: `${BASE_API_URL}/resources/mediaitems/download?name=${standalone_image}`,
                                }}
                            />
                        ) : (
                            <Text testID={`imageError`}>
                                Error loading image.
                            </Text>
                        )}
                        <AppAudio
                            url={`${BASE_API_URL}/resources/mediaitems/download?name=${word_audio}`}
                            message={word}
                        />
                    </View>

                    <Animated.View style={{ transform: [{ translateX }] }}>
                        <FontAwesome.Button
                            name="hand-o-up"
                            backgroundColor="inherit"
                            style={{ margin: 'auto' }}
                        >
                            Swipe Left/Right
                        </FontAwesome.Button>
                    </Animated.View>
                </View>
            </GestureRecognizer>
        </Background>
    );
}
export default AlphabetCardDetailScreen;
