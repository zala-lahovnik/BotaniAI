import { Camera, CameraType } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Animated, Dimensions, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import Scan from '../../assets/scan-rectangle.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Camera_Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './CameraScreenStyles';
import { CameraPreviewScreen } from './CameraPreviewScreen';
import BackButton from '../../components';
import { PermissionNeeded } from '../../components/PermissionCard/PermissionNeeded';

const AnimatedBarCodeScanner = () => {
  const { width, height } = Dimensions.get('window');

  const scaleValue = new Animated.Value(1);

  const animateBreathing = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.9,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateBreathing();
  }, []);

  return (
    <View
      style={{
        position: 'absolute',
        top: '20%',
        left: width / 2 - 200,
        backgroundColor: 'transparent',
      }}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Scan width={400} height={400} fill={'none'} />
      </Animated.View>
    </View>
  );
};

let camera: Camera | null = null;

type Props = NativeStackScreenProps<any>;
export const CameraScreen = ({ navigation, route }: Props) => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);

  const [cameraReady, setCameraReady] = useState(false);

  const insets = useSafeAreaInsets();

  async function takePicture() {
    if (!camera) return;
    const photo = await camera.takePictureAsync({ base64: true });
    setPreviewVisible(true);
    setCapturedImage(photo);
    setCameraReady(false);
  }

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return (
      <PermissionNeeded
        permission={'We need your permission to show the camera'}
        navigation={navigation}
        requestPermission={requestPermission}
      />
    );
  }

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {previewVisible && capturedImage ? (
          <CameraPreviewScreen
            photo={capturedImage}
            navigation={navigation}
            route={route}
          />
        ) : (
          <Camera
            style={styles.camera}
            type={type}
            ref={(r) => {
              camera = r;
            }}
            onCameraReady={() => {
              setCameraReady(true);
            }}
          >
            {cameraReady && <AnimatedBarCodeScanner />}
            <BackButton navigation={navigation} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <Camera_Icon name="photo-camera" size={40} color="black" />
              </TouchableOpacity>
            </View>
          </Camera>
        )}
      </View>
    </>
  );
};
