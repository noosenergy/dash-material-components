import React from 'react';
import PropTypes from 'prop-types';
import {Box} from '@material-ui/core';
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
    maxDate,
    minDate,
    disableFuture,
    disablePast,
    selected,
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
    disableToolbar: true,
    value: selected,
    onChange: handleCalendarChange,
    format: dateFormat,
    maxDate: maxDate ? new Date(maxDate) : undefined,
    minDate: minDate ? new Date(minDate) : undefined,
    disableFuture: disableFuture,
    disablePast: disablePast
  };

  return (
    <Box id={id} m={2} width={width}>
      <DatePicker
        id={`${id}-input`}
        label={labelText}
        helperText={helperText}
        variant="inline"
        inputVariant="outlined"
        {...calendarControls}
      />
    </Box>
  );
};

Calendar.defaultProps = {
  id: 'calendar',
  width: '100%',
  maxDate: '2100-01-01',
  minDate: '1900-01-01',
  disableFuture: true,
  disablePast: false,
  selected: null
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

  /** Latest date available in the calendar */
  maxDate: PropTypes.string,

  /** Earliest date available in the calendar */
  minDate: PropTypes.string,

  /** Disable future dates */
  disableFuture: PropTypes.bool,

  /** Disable past dates */
  disablePast: PropTypes.bool,

  /** Active date selection */
  selected: PropTypes.string
};

export default Calendar;
