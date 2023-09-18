import React from "react";
import { ScrollView } from "react-native";
import { Text } from "@gluestack-ui/themed";

import BookForm from "../Components/BookForm";
import ConfirmDialog from "../Components/ConfirmDialog";

export default function MyBookEdit({ route, navigation }) {
  const { book } = route.params;

  const updateBook = async (values) => {
    try {
      await call("updateBook", book._id, values);
      await getBook();
      successDialog("Your book is successfully updated");
      setIsEditDialogOpen(false);
    } catch (error) {
      console.log(error);
      errorDialog(error.reason || error.error);
    } finally {
      setState({
        isLoading: false,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await call("removeBook", id);
      successDialog("Your book is successfully deleted");
      navigate(`/${currentUser?.username}`);
    } catch (error) {
      errorDialog(error);
    }
  };

  return (
    <ScrollView>
      <BookForm book={book} navigation={navigation} onSubmit={updateBook} />
      <ConfirmDialog
        header="Are you sure?"
        onClose={() => setState({ ...state })}
      >
        <Text>{`Please confirm that you want to borrow this book. When you confirm, there will be a new message section opening a new dialogue with ${book.ownerUsername}. So you can communicate with them about the details of receiving the book.`}</Text>
      </ConfirmDialog>
    </ScrollView>
  );
}
