import { View } from 'react-native';
import { cn } from '../lib/utils';

export const Card = ({ children, className }) => (
    <View className={cn("bg-white rounded-2xl border border-gray-100 p-5 shadow-sm", className)}>
        {children}
    </View>
);
