import React, { useState } from "react";
import { ScrollView } from "react-native";
import {
  Badge,
  BadgeIcon,
  BadgeText,
  Box,
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonText,
  Center,
  CloseIcon,
  HStack,
  Image,
  Input,
  InputField,
  LoaderIcon,
  Pressable,
  Text,
  Textarea,
  TextareaInput,
  VStack,
  useToast,
} from "@gluestack-ui/themed";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import { S3 } from "aws-sdk";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as Location from "expo-location";

import allLanguages from "../utils/langs/allLanguages";
import ActionSheet from "../Components/ActionSheet";
import Toast from "../Components/Toast";
import { call } from "../utils/functions";
import { awsParams } from "../../private";

const s3 = new S3(awsParams);

export default function ProfileEdit({ navigation, route }) {
  const { currentUser } = route.params;
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
    pickerVisible: false,
    selectedLanguages: currentUser?.languages,
    selectedImage: null,
    selectedTab: "image",
    selectImageButtonLoading: false,
  });

  const {
    confirmImageButtonLoading,
    confirmInfoButtonLoading,
    confirmLanguagesButtonLoading,
    confirmLocationButtonLoading,
    pickerVisible,
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
    if (status !== "granted") {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      alert("You did not select any image.");
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
      Bucket: "librella",
      Key: selectedImage?.assets[0]?.fileName,
      Body: blob,
    };

    return await s3
      .upload(params)
      .promise()
      .then(
        (data) => {
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

    const resizedImage =
      selectedImage && (await resizeImage(selectedImage?.assets[0]));
    const imageUrl = selectedImage
      ? await uploadImage(resizedImage.uri)
      : values.imageUrl;

    const images = [imageUrl];

    updateProfile({ images });
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
      await call("updateProfile", values);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeId={id} message="Profile is successfully updated" />
        ),
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

  const handleRemoveLanguage = (lang) => {
    const newLanguages = selectedLanguages.filter(
      (language) => lang.value !== language.value
    );
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
      await call("updateProfile", values);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeId={id} message="Profile is successfully updated" />
        ),
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

  const setGeoLocation = async () => {
    setState({
      ...state,
      confirmLocationButtonLoading: true,
    });
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      await call("updateProfile", { location });
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeId={id} message="Profile is successfully updated" />
        ),
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

  return (
    <ScrollView>
      <Center m="$4">
        <ButtonGroup bg="$white">
          <Button
            borderRadius={0}
            size="sm"
            variant={selectedTab === "image" ? "solid" : "outline"}
            onPress={() => setState({ ...state, selectedTab: "image" })}
          >
            <ButtonText>Image</ButtonText>
          </Button>
          <Button
            borderRadius={0}
            size="sm"
            variant={selectedTab === "info" ? "solid" : "outline"}
            onPress={() => setState({ ...state, selectedTab: "info" })}
          >
            <ButtonText>Info</ButtonText>
          </Button>
          <Button
            borderRadius={0}
            size="sm"
            variant={selectedTab === "languages" ? "solid" : "outline"}
            onPress={() => setState({ ...state, selectedTab: "languages" })}
          >
            <ButtonText>Languages</ButtonText>
          </Button>
          <Button
            borderRadius={0}
            size="sm"
            variant={selectedTab === "location" ? "solid" : "outline"}
            onPress={() => setState({ ...state, selectedTab: "location" })}
          >
            <ButtonText>Location</ButtonText>
          </Button>
        </ButtonGroup>
      </Center>

      {selectedTab === "image" && (
        <Box>
          <Center>
            {(selectedImage || currentUser?.images[0]) && (
              <Image
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
              <ButtonText>
                {selectedImage ? "Replace Image" : "Pick or Take Image"}
              </ButtonText>
              {selectImageButtonLoading && (
                <ButtonIcon as={LoaderIcon} ml="$4" />
              )}
            </Button>

            {selectedImage && (
              <Button
                isDisabled={confirmImageButtonLoading}
                type="submit"
                onPress={handleConfirmImage}
              >
                <ButtonText>Confirm</ButtonText>
                {confirmImageButtonLoading && (
                  <ButtonIcon as={LoaderIcon} ml="$4" />
                )}
              </Button>
            )}
          </Box>
        </Box>
      )}

      {selectedTab === "info" && (
        <VStack p="$4" space="lg" w="100%">
          <Box>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Box>
                  <Text mb="$1">First name</Text>
                  <Input bg="$white" variant="rounded">
                    <InputField
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
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
                    <InputField
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
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
            <ButtonText>Submit</ButtonText>
            {confirmInfoButtonLoading && <ButtonIcon as={LoaderIcon} ml="$4" />}
          </Button>
        </VStack>
      )}

      {selectedTab === "languages" && (
        <>
          <Center bg="$white" px="$4" pt="$4">
            <HStack flexWrap="wrap" justifyContent="center">
              {selectedLanguages?.map((lang) => (
                <Badge
                  key={lang.value}
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

          <Center>
            <Button
              bg="$white"
              my="$4"
              size="sm"
              variant="outline"
              onPress={() => setState({ ...state, pickerVisible: true })}
            >
              <ButtonText>Pick language</ButtonText>
            </Button>
          </Center>

          {languagesChanged && (
            <Center m="$4">
              <Button
                isDisabled={confirmLanguagesButtonLoading}
                type="submit"
                onPress={() => handleUpdateLanguages()}
              >
                <ButtonText>Confirm</ButtonText>
                {confirmLanguagesButtonLoading && (
                  <ButtonIcon as={LoaderIcon} ml="$4" />
                )}
              </Button>
            </Center>
          )}

          <ActionSheet
            isOpen={pickerVisible}
            options={allLanguages}
            onClose={() => setState({ ...state, pickerVisible: false })}
            onPress={(option) => {
              setState({
                ...state,
                pickerVisible: false,
                selectedLanguages: [...selectedLanguages, option],
              });
            }}
          />
        </>
      )}

      {selectedTab === "location" && (
        <Center bg="$white" p="$4">
          <Button
            isDisabled={confirmLocationButtonLoading}
            onPress={() => setGeoLocation()}
          >
            <ButtonText>Save Geolocation</ButtonText>
            {confirmLocationButtonLoading && (
              <ButtonIcon as={LoaderIcon} ml="$4" />
            )}
          </Button>
        </Center>
      )}

      <Box h={200}></Box>
    </ScrollView>
  );
}
