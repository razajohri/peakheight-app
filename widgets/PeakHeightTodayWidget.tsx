import { HStack, Image, Text, VStack } from '@expo/ui/swift-ui';
import { background, cornerRadius, font, foregroundStyle, padding } from '@expo/ui/swift-ui/modifiers';
import { createWidget, WidgetBase } from 'expo-widgets';

type PeakHeightTodayProps = {
  title?: string;
  headline?: string;
  subheadline?: string;
  progressLabel?: string;
};

type PeakHeightTodayWidgetProps = WidgetBase<PeakHeightTodayProps>;

const PeakHeightToday = (props: PeakHeightTodayWidgetProps) => {
  'widget';

  const {
    title = 'PeakHeight',
    headline = 'Today’s growth focus',
    subheadline = 'Lower Body Decompression',
    progressLabel = 'Done for today',
  } = props;

  return (
    <VStack
      modifiers={[
        background('#050814'),
        cornerRadius(22),
        padding({ all: 16 }),
      ]}
    >
      <HStack>
        <Image systemName="circle.fill" color="#22C55E" />
        <Text
          modifiers={[
            font({ weight: 'medium', size: 12 }),
            foregroundStyle('#9CA3AF'),
          ]}
        >
          {title.toUpperCase?.() ?? title}
        </Text>
      </HStack>

      <Text
        modifiers={[
          font({ weight: 'bold', size: 20 }),
          foregroundStyle('#FFFFFF'),
        ]}
      >
        {headline}
      </Text>

      <Text
        modifiers={[
          font({ size: 12 }),
          foregroundStyle('#9CA3AF'),
        ]}
      >
        {subheadline}
      </Text>

      {progressLabel && (
        <Text
          modifiers={[
            font({ weight: 'bold', size: 12 }),
            foregroundStyle('#4ADE80'),
            background('#022C22'),
            cornerRadius(999),
            padding({ all: 6 }),
          ]}
        >
          {progressLabel}
        </Text>
      )}
    </VStack>
  );
};

export default createWidget('PeakHeightToday', PeakHeightToday);

