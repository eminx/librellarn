import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  AddIcon,
  Box,
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
  Center,
  CloseIcon,
  HStack,
  Image,
  Input,
  InputField,
  Text,
  Textarea,
  TextareaInput,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
import * as ImagePicker from 'expo-image-picker';
import S3 from 'aws-sdk/clients/s3';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import Select from './Select';
import allLanguages from '../utils/langs/allLanguages';
import Toast from './Toast';
import { call } from '../utils/functions';
import { i18n } from '../../i18n';

import { accessKeyId, secretAccessKey, region, signatureVersion } from '@env';
import { BooksContext } from '../StateContext';
const awsParams = {
  accessKeyId,
  secretAccessKey,
  region,
  signatureVersion,
};

const authorsKeys = ['elma', 'armut', 'kiraz', 'kayisi', 'seftali'];

const bookModel = {
  title: '',
  category: '',
  ISBN: '',
  publisher: '',
  publishedDate: '',
  description: '',
};

const s3 = new S3(awsParams);

export default function BookForm({ book, navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: book || bookModel,
  });

  const toast = useToast();
  const [state, setState] = useState({
    authors: book ? book.authors : [''],
    isLoading,
    selectedLanguage: book ? allLanguages.find((l) => l.value === book.language) : null,
    selectedImage: null,
    selectImageButtonLoading: false,
  });
  const { getMyBooks } = useContext(BooksContext);

  const { authors, isLoading, selectedLanguage, selectedImage } = state;

  const handleAuthorChange = (value, index) => {
    const newAuthors = authors.map((item, i) => (i === index ? value : item));
    setState({
      ...state,
      authors: newAuthors,
    });
  };

  const handleSelectLanguage = (value) => {
    const selectedLang = allLanguages.find((l) => l.value === value);
    setState({
      ...state,
      selectedLanguage: selectedLang,
    });
  };

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
      aspect: [2, 3],
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
      aspect: [2, 3],
      quality: 1,
    });

    const resultResized = result && (await resizeImage(result.assets[0]));

    if (!result.canceled) {
      setState({
        ...state,
        selectedImage: { ...resultResized, fileName: result?.assets[0]?.fileName },
        selectImageButtonLoading: false,
      });
    } else {
      setState({
        ...state,
        selectImageButtonLoading: false,
      });
    }
  };

  const resizeImage = async (image) => {
    // aspact ratio: 2/3 (width/height)
    const cropDimensions =
      image.width >= (image.height / 3) * 2
        ? {
            height: image.height,
            width: (image.height * 2) / 3,
            originX: image.height / 6,
            originY: 0,
          }
        : {
            height: (image.width * 2) / 3,
            width: image.width,
            originX: 0,
            originY: image.width / 6,
          };

    return await manipulateAsync(
      image.uri,
      [
        { crop: cropDimensions },
        {
          resize: {
            width: 400,
            height: 600,
          },
        },
      ],
      {
        format: SaveFormat.JPEG,
      }
    );
  };

  const uploadImage = async () => {
    const uri = selectedImage?.uri;
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
          return data.Location;
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const onFormSubmit = async (values) => {
    setState({
      ...state,
      isLoading: true,
    });

    // const resizedImage = selectedImage && (await resizeImage(selectedImage?.assets[0]));
    const imageUrl = selectedImage ? await uploadImage() : values.imageUrl;

    const parsedValues = {
      ...values,
      authors,
      authorsLowerCase: authors?.map((a) => a?.toLowerCase()),
      categoryLowerCase: values.category?.toLowerCase(),
      imageUrl,
      language: selectedLanguage ? selectedLanguage.value : book ? book.language : 'en',
      titleLowerCase: values?.title?.toLowerCase(),
    };

    if (!book) {
      insertBookManually(parsedValues);
    } else {
      (parsedValues.authors = authors.length > 0 ? authors : book.authors),
        (parsedValues.authorsLowerCase =
          authors.length > 0 ? authors.map((a) => a?.toLowerCase()) : book.authorsLowerCase),
        updateBook(parsedValues);
    }
  };

  const insertBookManually = async (values) => {
    try {
      await call('insertBookManually', values);
      await getMyBooks();
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message="Book is added to your virtual shelf" />,
      });
      reset();
      setState({
        ...state,
        authors: [''],
        selectedImage: null,
        selectedLanguage: null,
      });
    } catch (error) {
      console.log(error);
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <Toast action="error" nativeId={id} message={error.message} title="Error" />
        ),
      });
    } finally {
      setState({
        ...state,
        isLoading: false,
      });
    }
  };

  const updateBook = async (values) => {
    try {
      await call('updateBook', book._id, values);
      await getMyBooks();
      toast.show({
        placement: 'top',
        render: ({ id }) => <Toast nativeId={id} message="Book is successfully updated" />,
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);
    } finally {
      setState({
        ...state,
        isLoading: false,
      });
    }
  };

  return (
    <Box mb={200} w="100%">
      <VStack p="$4" space="lg" w="100%">
        <Box>
          <Text mb="$1">{i18n.t('generic.image')}</Text>
          <Center>
            {(selectedImage || book?.imageUrl) && (
              <Image
                alt={book?.title || 'New book'}
                mb="$1"
                resizeMode="contain"
                source={{ uri: selectedImage?.uri || book?.imageUrl }}
                style={{ width: 200, height: 300 }}
              />
            )}
          </Center>
          <Select
            options={[
              { label: i18n.t('settings.pickPhoto'), value: 'library' },
              { label: i18n.t('settings.takePhoto'), value: 'camera' },
            ]}
            value={
              book?.imageUrl || selectedImage
                ? i18n.t('settings.replaceImage')
                : i18n.t('settings.pickOrTakePhoto')
            }
            placeholder={i18n.t('settings.pickOrTakeImage')}
            onValueChange={(value) => handleSelectImage(value)}
          />
        </Box>

        <Box>
          <Controller
            control={control}
            name="title"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Text mb="$1">{i18n.t('generic.title')}</Text>
                <Input bg="$white" variant="rounded">
                  <InputField mb="$1" value={value} onBlur={onBlur} onChangeText={onChange} />
                </Input>
              </Box>
            )}
          />
          {errors?.title && (
            <Text mt="$1" size="sm">
              {i18n.t('generic.titleRequired')}
            </Text>
          )}
        </Box>

        <Box>
          <Text mb="$0">{i18n.t('generic.authors')}</Text>
          {authors?.map((item, index) => (
            <Box key={authorsKeys[index]} mt="$2">
              <Box>
                <Text size="sm">
                  {i18n.t('generic.author')} {index + 1}
                </Text>
                <HStack>
                  <Input bg="$white" flex={1} variant="rounded">
                    <InputField
                      mb="$1"
                      value={item}
                      onChangeText={(value) => handleAuthorChange(value, index)}
                    />
                  </Input>
                  {index === 0 ? (
                    <Button
                      bg="$white"
                      borderRadius="$full"
                      ml="$4"
                      variant="outline"
                      width={24}
                      onPress={() => setState({ ...state, authors: [...authors, ''] })}
                    >
                      <ButtonIcon as={AddIcon} color="$blue700" />
                    </Button>
                  ) : index + 1 === authors.length ? (
                    <Button
                      bg="$white"
                      borderRadius="$full"
                      ml="$4"
                      variant="outline"
                      width={24}
                      onPress={() =>
                        setState({
                          ...state,
                          authors: authors.filter((a, i) => i !== index),
                        })
                      }
                    >
                      <ButtonIcon as={CloseIcon} color="$blue700" />
                    </Button>
                  ) : null}
                </HStack>
              </Box>
            </Box>
          ))}
        </Box>

        <Box>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Text mb="$1">{i18n.t('generic.category')}</Text>
                <Input bg="$white" variant="rounded">
                  <InputField mb="$1" value={value} onBlur={onBlur} onChangeText={onChange} />
                </Input>
              </Box>
            )}
          />
          {errors.category && (
            <Text mt="$1" size="sm">
              {errors.category}
            </Text>
          )}
        </Box>

        <Box>
          <Text mb="$1">{i18n.t('generic.language')}</Text>
          <Select
            options={allLanguages}
            placeholder={selectedLanguage?.label || 'Select'}
            onValueChange={(item) => handleSelectLanguage(item)}
          />
        </Box>

        <Box>
          <Controller
            control={control}
            name="ISBN"
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Text mb="$1">{i18n.t('generic.ISBN')}</Text>
                <Input bg="$white" variant="rounded">
                  <InputField mb="$1" value={value} onBlur={onBlur} onChangeText={onChange} />
                </Input>
              </Box>
            )}
          />
        </Box>

        <Box>
          <Controller
            control={control}
            name="publisher"
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Text mb="$1">{i18n.t('generic.publisher')}</Text>
                <Input bg="$white" variant="rounded">
                  <InputField mb="$1" value={value} onBlur={onBlur} onChangeText={onChange} />
                </Input>
              </Box>
            )}
          />
        </Box>

        <Box>
          <Controller
            control={control}
            name="publishedDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Text mb="$1">{i18n.t('generic.publishDate')}</Text>
                <Input bg="$white" variant="rounded">
                  <InputField mb="$1" value={value} onBlur={onBlur} onChangeText={onChange} />
                </Input>
              </Box>
            )}
          />
        </Box>

        <Box w="100%">
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Text mb="$1">{i18n.t('generic.description')}</Text>
                <Textarea bg="$white" variant="rounded">
                  <TextareaInput
                    placeholder={i18n.t('generic.descriptionPlaceholder')}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                </Textarea>
              </Box>
            )}
          />
        </Box>

        <Button isDisabled={isLoading} onPress={handleSubmit(onFormSubmit)} type="submit">
          {isLoading && <ButtonSpinner mr="$1" />}
          <ButtonText>{i18n.t('generic.submit')}</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
