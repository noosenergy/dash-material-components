import React, {useState, useEffect} from 'react';
import {Box, SxProps, Typography as MuiTypography, TypographyVariant} from '@mui/material';
import {Theme} from '@mui/material/styles';
import {DashComponentProps} from 'props';

type VariantStyleMap = Partial<Record<TypographyVariant, SxProps<Theme>>>;

// Per-variant accent treatments that follow the theme's design language:
// h1 → gold accent bar (matches card borderLeft / table header borderBottom)
// h2 → subtle divider underline
// h3 → muted secondary color
const VARIANT_STYLES: VariantStyleMap = {
  h1: {
    position: 'relative',
    pb: 1.5,
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 32,
      height: 3,
      borderRadius: 1,
      bgcolor: 'secondary.main'
    }
  },
  h2: {
    pb: 0.5,
    borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`
  },
  h3: {
    color: 'text.secondary'
  }
};

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

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  return (
    <Box id={id}>
      <MuiTypography
        component={component}
        variant={variant}
        gutterBottom
        sx={VARIANT_STYLES[variant]}
      >
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
