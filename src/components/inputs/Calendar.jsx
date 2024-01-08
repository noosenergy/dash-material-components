import React from 'react';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import {DatePicker} from '@material-ui/pickers';

// Accepted format for parsing calendar dates
const dateFormat = 'yyyy-MM-dd';

/**
 * Calendar component
 */
const Calendar = (props) => {
  const {
    id,
    labelText,
    helperText,
    width,
    margin,
    maxDate,
    minDate,
    disableFuture,
    disablePast,
    selected,
    disableToolbar,
    disabled,
    setProps
  } = props;

  const handleCalendarChange = (value) => {
    // Fire Dash-assigned callback
    if (value) {
      setProps({selected: value.toISOString().split('T')[0]});
    }
  };

  const calendarControls = {
    autoOk: true,
    disableToolbar: disableToolbar,
    value: selected,
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
        id={`${id}-input`}
        label={labelText}
        helperText={helperText}
        variant="inline"
        inputVariant="outlined"
        fullWidth
        disabled={disabled}
        {...calendarControls}
      />
    </Box>
  );
};

Calendar.defaultProps = {
  id: 'calendar',
  width: '100%',
  margin: 2,
  maxDate: '2100-01-01',
  minDate: '1900-01-01',
  disableFuture: true,
  disablePast: false,
  selected: null,
  disableToolbar: false,
  disabled: false
};

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

export default Calendar;
