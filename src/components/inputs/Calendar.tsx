import React, {memo, Suspense} from 'react';
import {asyncDecorator} from '@plotly/dash-component-plugins';
import calendar from '../../utils/LazyLoader/Calendar';
import {DashComponentProps} from 'props';

type CalendarPropsType = {
  /** The label text displayed for the calendar input */
  labelText?: string;
  /** The helper text that appears below the calendar input */
  helperText?: string;
  /** Width of the calendar box (CSS value as string or number) */
  width?: string | number;
  /** Margin around the calendar box (CSS value as string or number) */
  margin?: string | number;
  /** The maximum date that can be selected, in 'yyyy-MM-dd' format */
  maxDate?: string;
  /** The minimum date that can be selected, in 'yyyy-MM-dd' format */
  minDate?: string;
  /** If true, future dates will be disabled */
  disableFuture?: boolean;
  /** If true, past dates will be disabled */
  disablePast?: boolean;
  /** The currently selected date, in 'yyyy-MM-dd' format */
  selected?: string | null;
  /** If true, the toolbar of the DatePicker will be hidden */
  disableToolbar?: boolean;
  /** If true, the calendar input will be disabled */
  disabled?: boolean;
} & DashComponentProps;

/**
 * Calendar component
 *
 * Wrapper for the lazy loaded calendar component
 */
const Calendar = (props: CalendarPropsType) => {
  return <ControlledCalendar {...props} />;
};

// Async-decorated version (internal)
const RealCalendar = asyncDecorator(Calendar, () =>
  Promise.all([calendar()]).then(([calendar]) => calendar)
);

// Controlled version with Suspense (internal)
const ControlledCalendar = memo<CalendarPropsType>((props) => {
  const {id, className} = props;

  const extendedClassName = className ? 'dash-calendar ' + className : 'dash-calendar';

  return (
    <Suspense
      fallback={
        <div id={id} key={id} className={`${extendedClassName} dash-calendar--pending`}>
          Loading calendar...
        </div>
      }
    >
      <RealCalendar {...props} className={extendedClassName} />
    </Suspense>
  );
});

// Mandatory for memoization debugging
ControlledCalendar.displayName = 'ControlledCalendar';

// Export the original component AND the types
export default Calendar;
export type {CalendarPropsType};
