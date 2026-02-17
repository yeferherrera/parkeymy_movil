import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface ActionCardProps {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
  style?: ViewStyle;
}

export default function ActionCard({
  icon,
  label,
  onPress,
  danger = false,
  style,
}: ActionCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        danger && styles.cardDanger,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <FontAwesome5
        name={icon}
        size={22}
        color={danger ? '#DC2626' : '#004C97'}
      />
      <Text style={[styles.cardText, danger && styles.cardTextDanger]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 26,
    alignItems: 'center',
    gap: 10,
    elevation: 3,
  },

  cardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#004C97',
  },

  cardDanger: {
    backgroundColor: '#FEF2F2',
  },

  cardTextDanger: {
    color: '#DC2626',
  },
});
