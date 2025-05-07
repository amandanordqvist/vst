import React from 'react';
import { StyleSheet, View, Text, ScrollView, TextStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import SailorExample from '@/components/SailorExample';

// Convert typography styles to comply with TextStyle requirements
const typographyStyles = {
  h2: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight as TextStyle['fontWeight'],
    color: typography.h2.color,
    letterSpacing: typography.h2.letterSpacing,
    lineHeight: typography.h2.lineHeight,
  },
};

export default function DesignSystemScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.colorSection}>
        <Text style={[typographyStyles.h2, styles.sectionTitle]}>Sailor Luxe Color Palette</Text>
        
        <View style={styles.colorRow}>
          <ColorSwatch color={Colors.primary} name="Primary (Navy)" hex="#0A2A5E" />
          <ColorSwatch color={Colors.secondary} name="Secondary" hex="#70A1FF" />
          <ColorSwatch color={Colors.accent} name="Accent" hex="#F4C95D" />
        </View>
        
        <View style={styles.colorRow}>
          <ColorSwatch color={Colors.textPrimary} name="Text Primary" hex="#1F2937" />
          <ColorSwatch color={Colors.textSecondary} name="Text Secondary" hex="#6B7280" />
          <ColorSwatch color={Colors.background} name="Background" hex="#F6F9FC" />
        </View>
        
        <View style={styles.colorRow}>
          <ColorSwatch color={Colors.success} name="Success" hex="#10B981" />
          <ColorSwatch color={Colors.warning} name="Warning" hex="#F59E0B" />
          <ColorSwatch color={Colors.error} name="Error" hex="#EF4444" />
        </View>
      </View>
      
      <SailorExample />
    </ScrollView>
  );
}

// Helper component to display color swatches
function ColorSwatch({ color, name, hex }: { color: string, name: string, hex: string }) {
  return (
    <View style={styles.swatch}>
      <View style={[styles.colorPreview, { backgroundColor: color }]} />
      <Text style={styles.colorName}>{name}</Text>
      <Text style={styles.colorHex}>{hex}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  colorSection: {
    padding: 16,
  },
  sectionTitle: {
    marginVertical: 16,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  swatch: {
    alignItems: 'center',
    width: '30%',
  },
  colorPreview: {
    height: 60,
    width: '100%',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  colorName: {
    fontSize: 14,
    fontWeight: '600' as TextStyle['fontWeight'],
    marginBottom: 4,
  },
  colorHex: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
}); 