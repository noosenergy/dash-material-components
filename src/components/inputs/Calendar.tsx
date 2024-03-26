import React from 'react';
import {Box} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {DashComponentProps} from 'props';

// Accepted format for parsing calendar dates
const dateFormat = 'yyyy-MM-dd';

/**
 * Calendar component
 */
const Calendar = ({
  id = 'calendar',
  labelText,
  helperText,
  width = '100%',
  margin = 2,
  maxDate = '2100-01-01',
  minDate = '1900-01-01',
  disableFuture = true,
  disablePast = false,
  selected = null,
  disableToolbar = false,
  disabled = false,
  setProps
}: CalendarProps) => {
  const handleCalendarChange = (value: Date) => {
    // Fire Dash-assigned callback
    if (value) {
      console.log(value);
      console.log(typeof value);
      const selected = value.toISOString().split('T')[0];
      setProps({selected});
    }
  };

  const calendarControls = {
    autoOk: true,
    disableToolbar: disableToolbar,
    value: new Date(selected),
    onChange: handleCalendarChange,
    format: dateFormat,
    maxDate: maxDate ? new Date(maxDate) : undefined,
    minDate: minDate ? new Date(minDate) : undefined,
    disableFuture: disableFuture,
    disablePast: disablePast
  };

  return (
    <Box id={id} m={margin} width={width}>
      <DatePicker
        label={labelText}
        slotProps={{
          textField: {
            helperText,
            id: `${id}-input`,
            variant: 'outlined',
            fullWidth: true
          }
        }}
        disabled={disabled}
        {...calendarControls}
      />
    </Box>
  );
};

type CalendarProps = {
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

export default Calendar;
