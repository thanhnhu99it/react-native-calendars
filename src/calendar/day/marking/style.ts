import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';
import {Theme} from '../../../types';

export default function styleConstructor(theme: Theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    dots: {
      flexDirection: 'row'
    },
    periods: {
      alignSelf: 'stretch'
    },
    period: {
      height: 4,
      marginVertical: 1,
      backgroundColor: appStyle.dotColor
    },
    startingDay: {
      borderTopLeftRadius: 5, 
      borderBottomLeftRadius: 5, 
      borderLeftWidth: 1
    },
    endingDay: {
      borderTopRightRadius: 5, 
      borderBottomRightRadius: 5, 
      borderRightWidth: 1
    },
    waiting: {
      flexDirection: 'row', 
      borderTopWidth: 1, 
      borderBottomWidth: 1, 
      height: 8, 
      borderLeftWidth: 0, 
      borderRightWidth: 0, 
      marginTop: 5
    },
    // @ts-expect-error
    ...(theme['stylesheet.marking'] || {})
  });
}
