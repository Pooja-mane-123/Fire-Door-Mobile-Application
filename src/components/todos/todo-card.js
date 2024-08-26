import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, SPACING} from '@src/theme';
import {useNavigation} from '@react-navigation/native';

const TodoCard = ({todo}) => {
  const navigation = useNavigation();

  const navigateToDetailScreen = id => {
    navigation.navigate('detailtodo', {id});
  };
  return (
    <TouchableOpacity
      style={styles.CardContainer}
      onPress={() => navigateToDetailScreen(todo.id)}>
      <Text style={styles.TodoTitle}>{todo.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  CardContainer: {
    backgroundColor: COLORS.secondaryGreyHex,
    paddingVertical: SPACING.space_8,
    paddingHorizontal: SPACING.space_15,
    marginBottom: SPACING.space_15,
    borderRadius: 10,
  },

  TodoTitle: {
    color: COLORS.primaryWhiteRgb,
    fontFamily: FONTFAMILY.poppins_medium,
  },
});
export default TodoCard;
