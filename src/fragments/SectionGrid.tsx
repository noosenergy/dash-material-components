import React from 'react';
import {Grid} from '@mui/material';
import {DashComponentProps} from 'props';
import {css} from '@emotion/react';

const sectionInColumnStyle = css`
  max-height: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`;

const sectionInRowStyle = css`
  max-width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`;

const SectionGrid = ({id = 'section', children, size, orientation = 'rows'}: SectionGridProps) => {
  // Fetch section content
  const sectionSize = size == undefined ? true : size;
  const sectionDirection = orientation == 'columns' ? 'row' : 'column';
  const sectionLayoutStyle = orientation == 'columns' ? sectionInColumnStyle : sectionInRowStyle;

  return (
    <Grid
      id={id}
      item
      xs={sectionSize}
      container
      rowSpacing={2}
      columnSpacing={2}
      direction={sectionDirection}
      css={sectionLayoutStyle}
    >
      {children}
    </Grid>
  );
};

type SectionGridProps = {
  // Size of the section
  size?: number;
  // Orientation of the section (columns or rows)
  orientation?: 'columns' | 'rows';
} & Partial<DashComponentProps>;

export default SectionGrid;
