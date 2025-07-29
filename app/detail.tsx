import { AppAudio } from '@/components/audio/app-audio';
import { useConfig } from '@/components/Redux/config';
import { fetchAlphabets } from '@/components/Redux/store/slices/alphabet-slice';
import { selectAlphabet } from '@/components/Redux/store/slices/selectors';
import { RouteProp } from '@react-navigation/native';
import { useAudioPlayer } from 'expo-audio';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './../components/Redux/store';
import Background from './background';
import config from './config.json';
import { alphabetCard, alphabetDetailStyle } from './styles';

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

export function AlphabetCardDetailScreen({
    route,
}: {
    route: AlphabetCardDetailRouteProp;
}) {
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

    const {
        word,
        letter,
        sequence_number,
        card_image,
        letter_audio,
        word_audio,
        standalone_image,
    } = selectedCard;

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

    const letterAudioSource = `${BASE_API_URL}/resources/mediaitems/download?name=${letter_audio}`;

    const wordAudioSource = `${BASE_API_URL}/resources/mediaitems/download?name=${word_audio}`;

    const player = useAudioPlayer(letterAudioSource);

    const player2 = useAudioPlayer(wordAudioSource);

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
                                // style={{ width: 100, height: 100 }}
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

                    <View>
                        <Text style={alphabetDetailStyle.hint}>
                            Swipe Left/Right
                        </Text>
                    </View>
                </View>
            </GestureRecognizer>
        </Background>
    );
}
export default AlphabetCardDetailScreen;
