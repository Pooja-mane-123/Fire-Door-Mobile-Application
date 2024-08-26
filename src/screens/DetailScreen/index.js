import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '@src/theme';
import {DeleteTodoById} from '@src/redux/thunks/todosThunk';
import DeleteModal from '@src/components/todos/delete-modal';
import {setUpdateTodoId} from '@src/redux/slices/todosSlice';

const DetailTodoScreen = () => {
  // ==> Redux State
  const todoData = useSelector(state => state?.todo);

  // ==> Hooks
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const {id} = route.params;

  // ==> Local Component State
  const [detailTodoInfo, setDetailTodoInfo] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);

  // ==> Component Life Cycle Methods
  useEffect(() => {
    getTodoById();
  }, [id]);

  // ==> Check for id
  if (!id) {
    navigation.navigate('home');
  }

  // ==> Get Todo By Id
  const getTodoById = () => {
    const findTodo = todoData?.todos?.find(todo => todo.id === id);
    if (findTodo) {
      setDetailTodoInfo(findTodo);
    }
  };

  // ==>  Delete Todo By Id
  const deleteTodoById = async () => {
    const deleteResponse = await dispatch(DeleteTodoById({id}));

    if (deleteResponse) {
      navigation.goBack();
      setModalVisible(false);
    }
  };

  // ==> Update Todo
  const updateTodo = () => {
    dispatch(setUpdateTodoId({id}));
    navigation.navigate('Add');
  };

  return (
    <SafeAreaView style={styles.SafeAreaViewFlex}>
      <ScrollView contentContainerStyle={styles.ScrollViewFlex}>
        {/* ==> Header */}
        <View style={styles.TodoTitleParentContainer}>
          <View style={styles.TodoTitleTextContainer}>
            <Text style={styles.TodoTitleText}>{detailTodoInfo?.title}</Text>
          </View>

          {/* ==> Delete Button */}
          <TouchableOpacity
            style={styles.DeleteIconContainer}
            onPress={() => setModalVisible(true)}>
            <MaterialIcons
              name="delete"
              size={30}
              color={COLORS.primaryRoseRedHex}
            />
          </TouchableOpacity>
        </View>

        {/* ==> Description */}
        <View style={styles.TodoDesciptionContainer}>
          <Text style={styles.DescriptionText}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lorem Ipsum is simply dummy text of
            the printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type
            specimen book. It has survived not only five centuries, but also the
            leap into electronic typesetting, remaining essentially unchanged.
            It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages,
          </Text>
        </View>

        {/* ==> Update Todo */}
        <TouchableOpacity
          style={styles.Button}
          onPress={() => {
            updateTodo(detailTodoInfo.id);
          }}>
          <Text style={styles.ButtonText}>Update Todo</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ==> Delete  Modal */}
      <DeleteModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={deleteTodoById}
        loading={todoData?.loading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SafeAreaViewFlex: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackRgb,
  },

  ScrollViewFlex: {
    flexGrow: 1,
    paddingHorizontal: SPACING.space_24,
  },

  TodoTitleParentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.space_30,
  },

  TodoTitleTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },

  TodoTitleText: {
    color: COLORS.primaryWhiteRgb,
    flexWrap: 'wrap',
    fontFamily: FONTFAMILY.poppins_bold,
    fontSize: FONTSIZE.size_24,
  },

  DeleteIconContainer: {
    padding: SPACING.space_10,
  },

  TodoDesciptionContainer: {
    marginTop: SPACING.space_18,
  },

  DescriptionText: {
    color: COLORS.primaryWhiteRgb,
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.poppins_regular,
    textAlign: 'justify',
  },

  Button: {
    backgroundColor: COLORS.primaryBlueHex,
    padding: SPACING.space_15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: SPACING.space_28,
  },

  ButtonText: {
    color: COLORS.primaryWhiteRgb,
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_medium,
  },
});

export default DetailTodoScreen;
