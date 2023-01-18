import {View, Modal, StyleSheet} from 'react-native';
import React from 'react';

interface ICampaignModalProps {
  visible: boolean;
  children: React.ReactNode;
}

export default function CampaignModal({
  visible,
  children,
}: ICampaignModalProps) {
  return (
    <Modal visible={visible}>
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer]}>{children}</View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    elevation: 20,
  },
});
