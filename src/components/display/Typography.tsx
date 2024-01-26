import React, {useState, useEffect} from 'react';
import {Box, Typography as MuiTypography, TypographyVariant} from '@mui/material';
import {DashComponentProps} from 'props';

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

type TypographyProps = {
  /** Typography HTML node type */
  component?: React.ElementType;
  /** Typography variant */
  variant?: TypographyVariant;
  /** Text to display */
  text?: string;
} & DashComponentProps;

export default Typography;
