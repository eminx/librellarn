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

// const secret = process.env.private;
// const awsParams = secret.awsParams;

import { accessKeyId, secretAccessKey, region, signatureVersion } from '@env';
const awsParams = {
  accessKeyId,
  secretAccessKey,
  region,
  signatureVersion,
};
const s3 = new S3(awsParams);

export default function ProfileEdit() {
  const { currentUser } = useContext(StateContext);

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
      quality: 0,
    });

    if (!result.canceled) {
      setState({
        ...state,
        selectedImage: result,
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
    return await manipulateAsync(
      image.uri,
      [
        {
          resize: {
            width: 300,
            height: 300,
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
      Key: selectedImage?.assets[0]?.fileName,
      Body: blob,
    };

    return await s3
      .upload(params)
      .promise()
      .then(
        (data) => {
          console.log(data);
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

    const resizedImage = selectedImage && (await resizeImage(selectedImage?.assets[0]));
    const imageUrl = selectedImage ? await uploadImage(resizedImage.uri) : values.imageUrl;

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
        render: ({ id }) => <Toast nativeId={id} message="Profile is successfully updated" />,
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
    currentUser?.languages.map((l) => l.value).toString() !==
    selectedLanguages.map((l) => l.value).toString();

  const buttonProps = {
    borderBottomWidth: '2px',
    borderRadius: '0',
    px: '$2',
    variant: 'link',
  };

  return (
    <ScrollView>
      <Center m="$4">
        <ButtonGroup>
          <Button
            {...buttonProps}
            borderBottomColor={selectedTab === 'image' ? '$blue600' : '$white'}
            onPress={() => setState({ ...state, selectedTab: 'image' })}
          >
            <ButtonText>Image</ButtonText>
          </Button>
          <Button
            {...buttonProps}
            borderBottomColor={selectedTab === 'info' ? '$blue600' : '$white'}
            onPress={() => setState({ ...state, selectedTab: 'info' })}
          >
            <ButtonText>Info</ButtonText>
          </Button>
          <Button
            {...buttonProps}
            borderBottomColor={selectedTab === 'languages' ? '$blue600' : '$white'}
            onPress={() => setState({ ...state, selectedTab: 'languages' })}
          >
            <ButtonText>Languages</ButtonText>
          </Button>
          <Button
            {...buttonProps}
            borderBottomColor={selectedTab === 'location' ? '$blue600' : '$white'}
            onPress={() => setState({ ...state, selectedTab: 'location' })}
          >
            <ButtonText>Location</ButtonText>
          </Button>
        </ButtonGroup>
      </Center>

      {selectedTab === 'image' && (
        <Box>
          <Center>
            {(selectedImage || currentUser?.images[0]) && (
              <Image
                alt={currentUser.username}
                source={{
                  uri: selectedImage?.assets[0]?.uri || currentUser?.images[0],
                }}
                style={{ width: 300, height: 300 }}
              />
            )}
          </Center>

          <Box p="$4">
            <Button
              bg="$white"
              isDisabled={selectImageButtonLoading}
              mb="$4"
              variant="outline"
              onPress={pickImageAsync}
            >
              {selectImageButtonLoading && <ButtonSpinner mr="$1" />}
              <ButtonText>{selectedImage ? 'Replace Image' : 'Pick or Take Image'}</ButtonText>
            </Button>

            {selectedImage && (
              <Button
                isDisabled={confirmImageButtonLoading}
                type="submit"
                onPress={handleConfirmImage}
              >
                {confirmImageButtonLoading && <ButtonSpinner mr="$1" />}
                <ButtonText>Confirm</ButtonText>
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
                  <Text mb="$1">First name</Text>
                  <Input bg="$white" variant="rounded">
                    <InputField value={value} onBlur={onBlur} onChangeText={onChange} />
                  </Input>
                </Box>
              )}
            />
            {errors.title && (
              <Text mt="$1" size="sm">
                First name is required
              </Text>
            )}
          </Box>

          <Box>
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Text mb="$1">Last name</Text>
                  <Input bg="$white" variant="rounded">
                    <InputField value={value} onBlur={onBlur} onChangeText={onChange} />
                  </Input>
                </Box>
              )}
            />
            {errors.title && (
              <Text mt="$1" size="sm">
                Last name is required
              </Text>
            )}
          </Box>

          <Box w="100%">
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Text mb="$1">Self description</Text>
                  <Textarea bg="$white" variant="rounded">
                    <TextareaInput
                      placeholder="Description about you..."
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
            <ButtonText>Submit</ButtonText>
          </Button>
        </VStack>
      )}

      {selectedTab === 'languages' && (
        <>
          <Center bg="$white" px="$4" pt="$4">
            <HStack flexWrap="wrap" justifyContent="center">
              {selectedLanguages?.map((lang) => (
                <Badge
                  key={lang.value}
                  action="success"
                  mb="$4"
                  mr="$4"
                  size="lg"
                  variant="outline"
                >
                  <BadgeText>{lang.label}</BadgeText>
                  <Pressable onPress={() => handleRemoveLanguage(lang)}>
                    <BadgeIcon as={CloseIcon} ml="$2" />
                  </Pressable>
                </Badge>
              ))}
            </HStack>
          </Center>

          <Center pt="$4">
            <Select
              options={allLanguages}
              placeholder="Pick language"
              onValueChange={(item) => handleSelectLanguage(item)}
            />
          </Center>

          {languagesChanged && (
            <Center m="$4">
              <Button
                isDisabled={confirmLanguagesButtonLoading}
                type="submit"
                onPress={() => handleUpdateLanguages()}
              >
                <ButtonText>Confirm</ButtonText>
                {confirmLanguagesButtonLoading && <ButtonSpinner mr="$1" />}
              </Button>
            </Center>
          )}
        </>
      )}

      {selectedTab === 'location' && (
        <Center bg="$white" p="$4">
          <Button isDisabled={confirmLocationButtonLoading} onPress={() => setLocation()}>
            {confirmLocationButtonLoading && <ButtonSpinner mr="$1" />}
            <ButtonText>Save Location</ButtonText>
          </Button>
        </Center>
      )}

      <Box h={200}></Box>
    </ScrollView>
  );
}
