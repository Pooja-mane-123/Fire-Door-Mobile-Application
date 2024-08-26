import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {COLORS, SPACING, FONTFAMILY, FONTSIZE} from '@src/theme';
import LoadingScreen from '../loader';

const DeleteModal = ({isVisible, onClose, onConfirm, loading}) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      {loading && <LoadingScreen />}
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Delete Confirmation</Text>
        <Text style={styles.message}>
          Are you sure you want to delete this item?
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onConfirm}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: COLORS.secondaryGreyHex,
    borderRadius: 10,
    padding: SPACING.space_20,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTSIZE.size_20,
    fontFamily: FONTFAMILY.poppins_bold,
    color: COLORS.primaryWhiteRgb,
    marginBottom: SPACING.space_10,
  },
  message: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.primaryWhiteRgb,
    textAlign: 'center',
    marginBottom: SPACING.space_20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: COLORS.primaryBlueHex,
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: COLORS.primaryWhiteRgb,
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.poppins_medium,
  },
  deleteButton: {
    backgroundColor: COLORS.primaryRoseRedHex,
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: COLORS.primaryWhiteRgb,
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.poppins_medium,
  },
});

export default DeleteModal;
