import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraCapturedPicture } from 'expo-camera/src/Camera.types';
import { Header } from '../../components';
import { functionsPython } from '../../firebase/firebase';
import { httpsCallable } from 'firebase/functions';
import { species } from '../../constants/species';
import { previewStyles } from './CameraPreviewScreenStyles';
import { getPlantByLatin } from '../../api/_plant';
import { Plant } from '../../types/_plant';
import { global } from '../../styles/globals';
import { addPlantToHistory } from '../../api/_user';
import { UserActionType, UserContext } from '../../context/UserContext';

type Props = NativeStackScreenProps<any> & {
  photo: CameraCapturedPicture;
};

export const CameraPreviewScreen = ({ navigation, photo, route }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showClassResultView, setShowClassResultView] = useState(false);
  const [predictionResults, setPredictionsResults] = useState('');
  const [predictionPercent, setPredictionPercent] = useState('');
  const [fetchedPlantData, setFetchedPlantData] = useState<Plant | null>(null);
  const [currentImageName, setCurrentImageName] = useState<string>('');
  const { user, dispatch } = useContext(UserContext);

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

        setPredictionsResults(predictedClass);
        setPredictionPercent((maxPrediction * 100).toFixed(2));

        setShowClassResultView(true);
        setLoading(false);
        saveIntoUserHistory(
          predictedClass,
          Number((maxPrediction * 100).toFixed(0))
        );
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  const saveIntoUserHistory = async (predicted: string, result: number) => {
    const plantData = await getPlantByLatin(predicted);
    setFetchedPlantData(plantData);

    if (user.userId) {
        try {
          const uploadResult = await addPlantToHistory({
            userId: user.userId,
            plantId: plantData._id,
            customName: plantData.common,
            date: new Date().toISOString(),
            result: result,
            image: photo.base64,
          });
          setCurrentImageName(uploadResult.imageName)

          dispatch({ type: UserActionType.UPDATE_HISTORY, payload: {
            _id: uploadResult.addedId,
            plantId: plantData._id,
            customName: plantData.common,
            date: new Date().toISOString(),
            result: result,
            image: uploadResult.imageName
          }})
        } catch (err) {
          console.log('Error while uploading image', err);
        }
      }
  };

  const onPressOnContinueButton = () => {
    if (fetchedPlantData)
      navigation.navigate('PlantDetails', {
        latin: fetchedPlantData?.latin,
        common: fetchedPlantData?.common,
        description: fetchedPlantData?.description,
        watering: fetchedPlantData?.watering,
        sunlight: fetchedPlantData?.sunlight,
        plantingTime: fetchedPlantData?.plantingTime,
        soil: fetchedPlantData?.soil,
        wateringDetail: fetchedPlantData?.wateringDetail,
        fertilization: fetchedPlantData?.fertilization,
        toxicity: fetchedPlantData?.toxicity,
        imageToSave: currentImageName || fetchedPlantData?.image
      });
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
        {loading ? (
          <>
            <ActivityIndicator
              size="large"
              color="#124A3F"
              style={{ marginBottom: '10%', marginTop: '20%' }}
            />
            <Text
              style={{
                color: global.color.primary.backgroundColor,
                fontSize: 22,
                textAlign: 'center',
                margin: 10,
              }}
            >
              Your image is being processed.
            </Text>
            <Text
              style={{
                color: global.color.primary.backgroundColor,
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
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={previewStyles.usePhotoButton}
                >
                  <Text
                    style={{
                      color: global.color.primary.backgroundColor,
                      fontSize: 16,
                    }}
                  >
                    Retake
                  </Text>
                </Pressable>
                <Pressable
                  onPress={onPressOnUsePhotoButton}
                  style={previewStyles.usePhotoButton}
                >
                  <Text
                    style={{
                      color: global.color.primary.backgroundColor,
                      fontSize: 16,
                    }}
                  >
                    Use this photo
                  </Text>
                </Pressable>
              </View>
            )}
            {showClassResultView && (
              <View style={previewStyles.resultsContainer}>
                <View style={previewStyles.resultsContent}>
                  <View style={previewStyles.predictionsContainer}>
                    <Text style={previewStyles.predictionTitle}>
                      {predictionResults}
                    </Text>
                    <Text style={previewStyles.predictionDescription}>
                      Predicted with a confidence level of {predictionPercent}%
                    </Text>
                  </View>
                  <View style={previewStyles.continueButtonContainer}>
                    {(user.userId ? currentImageName : fetchedPlantData) ?
                      <Pressable
                        style={previewStyles.continueButton}
                        onPress={onPressOnContinueButton}
                      >
                        <Image
                          source={require('../../assets/arrow-right-icon.png')}
                          style={previewStyles.continueButtonImage}
                        />
                      </Pressable>
                      :
                      <ActivityIndicator
                        size="large"
                        color="#124A3F"
                        style={{ marginBottom: '10%', marginTop: '20%' }}
                      />
                    }
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
