import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { categories } from '../constants/categories';

interface CategoryPickerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (category: string, subItem: string) => void;
}

export function CategoryPicker({ isVisible, onClose, onSelect }: CategoryPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const renderCategory = ({ item: category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === category.id && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Text style={[
        styles.categoryName,
        selectedCategory === category.id && styles.selectedCategoryText,
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSubItem = ({ item: subItem }) => {
    const category = categories.find(c => c.id === selectedCategory);
    if (!category) return null;

    return (
      <TouchableOpacity
        style={styles.subItemButton}
        onPress={() => {
          onSelect(category.name, subItem.name);
          onClose();
        }}
      >
        <Text style={styles.subItemText}>{subItem.name}</Text>
      </TouchableOpacity>
    );
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Category</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <View style={styles.categoriesList}>
              <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>

            <View style={styles.subItemsList}>
              {selectedCategoryData && (
                <FlatList
                  data={selectedCategoryData.items}
                  renderItem={renderSubItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000000',
  },
  closeButton: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#007AFF',
  },
  pickerContainer: {
    flexDirection: 'row',
    height: 400,
  },
  categoriesList: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    paddingRight: 16,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  subItemsList: {
    flex: 1.5,
    paddingLeft: 16,
  },
  subItemButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  subItemText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#000000',
  },
});