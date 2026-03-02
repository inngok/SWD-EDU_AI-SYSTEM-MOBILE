import { View } from 'react-native';
import { cn } from '../lib/utils';

export const ProgressBar = ({ percent, className, barClassName }) => (
    <View className={cn("h-1.5 bg-gray-100 rounded-full overflow-hidden", className)}>
        <View
            className={cn("h-full bg-primary rounded-full", barClassName)}
            style={{ width: `${percent}%` }}
        />
    </View>
);
