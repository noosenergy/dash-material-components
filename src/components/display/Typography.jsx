import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Box, Typography as MuiTypography} from '@mui/material';

/**
 * Typography component from Material UI
 * https://mui.com/components/typography/
 */
const Typography = (props) => {
  const {id, component, variant, text: initialText} = props;
  const [text, setText] = useState(initialText);

  // Make sure state remain in sync with received props
  useEffect(() => setText(initialText), [initialText]);

  // Render text
  return (
    <Box id={id}>
      <MuiTypography component={component} variant={variant} gutterBottom>
        {text}
      </MuiTypography>
    </Box>
  );
};

Typography.defaultProps = {
  id: 'text',
  component: 'h6',
  variant: 'h6'
};

Typography.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Typography HTML node type */
  component: PropTypes.string,

  /** Typography variant */
  variant: PropTypes.string,

  /** Text to display */
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Typography;
