import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography as MuiTypography,
  TypographyTypeMap,
  TypographyVariant
} from '@mui/material';
import {DashComponentProps} from 'props';
import {DefaultComponentProps} from '@mui/material/OverridableComponent';

/**
 * Typography component from Material UI
 * https://mui.com/components/typography/
 */
const Typography = ({
  id = 'text',
  component = 'h6',
  variant = 'h6',
  text: initialText
}: TypographyProps) => {
  const [text, setText] = useState<string>(initialText);

  // Make sure state remain in sync with received props
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  // Render text
  return (
    <Box id={id}>
      <MuiTypography component={component} variant={variant} gutterBottom>
        {text}
      </MuiTypography>
    </Box>
  );
};

// TypeScript props type
type TypographyProps = {
  /** Typography HTML node type */
  component?: React.ElementType;
  /** Typography variant */
  variant?: TypographyVariant;
  /** Text to display */
  text?: string;
} & DashComponentProps;

// PropTypes for runtime type checking
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
  text: PropTypes.string
};

// Default props
Typography.defaultProps = {};

export default Typography;
