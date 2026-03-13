import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';

export default function CachedImage({ source, style, resizeMode = 'cover', priority }) {
  // Default to common image sizes, will be updated via onLayout
  const [dimensions, setDimensions] = useState({ width: 90, height: 90 });

  // Try to extract dimensions from style if available (for immediate render)
  useEffect(() => {
    if (style) {
      // Handle both object styles and array of styles
      const styleObj = Array.isArray(style) ? Object.assign({}, ...style) : style;
      const width = styleObj?.width;
      const height = styleObj?.height;
      if (typeof width === 'number' && typeof height === 'number') {
        setDimensions({ width, height });
      }
    }
  }, [style]);

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setDimensions({ width, height });
    }
  };

  if (source && source.svg) {
    const SvgComp = source.svg;
    // SVG components from react-native-svg-transformer need explicit dimensions
    // Use onLayout to get actual container size, fallback to style dimensions or defaults
    return (
      <View style={style} pointerEvents="none" onLayout={handleLayout}>
        <SvgComp 
          width={dimensions.width} 
          height={dimensions.height}
          style={{ width: dimensions.width, height: dimensions.height }}
        />
      </View>
    );
  }
  if (source && source.image) {
    const zoom = typeof source.zoom === 'number' ? source.zoom : 1;
    return (
      <View style={[style, { overflow: 'hidden' }]}>
        <Image source={source.image} style={{ width: '100%', height: '100%', transform: [{ scale: zoom }] }} resizeMode={resizeMode} />
      </View>
    );
  }
  return <Image source={source} style={style} resizeMode={resizeMode} />;
}
