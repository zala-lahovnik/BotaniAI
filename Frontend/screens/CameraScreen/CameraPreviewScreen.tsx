import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraCapturedPicture } from 'expo-camera/src/Camera.types';
import { Header } from '../../components';
import { functionsPython } from '../../firebase/firebase';
import { httpsCallable } from 'firebase/functions';
import { species } from '../../constants/species';
import { previewStyles } from "./CameraPreviewScreenStyles";

type Props = NativeStackScreenProps<any> & {
  photo: CameraCapturedPicture;
};

export const CameraPreviewScreen = ({ navigation, photo, route }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showClassResultView, setShowClassResultView] = useState(false);
  const [predictionResults, setPredictionsResults] = useState('');
  const [predictionPercent, setPredictionPercent] = useState('');
  const [predictedKey, setPredictedKey] = useState('');

  async function onPressOnUsePhotoButton() {
    setShowClassResultView(false);
    setLoading(true);

    const addMessage = httpsCallable(functionsPython, 'predict_plant', {
      timeout: 120000,
    });
    addMessage({
      image: photo.base64,
    })
      .then((result: any) => {
        const data = result.data;
        const arrayKey = Object.values(species);

        const maxPrediction = Math.max(...data.pred);
        const indexOfMax = data.pred.indexOf(maxPrediction);

        const predictedClass = arrayKey[indexOfMax];
        const predictedClassKey = Object.keys(species)[indexOfMax];

        setPredictionsResults(predictedClass);
        setPredictionPercent((maxPrediction * 100).toFixed(2));
        setPredictedKey(predictedClassKey);
        setShowClassResultView(true);
        setLoading(false);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  const onPressOnContinueButton = () => {
    //TODO: set in Context or somewhere and navigate
  };

  return (
    <>
      <Header
        navigation={navigation}
        text={'Preview'}
        leftAction={() => navigation.goBack()}
        route={route}
      />
      <View
        style={{
          backgroundColor: 'transparent',
          flex: 1,
        }}
      >
        {loading === true ? (
          <>
            <ActivityIndicator
              size="large"
              color="black"
              style={{ marginBottom: '10%', marginTop: '20%' }}
            />
            <Text
              style={{
                color: 'black',
                fontSize: 22,
                textAlign: 'center',
                margin: 10,
              }}
            >
              Your image is being processed.
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 22,
                textAlign: 'center',
                margin: 10,
              }}
            >
              The process can take up to 2 minutes.
            </Text>
          </>
        ) : (
          <>
            <ImageBackground
              source={{ uri: photo && photo.uri }}
              style={{
                flex: 1,
              }}
            />
            {!showClassResultView && (
              <View style={previewStyles.photoButtonsContainer}>
                <Pressable
                  onPress={() => {navigation.goBack()}}
                  style={previewStyles.usePhotoButton}
                >
                  <Text style={{ color: 'black', fontSize: 16 }}>Retake</Text>
                </Pressable>
                <Pressable
                  onPress={onPressOnUsePhotoButton}
                  style={previewStyles.usePhotoButton}
                >
                  <Text style={{ color: 'black', fontSize: 16 }}>Use this photo</Text>
                </Pressable>
              </View>
            )}
            {showClassResultView && (
              <View
                style={previewStyles.resultsContainer}
              >
                <View
                  style={previewStyles.resultsContent}
                >
                  <View
                    style={previewStyles.predictionsContainer}
                  >
                    <Text
                      style={previewStyles.predictionTitle}
                    >
                      {predictionResults}
                    </Text>
                    <Text style={previewStyles.predictionDescription}>
                      Predicted with a confidence level of {predictionPercent}%
                    </Text>
                  </View>
                  <View
                    style={previewStyles.continueButtonContainer}
                  >
                    <Pressable
                      style={previewStyles.continueButton}
                      onPress={onPressOnContinueButton}
                    >
                      <Image
                        source={require('../../assets/arrow-right-icon.png')}
                        style={previewStyles.continueButtonImage}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
};
