import filter from 'lodash/filter';
import React, { useRef, useState } from 'react';
import { View, ViewStyle, TextStyle, StyleProp, FlatList } from 'react-native';

import { Theme, MarkingTypes } from '../../../types';
import { extractComponentProps } from '../../../componentUpdater';
import styleConstructor from './style';
import Dot, { DotProps } from '../dot';

export enum Markings {
  DOT = 'dot',
  MULTI_DOT = 'multi-dot',
  PERIOD = 'period',
  MULTI_PERIOD = 'multi-period',
  CUSTOM = 'custom'
}

type CustomStyle = {
  container?: ViewStyle;
  text?: TextStyle;
};

type DOT = {
  key?: string;
  color: string;
  selectedDotColor?: string;
};

type PERIOD = {
  color: string;
  startingDay?: boolean;
  endingDay?: boolean;
};

export interface MarkingProps extends DotProps {
  type?: MarkingTypes;
  theme?: Theme;
  selected?: boolean;
  marked?: boolean;
  today?: boolean;
  disabled?: boolean;
  inactive?: boolean;
  disableTouchEvent?: boolean;
  activeOpacity?: number;
  textColor?: string;
  selectedColor?: string;
  selectedTextColor?: string;
  customTextStyle?: StyleProp<TextStyle>;
  customContainerStyle?: StyleProp<ViewStyle>;
  dotColor?: string;
  //multi-dot
  dots?: DOT[];
  //multi-period
  periods?: PERIOD[];
  startingDay?: boolean;
  endingDay?: boolean;
  accessibilityLabel?: string;
  customStyles?: CustomStyle;
}

const Marking = (props: MarkingProps) => {
  const { theme, type, dots, periods, selected, dotColor } = props;
  const style = useRef(styleConstructor(theme));
  const [width, setWidth] = useState(0)
  const [widthItem, setWidthItem] = useState(0)
  const [rotateValue, setRotateValue] = useState(0)
  const getItems = (items?: DOT[] | PERIOD[]) => {
    if (items && Array.isArray(items) && items.length > 0) {
      // Filter out items so that we process only those which have color property
      const validItems = filter(items, function (o: DOT | PERIOD) {
        return o.color;
      });

      return validItems.map((item, index) => {
        return type === Markings.MULTI_DOT ? renderDot(index, item) : renderPeriod(index, item);
      });
    }
  };

  const onPageLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setWidth(width)
    setWidthItem((width / ((width / 4) | 0)))
    setRotateValue(((180 * Math.atan((width / ((width / 4) | 0)) / 8)) / (Math.PI)))
  };

  const renderMarkingByType = () => {
    switch (type) {
      case Markings.MULTI_DOT:
        return renderMultiMarkings(style.current.dots, dots);
      case Markings.MULTI_PERIOD:
        return renderMultiMarkings(style.current.periods, periods);
      default:
        return renderDot();
    }
  };

  const renderMultiMarkings = (containerStyle: object, items?: DOT[] | PERIOD[]) => {
    return <View style={[containerStyle,]}>{getItems(items)}</View>;
  };

  const renderPeriod = (index: number, item: any) => {
    const { color, startingDay, endingDay, isWaiting } = item;
    const styles = [
      style.current.period,
      {
        backgroundColor: color
      },
    ];
    if (startingDay) {
      styles.push(style.current.startingDay);
    }
    if (endingDay) {
      styles.push(style.current.endingDay);
    }
    return (<View onLayout={onPageLayout} style={[style.current.waiting, { borderColor: color, backgroundColor: isWaiting ? "white" : color },
    startingDay ? style.current.startingDay : {},
    endingDay ? style.current.endingDay : {}]}>
      <FlatList
        data={[1, 1, 2, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]}
        horizontal
        renderItem={({ }) => (
          <View style={{ width: 1, height: Math.sqrt(8 * 8 + widthItem * widthItem) || 0, transform: [{ rotate: `${rotateValue}deg` }], backgroundColor: color, marginLeft: widthItem || 0 }} />
        )}
      />
    </View>);
  };

  const renderDot = (index?: number, item?: any) => {
    const dotProps = extractComponentProps(Dot, props);
    let key = index;
    let color = dotColor;

    if (item) {
      if (item.key) {
        key = item.key;
      }
      color = selected && item.selectedDotColor ? item.selectedDotColor : item.color;
    }

    return <Dot {...dotProps} key={key} color={color} />;
  };

  return renderMarkingByType();
};

export default Marking;
Marking.displayName = 'Marking';
Marking.markings = Markings;
