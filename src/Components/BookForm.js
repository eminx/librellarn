import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  AddIcon,
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  CloseIcon,
  HStack,
  Image,
  Input,
  InputField,
  LoaderIcon,
  Text,
  Textarea,
  TextareaInput,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
import * as ImagePicker from 'expo-image-picker';
import { S3 } from 'aws-sdk';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

import allLanguages from '../utils/langs/allLanguages';
import ActionSheet from './ActionSheet';
import Toast from './Toast';
import { call } from '../utils/functions';
import { awsParams } from '../../private';

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
    pickerVisible: false,
    selectedLanguage: book ? allLanguages.find((l) => l.value === book.language) : null,
    selectedImage: null,
    selectImageButtonLoading: false,
  });

  const {
    authors,
    isLoading,
    pickerVisible,
    selectedLanguage,
    selectedImage,
    selectImageButtonLoading,
  } = state;

  const handleAuthorChange = (value, index) => {
    const newAuthors = authors.map((item, i) => (i === index ? value : item));
    setState({
      ...state,
      authors: newAuthors,
    });
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
    // aspact ratio: 2/3 (width/height)
    const cropDimensions =
      image.width >= image.height
        ? {
            height: image.height,
            width: (image.height * 2) / 3,
            originX: image.height / 3,
            originY: 0,
          }
        : {
            height: (image.width * 2) / 3,
            width: image.width,
            originX: 0,
            originY: image.width / 3,
          };

    return await manipulateAsync(
      image.uri,
      [
        { crop: cropDimensions },
        {
          resize: {
            width: 300,
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

    const resizedImage = selectedImage && (await resizeImage(selectedImage?.assets[0]));
    const imageUrl = selectedImage ? await uploadImage(resizedImage.uri) : values.imageUrl;

    const parsedValues = {
      ...values,
      authors,
      authorsLowerCase: authors?.map((a) => a?.toLowerCase()),
      categoryLowerCase: values.category?.toLowerCase(),
      imageUrl,
      language: selectedLanguage ? selectedLanguage.value : book ? book.language : 'en',
      titleLowerCase: values.title?.toLowerCase(),
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
          <Controller
            control={control}
            name="title"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Text mb="$1">Title</Text>
                <Input bg="$white" variant="rounded">
                  <InputField value={value} onBlur={onBlur} onChangeText={onChange} />
                </Input>
              </Box>
            )}
          />
          {errors.title && (
            <Text mt="$1" size="sm">
              Title is required
            </Text>
          )}
        </Box>

        <Box>
          <Text mb="$0">Authors</Text>
          {authors?.map((item, index) => (
            <Box key={authorsKeys[index]} mt="$2">
              <Box>
                <Text size="sm">Author {index + 1}</Text>
                <HStack>
                  <Input bg="$white" flex={1} variant="rounded">
                    <InputField
                      value={item}
                      onChangeText={(value) => handleAuthorChange(value, index)}
                    />
                  </Input>
                  {index === 0 ? (
                    <Button
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
                <Text mb="$1">Category</Text>
                <Input bg="$white" variant="rounded">
                  <InputField value={value} onBlur={onBlur} onChangeText={onChange} />
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
          <Text mb="$1">Language</Text>
          <Button
            action="secondary"
            bg="$white"
            borderRadius="$full"
            color="$gray"
            variant="outline"
            onPress={() => setState({ ...state, pickerVisible: true })}
          >
            <ButtonText>{selectedLanguage?.label || book?.language?.label || 'Select'}</ButtonText>
          </Button>
        </Box>

        <Box>
          <Controller
            control={control}
            name="ISBN"
            render={({ field: { onChange, onBlur, value } }) => (
              <Box>
                <Text mb="$1">ISBN</Text>
                <Input bg="$white" variant="rounded">
                  <InputField value={value} onBlur={onBlur} onChangeText={onChange} />
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
                <Text mb="$1">Publisher</Text>
                <Input bg="$white" variant="rounded">
                  <InputField value={value} onBlur={onBlur} onChangeText={onChange} />
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
                <Text mb="$1">Publication date</Text>
                <Input bg="$white" variant="rounded">
                  <InputField value={value} onBlur={onBlur} onChangeText={onChange} />
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
                <Text mb="$1">Description</Text>
                <Textarea bg="$white" variant="rounded">
                  <TextareaInput
                    placeholder="Detailed description..."
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                </Textarea>
              </Box>
            )}
          />
        </Box>

        <Center>
          {(selectedImage || book?.imageUrl) && (
            <Image
              source={{ uri: selectedImage?.assets[0]?.uri || book?.imageUrl }}
              style={{ width: 200, height: 300 }}
            />
          )}
        </Center>

        <Box>
          <Button
            bg="$white"
            isDisabled={selectImageButtonLoading}
            variant="outline"
            onPress={pickImageAsync}
          >
            <ButtonText>{selectedImage ? 'Replace Image' : 'Pick or Take Image'}</ButtonText>
            {selectImageButtonLoading && <ButtonIcon as={LoaderIcon} ml="$4" />}
          </Button>
        </Box>

        <Button isDisabled={isLoading} onPress={handleSubmit(onFormSubmit)} type="submit">
          <ButtonText>Submit</ButtonText>
          {isLoading && <ButtonIcon as={LoaderIcon} ml="$4" />}
        </Button>
      </VStack>

      <ActionSheet
        isOpen={pickerVisible}
        options={allLanguages}
        onClose={() => setState({ ...state, pickerVisible: false })}
        onPress={(value) =>
          setState({
            ...state,
            pickerVisible: false,
            selectedLanguage: value,
          })
        }
      />
    </Box>
  );
}
