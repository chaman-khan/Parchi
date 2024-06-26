import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Keyboard,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSelector, useDispatch} from 'react-redux';

import DropdownComponent from '../Components/Dropdown';
import CustomHeader from '../Components/CustomHeader';
import CustomScrollView from '../Components/CustomScrollView';
import Theme from '../Theme/Theme';
import {useSnackbar} from '../Components/CustomSnackBar';
import {handlePostProduct, handleUpdateProduct} from '../Features/ParchiSlice';
import CustomActivityIndicator from '../Components/CutomActivityIndicator';
import {CustomInputField} from './AddProduct';

const {width, height} = Dimensions.get('screen');

const EditProduct = ({navigation, route}) => {
  const {productID} = route.params;
  const dispatch = useDispatch();
  const {showSnackbar} = useSnackbar();
  const {userId} = useSelector(state => state.pin);
  const {products} = useSelector(state => state.app);
  const [showActivity, setShowActivity] = useState(false);
  const Item = products.filter(f => f.id === productID)[0];

  const [image, setImage] = useState(Item.Image);
  const [title, setTitle] = useState(Item.Name);
  const [description, setDescription] = useState(Item.Description);
  const [price, setPrice] = useState(Item.Unit_Price.toString());
  const [category, setCategory] = useState(Item.Category);
  const [unit, setUnit] = useState(Item.Unit);
  const [imageChanged, setImageChanged] = useState(false); // State to track if the image has changed

  fetch(image)
    .then(response => response.blob()) // Convert response to blob
    .then(blob => {
      // Read the blob as data URL
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        // Base64 data
        const base64data = reader.result;
        console.log('Base64 image:', base64data);
        setImage(base64data);
      };
    })
    .catch(error => {
      console.error('Error fetching or converting image:', error);
    });
  const handlePickingImage = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: false,
      includeBase64: true,
    }).then(data => {
      setImage({
        uri: data.data,
        name: data.path.split('/').pop(),
      });
      setImageChanged(true); // Set imageChanged state to true when image is picked
    });
  };

  const saveIt = () => {
    if (title.length === 0 || description.length === 0 || price.length === 0) {
      showSnackbar('Please Fill all Fields');
      return;
    }
    if (
      title === Item.Name &&
      description === Item.Description &&
      price === Item.Unit_Price.toString() &&
      category === Item.Category &&
      unit === Item.Unit &&
      !imageChanged // Check if the image has not changed
    ) {
      // If nothing has changed, show a message or handle it as needed
      showSnackbar('No changes made.');
      return;
    }

    setShowActivity(true);

    let updatedProduct = {
      Description: description,
      Name: title,
      Category: category,
      Unit: unit,
      Price: parseFloat(price.trim()),
      Business_ID: userId,
      PSID: Item.id,
      Image_Data: '',
      Image_Name: '',
    };

    if (imageChanged) {
      // Check if the image has changed
      updatedProduct = {
        ...updatedProduct,
        Image_Data: image.uri, // Use the newly picked image data
        Image_Name: image.name,
      };
    }

    dispatch(handleUpdateProduct(updatedProduct, onSuccess, onError));
  };

  const onSuccess = res => {
    setShowActivity(false);
    showSnackbar('Success: Product has been Updated', 'green');
  };

  const onError = err => {
    setShowActivity(false);
    showSnackbar('Failure: Something went wrong! Reverting to old product...');
    // Reverting to old product
    setTitle(Item.Name);
    setDescription(Item.Description);
    setPrice(Item.Unit_Price.toString());
    setCategory(Item.Category);
    setUnit(Item.Unit);
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader
        title={`Edit\tProduct`}
        onPressBack={() => navigation.goBack()}
      />
      <CustomScrollView>
        <ImageBackground
          source={{uri: image.uri ? `data:image;base64,${image.uri}` : image}}
          style={styles.imageContainer}
          imageStyle={styles.imageStyle}>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={handlePickingImage}
          />
        </ImageBackground>

        <CustomInputField
          title="Product Name"
          placeholder={'Title'}
          value={title}
          setValue={setTitle}
        />
        <DropdownComponent
          // data={[...new Set(products.map(product => product.Category))]}
          data={[
            'Bakers',
            'Dairy',
            'Tea & Coffee',
            'Snacks',
            'Biscuits & Cookies',
          ]}
          onDropdownChange={setCategory}
          value={category}
          placeholder="Category"
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <CustomInputField
            title="Product Price"
            placeholder={'Rupees'}
            keyboardType="number-pad"
            value={price}
            setValue={setPrice}
            isRow
          />
          <DropdownComponent
            data={['kg', 'ltr']}
            onDropdownChange={setUnit}
            value={unit}
            placeholder="Unit"
            isRow
          />
        </View>
        <CustomInputField
          title="Product Description"
          placeholder={'Detail'}
          value={description}
          setValue={setDescription}
          isMultiple
        />
        <TouchableOpacity style={styles.buttonWrapper} onPress={saveIt}>
          <Text style={styles.buttonTag}>SAVE</Text>
        </TouchableOpacity>
      </CustomScrollView>
      <CustomActivityIndicator showActivity={showActivity} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    width: '100%',
    backgroundColor: 'white',
    resizeMode: 'contain',
    height: height / 2.5,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    width: '100%',
    height: height / 4,
    resizeMode: 'contain',
    marginTop: (height / 2.5 - height / 4) / 2,
  },
  imagePicker: {
    flex: 1,
  },
  imageEmpty: {
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Theme.colors.primary,
  },
  inputFieldWrapper: {
    width: width - 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    borderRadius: 10,
    backgroundColor: 'white',
    marginVertical: 15,
    height: 55,
  },
  inputFieldTag: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
    position: 'absolute',
    marginLeft: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    top: -10,
  },
  inputField: {
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 16,
    width: '100%',
    height: '100%',
  },
  buttonWrapper: {
    width: width * 0.7,
    height: 55,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary,
    alignSelf: 'center',
    marginVertical: 20,
  },
  buttonTag: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditProduct;
