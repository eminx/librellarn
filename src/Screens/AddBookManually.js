import React, { useState } from "react";
import { ScrollView } from "react-native";
import { useToast } from "@gluestack-ui/themed";

import BookForm from "../Components/BookForm";
import Toast from "../Components/Toast";
import { call } from "../utils/functions";

export default function AddBookManually() {
  const [state, setState] = useState({
    isLoading: false,
  });
  const { isLoading } = state;
  const toast = useToast();

  const insertBookManually = async (values) => {
    try {
      await call("insertBookManually", values);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast nativeId={id} message="Book is added to your virtual shelf" />
        ),
      });
    } catch (error) {
      console.log(error);
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toast
            action="error"
            nativeId={id}
            message={error.message}
            title="Error"
          />
        ),
      });
    } finally {
      setState({
        isLoading: false,
      });
    }
  };

  return (
    <ScrollView>
      <BookForm isLoading={isLoading} onSubmit={insertBookManually} />
    </ScrollView>
  );
}
