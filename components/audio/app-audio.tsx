import { useAudioPlayer } from 'expo-audio';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

interface AppAudioProps {
    url: string;
    message: string;
}

enum LoadingState {
    idle = 'idle',
    pending = 'pending',
    success = 'success',
    error = 'error',
}

export const AppAudio = ({ url, message }: AppAudioProps) => {
    const [loadingState, setLoadingState] = useState(LoadingState.success);

    const player = useAudioPlayer(url);

    const playAudio = () => {
        player.seekTo(0);

        player.play();
    };

    return loadingState === LoadingState.success ? (
        <Pressable
            testID="appAudioPlayer"
            disabled={loadingState !== LoadingState.success}
            onPress={playAudio}
        >
            <Text
                style={{
                    marginLeft: 30,
                    padding: 6,
                    paddingTop: 0,
                    fontSize: 34,
                    fontWeight: '700',
                    color: 'black',
                }}
            >
                {message}
            </Text>
        </Pressable>
    ) : (
        <Text>Error</Text>
    );
};
