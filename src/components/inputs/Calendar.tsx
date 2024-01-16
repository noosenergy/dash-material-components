import React from 'react';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {DashComponentProps} from 'props';
import {parseISO} from 'date-fns';

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
  const handleCalendarChange = (value) => {
    // Fire Dash-assigned callback
    if (value) {
      const selected = value.toISOString().split('T')[0];
      setProps({selected});
    }
  };

  const calendarControls = {
    autoOk: true,
    disableToolbar: disableToolbar,
    value: parseISO(selected),
    onChange: handleCalendarChange,
    format: dateFormat,
    maxDate: maxDate ? parseISO(maxDate) : undefined,
    minDate: minDate ? parseISO(minDate) : undefined,
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

// TypeScript props type
type CalendarProps = {
  labelText?: string;
  helperText?: string;
  width?: string | number;
  margin?: string | number;
  maxDate?: string;
  minDate?: string;
  disableFuture?: boolean;
  disablePast?: boolean;
  selected?: string | null;
  disableToolbar?: boolean;
  disabled?: boolean;
} & DashComponentProps;

Calendar.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Text to display in the calendar form */
  labelText: PropTypes.string,

  /** Text to display under the calendar form */
  helperText: PropTypes.string,

  /** Width of calendar form */
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Margin */
  margin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Latest date available in the calendar */
  maxDate: PropTypes.string,

  /** Earliest date available in the calendar */
  minDate: PropTypes.string,

  /** Disable future dates */
  disableFuture: PropTypes.bool,

  /** Disable past dates */
  disablePast: PropTypes.bool,

  /** Active date selection */
  selected: PropTypes.string,

  /** Disable toolbar */
  disableToolbar: PropTypes.bool,

  /** Disable the whole component */
  disabled: PropTypes.bool
};

Calendar.defaultProps = {};

export default Calendar;
