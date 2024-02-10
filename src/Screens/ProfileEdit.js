import Meteor from '@meteorrn/core';
import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Badge,
  BadgeIcon,
  BadgeText,
  Box,
  Button,
  ButtonGroup,
  ButtonSpinner,
  ButtonText,
  Center,
  CloseIcon,
  HStack,
  Image,
  Input,
  InputField,
  Pressable,
  Text,
  Textarea,
  TextareaInput,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import S3 from 'aws-sdk/clients/s3';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as Location from 'expo-location';

import allLanguages from '../utils/langs/allLanguages';
import Toast from '../Components/Toast';
import { call } from '../utils/functions';
import Select from '../Components/Select';
import { StateContext } from '../StateContext';
import { i18n, locales } from '../../i18n';

import { accessKeyId, secretAccessKey, region, signatureVersion } from '@env';
const awsParams = {
  accessKeyId,
  secretAccessKey,
  region,
  signatureVersion,
};
const s3 = new S3(awsParams);

export default function ProfileEdit() {
  const { currentUser, changeLanguage } = useContext(StateContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      bio: currentUser?.bio,
    },
  });
  const toast = useToast();
  const [state, setState] = useState({
    confirmImageButtonLoading: false,
    confirmInfoButtonLoading: false,
    confirmLanguagesButtonLoading: false,
    confirmLocationButtonLoading: false,
    location: null,
    selectedLanguages: currentUser?.languages,
    selectedImage: null,
    selectedTab: 'image',
    selectImageButtonLoading: false,
  });

  const {
    confirmImageButtonLoading,
    confirmInfoButtonLoading,
    confirmLanguagesButtonLoading,
    confirmLocationButtonLoading,
    selectedLanguages,
    selectedImage,
    selectedTab,
    selectImageButtonLoading,
  } = state;

  if (!currentUser) {
    return <Spinner m="$4" />;
  }

  const handleSelectImage = (value) => {
    if (value === 'library') {
      pickImageAsync();
    } else {
      openCamera();
    }
  };

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    const resultResized = result && (await resizeImage(result.assets[0]));

    if (!result.canceled) {
      setState({
        ...state,
        selectedImage: {
          ...resultResized,
          fileName: result?.assets[0]?.fileSize?.toString() || 'file',
        },
        selectImageButtonLoading: false,
      });
    } else {
      setState({
        ...state,
        selectImageButtonLoading: false,
      });
    }
  };

  const pickImageAsync = async () => {
    setState({
      ...state,
      selectImageButtonLoading: true,
    });

    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("You've refused to allow this app to access your photos!");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    const resultResized = result && (await resizeImage(result.assets[0]));

    if (!result.canceled) {
      setState({
        ...state,
        selectedImage: {
          ...resultResized,
          fileName: result?.assets[0]?.fileName || result?.assets[0]?.fileSize.toString(),
        },
        selectImageButtonLoading: false,
      });
    } else {
      setState({
        ...state,
        selectImageButtonLoading: false,
      });
      alert('You did not select any image.');
    }
  };

  const resizeImage = async (image) => {
    const cropDimensions =
      image.width >= image.height
        ? {
            height: image.height,
            width: image.height,
            originX: (image.width - image.height) / 2,
            originY: 0,
          }
        : {
            height: image.width,
            width: image.width,
            originX: 0,
            originY: (image.height - image.width) / 2,
          };

    return await manipulateAsync(
      image.uri,
      [
        { crop: cropDimensions },
        {
          resize: {
            width: 600,
            height: 600,
          },
        },
      ],
      {
        format: SaveFormat.JPEG,
      }
    );
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const params = {
      Bucket: 'librella',
      Key: selectedImage.fileName,
      Body: blob,
    };

    return await s3
      .upload(params)
      .promise()
      .then(
        (data) => {
          console.log(data.Location);
          return data.Location;
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const handleConfirmImage = async (values) => {
    setState({
      ...state,
      confirmImageButtonLoading: true,
    });

    const imageUrl = selectedImage ? await uploadImage(selectedImage.uri) : values.imageUrl;
    console.log(imageUrl);

    try {
      await call('setProfileImage', imageUrl);
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message="Profile image is successfully updated" />,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setState({
        ...state,
        confirmImageButtonLoading: false,
      });
    }
  };

  const handleFormSubmit = (values) => {
    setState({
      ...state,
      confirmInfoButtonLoading: true,
    });
    updateProfile(values);
  };

  const updateProfile = async (values) => {
    try {
      await call('updateProfile', values);
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message={i18n.t('settings.updateMessage')} />,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setState({
        ...state,
        confirmImageButtonLoading: false,
      });
    }
  };

  const handleSelectLanguage = (lang) => {
    const { selectedLanguages } = state;
    if (selectedLanguages.find((l) => l.value === lang)) {
      return;
    }
    const selectedLang = allLanguages.find((l) => l.value === lang);
    setState({
      ...state,
      selectedLanguages: [...selectedLanguages, selectedLang],
    });
  };

  const handleRemoveLanguage = (lang) => {
    const newLanguages = selectedLanguages.filter((language) => lang.value !== language.value);
    setState({
      ...state,
      selectedLanguages: newLanguages,
    });
  };

  const handleUpdateLanguages = async () => {
    setState({
      ...state,
      confirmLanguagesButtonLoading: true,
    });
    const values = {
      languages: selectedLanguages,
    };

    try {
      await call('updateProfile', values);
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message="Profile is successfully updated" />,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setState({
        ...state,
        confirmLanguagesButtonLoading: false,
      });
    }
  };

  const setLocation = async () => {
    setState({
      ...state,
      confirmLocationButtonLoading: true,
    });
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      await call('updateProfile', { location });
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message="Profile is successfully updated" />,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setState({
        ...state,
        confirmLocationButtonLoading: false,
      });
    }
  };

  const languagesChanged =
    currentUser?.languages?.map((l) => l.value).toString() !==
    selectedLanguages?.map((l) => l.value).toString();

  const buttonProps = {
    size: 'xs',
    mx: -4.5,
    borderRadius: 0,
  };

  const isImage = selectedImage || (currentUser?.images && currentUser?.images[0]);

  return (
    <ScrollView w="100%">
      <Button variant="link" onPress={() => Meteor.logout()}>
        <ButtonText>{i18n.t('auth.logout')}</ButtonText>
      </Button>

      <Center m="$2">
        <ButtonGroup bg="$white" space="sm">
          <Button
            {...buttonProps}
            variant={selectedTab === 'image' ? 'solid' : 'outline'}
            onPress={() => setState({ ...state, selectedTab: 'image' })}
          >
            <ButtonText>{i18n.t('settings.image')}</ButtonText>
          </Button>
          <Button
            {...buttonProps}
            variant={selectedTab === 'info' ? 'solid' : 'outline'}
            onPress={() => setState({ ...state, selectedTab: 'info' })}
          >
            <ButtonText>{i18n.t('settings.info')}</ButtonText>
          </Button>
          <Button
            {...buttonProps}
            variant={selectedTab === 'languages' ? 'solid' : 'outline'}
            onPress={() => setState({ ...state, selectedTab: 'languages' })}
          >
            <ButtonText>{i18n.t('settings.languages')}</ButtonText>
          </Button>
          <Button
            {...buttonProps}
            variant={selectedTab === 'location' ? 'solid' : 'outline'}
            onPress={() => setState({ ...state, selectedTab: 'location' })}
          >
            <ButtonText>{i18n.t('settings.location')}</ButtonText>
          </Button>
        </ButtonGroup>
      </Center>

      {selectedTab === 'image' && (
        <Box>
          <Center>
            {isImage && (
              <Image
                alt={currentUser.username}
                resizeMode="contain"
                source={{
                  uri: selectedImage ? selectedImage.uri : currentUser?.images[0],
                }}
                style={{ width: 300, height: 300 }}
              />
            )}
          </Center>

          <Box p="$4">
            <Select
              options={[
                { label: i18n.t('settings.pickPhoto'), value: 'library' },
                { label: i18n.t('settings.takePhoto'), value: 'camera' },
              ]}
              value={isImage ? i18n.t('settings.replaceImage') : i18n.t('settings.pickOrTakePhoto')}
              placeholder={i18n.t('settings.pickOrTakeImage')}
              onValueChange={(value) => handleSelectImage(value)}
            />
          </Box>

          <Box p="$4">
            {selectedImage && (
              <Button
                isDisabled={confirmImageButtonLoading}
                type="submit"
                onPress={handleConfirmImage}
              >
                {confirmImageButtonLoading && <ButtonSpinner mr="$1" />}
                <ButtonText>{i18n.t('generic.confirm')}</ButtonText>
              </Button>
            )}
          </Box>
        </Box>
      )}

      {selectedTab === 'info' && (
        <VStack p="$4" space="lg" w="100%">
          <Box>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Text mb="$1">{i18n.t('settings.firstName')}</Text>
                  <Input bg="$white" variant="rounded">
                    <InputField mb="$1" value={value} onBlur={onBlur} onChangeText={onChange} />
                  </Input>
                </Box>
              )}
            />
            {errors.title && (
              <Text mt="$1" size="sm">
                {i18n.t('settings.firstNameRequired')}
              </Text>
            )}
          </Box>

          <Box>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Text mb="$1">{i18n.t('settings.lastName')}</Text>
                  <Input bg="$white" variant="rounded">
                    <InputField mb="$1" value={value} onBlur={onBlur} onChangeText={onChange} />
                  </Input>
                </Box>
              )}
            />
            {errors.title && (
              <Text mt="$1" size="sm">
                {i18n.t('settings.lastNameRequired')}
              </Text>
            )}
          </Box>

          <Box w="100%">
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Text mb="$1">{i18n.t('settings.selfDescription')}</Text>
                  <Textarea bg="$white" variant="rounded">
                    <TextareaInput
                      mt="$1"
                      placeholder={i18n.t('settings.selfDescriptionPlaceholder')}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  </Textarea>
                </Box>
              )}
            />
          </Box>

          <Button
            isDisabled={confirmInfoButtonLoading}
            onPress={handleSubmit(handleFormSubmit)}
            type="submit"
          >
            {confirmInfoButtonLoading && <ButtonSpinner mr="$1" />}
            <ButtonText>{i18n.t('generic.submit')}</ButtonText>
          </Button>
        </VStack>
      )}

      {selectedTab === 'languages' && (
        <Box w="100%">
          <Box bg="$white" my="$4" p="$4">
            <Text mb="$2" textAlign="center">
              {i18n.t('settings.changeLanguage')}
            </Text>
            <Select
              options={locales}
              value={locales?.find((lang) => lang.value === i18n.locale)?.label}
              placeholder={i18n.t('generic.language')}
              onValueChange={(value) => changeLanguage(value)}
            />
          </Box>

          <Center bg="$white" my="$4" p="$4">
            <Text mb="$4" textAlign="center">
              {i18n.t('settings.addLanguages')}
            </Text>

            <HStack flexWrap="wrap" justifyContent="center" space="sm">
              {selectedLanguages?.map((lang) => (
                <Badge key={lang.value} action="success" variant="outline">
                  <BadgeText>{lang.label}</BadgeText>
                  <Pressable onPress={() => handleRemoveLanguage(lang)}>
                    <BadgeIcon as={CloseIcon} ml="$2" />
                  </Pressable>
                </Badge>
              ))}
            </HStack>

            <Box p="$4" w="100%">
              <Select
                options={allLanguages}
                placeholder={i18n.t('settings.pickLanguagePlaceholder')}
                onValueChange={(item) => handleSelectLanguage(item)}
              />
            </Box>
            {languagesChanged && (
              <Center>
                <Button
                  isDisabled={confirmLanguagesButtonLoading}
                  type="submit"
                  onPress={() => handleUpdateLanguages()}
                >
                  <ButtonText>{i18n.t('generic.confirm')}</ButtonText>
                  {confirmLanguagesButtonLoading && <ButtonSpinner mr="$1" />}
                </Button>
              </Center>
            )}
          </Center>
        </Box>
      )}

      {selectedTab === 'location' && (
        <Box bg="$white" p="$4">
          <Text mb="$4">{i18n.t('settings.locationNotice')}</Text>
          <Text mb="$4">{i18n.t('settings.locationNotice2')}</Text>
          <Text mb="$4" textAlign="center">
            {i18n.t('settings.locationPrivacy')}
          </Text>
          <Button isDisabled={confirmLocationButtonLoading} mb="$2" onPress={() => setLocation()}>
            {confirmLocationButtonLoading && <ButtonSpinner mr="$1" />}
            <ButtonText>{i18n.t('settings.saveLocation')}</ButtonText>
          </Button>
          {confirmLocationButtonLoading && (
            <Text textAlign="center">{i18n.t('settings.locationLoading')}</Text>
          )}
        </Box>
      )}

      <Box h={200}></Box>
    </ScrollView>
  );
}
