import React from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

export default function BarcodeInputModal({
  styles,
  visible,
  barcodeInput,
  setBarcodeInput,
  onCancel,
  onLookup,
}) {
  if (!visible) return null;

  return (
    <View style={styles.barcodeInputModal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <View style={styles.barcodeInputContainer}>
          <Text style={styles.barcodeInputTitle}>Enter Barcode</Text>
          <Text style={styles.barcodeInputSubtitle}>
            Enter a barcode number to look up nutrition information
          </Text>
          <TextInput
            style={styles.barcodeInput}
            placeholder="e.g., 3017620422003"
            value={barcodeInput}
            onChangeText={setBarcodeInput}
            keyboardType="numeric"
            autoFocus={true}
          />
          <View style={styles.barcodeInputButtons}>
            <TouchableOpacity style={styles.barcodeCancelButton} onPress={onCancel}>
              <Text style={styles.barcodeCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.barcodeLookupButton} onPress={onLookup}>
              <Text style={styles.barcodeLookupButtonText}>Lookup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
