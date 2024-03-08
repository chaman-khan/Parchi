import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Keyboard,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';

import {sendPin} from '../Features/PinSlice';
import {verticalScale} from '../Theme/Dimensions';
import Theme from '../Theme/Theme';
import CustomTextInput from '../Components/CustomTextInput';
import CustomActivityIndicator from '../Components/CutomActivityIndicator';
import CustomScrollView from '../Components/CustomScrollView';
import {useSnackbar} from '../Components/CustomSnackBar';

const {width, height} = Dimensions.get('window');

function Login({navigation}) {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showActivity, setShowActivity] = useState(false);
  const {showSnackbar} = useSnackbar();

  const handleChangePhoneNumber = text => {
    if (text.length < 11) {
      setPhoneNumber(text.replace(/[^0-9+]/g, ''));
    }
  };

  const handleOtpChange = text => {
    if (text.length < 5) setOtp(text);
  };

  const handleLogin = () => {
    if (phoneNumber.length !== 10 || otp.length !== 4) {
      showSnackbar('Please Fill All Fields with appropriate data...');
      return;
    }
    Keyboard.dismiss();
    setShowActivity(true);
    let data = {
      phone: phoneNumber,
      password: otp,
      Business_Name: businessName,
    };
    dispatch(sendPin(data, onSuccessLogin, onErrorLogin));
  };

  const onSuccessLogin = res => {
    setShowActivity(false);
    showSnackbar(res, 'green');
    navigation.replace('HomeStack');
  };

  const onErrorLogin = err => {
    setShowActivity(false);
    showSnackbar(err, 'red');
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainContainer}
        keyboardShouldPersistTaps="always">
        <Image source={require('../assets/logo2.png')} style={styles.logo} />
        <CustomTextInput
          value={phoneNumber}
          setValue={handleChangePhoneNumber}
          keyboardType={'numeric'}
          placeholder={'XXXXXXXXXX'}
          prefix={'+92'}
        />
        <CustomTextInput
          value={otp}
          setValue={handleOtpChange}
          keyboardType={'numeric'}
          placeholder={'Pin Code'}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonTag}>Login</Text>
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomTag}>Not a user?</Text>
          <TouchableOpacity
            style={[styles.loginButton, styles.bottomButton]}
            onPress={() => navigation.navigate('BookDemo')}>
            <Text style={[styles.buttonTag, styles.bottomButtonTag]}>
              Book a demo
            </Text>
          </TouchableOpacity>
        </View>
      </CustomScrollView>
      <CustomActivityIndicator showActivity={showActivity} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
  },
  logo: {
    width: width,
    height: height / 3,
    resizeMode: 'contain',
    marginVertical: verticalScale(50),
  },
  textInput: {
    width: '90%',
    borderBottomWidth: 1,
    borderColor: 'white',
    alignSelf: 'center',
    color: 'white',
    height: 55,
    marginVertical: 5,
    fontSize: 16,
  },
  loginButton: {
    width: '60%',
    height: 45,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: verticalScale(60),
  },
  buttonTag: {
    color: Theme.colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomContainer: {
    marginTop: verticalScale(100),
  },
  bottomTag: {
    color: Theme.colors.secondary,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  bottomButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
    marginTop: 5,
    marginBottom: 20,
  },
  bottomButtonTag: {
    color: 'white',
    fontSize: 16,
  },
});

export default Login;
