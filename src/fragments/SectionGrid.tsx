import React from 'react';
import {Grid} from '@mui/material';
import {DashComponentProps} from 'props';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  sectionInColumn: {
    // Contain at max entire page length
    maxHeight: '100%',
    // Reset section element negative margins
    padding: 0,
    margin: 0
  },
  sectionInRow: {
    // Contain at max entire page width
    maxWidth: '100%',
    // Reset section element negative margins
    padding: 0,
    margin: 0
  }
}));

const SectionGrid = ({id = 'section', children, size, orientation = 'rows'}: SectionGridProps) => {
  // props & state
  const classes = useStyles();

  // Fetch section content
  const sectionSize = size == undefined ? true : size;
  const sectionDirection = orientation == 'columns' ? 'row' : 'column';
  const sectionLayout = orientation == 'columns' ? classes.sectionInColumn : classes.sectionInRow;

  return (
    <Grid
      id={id}
      item
      xs={sectionSize}
      container
      rowSpacing={2}
      columnSpacing={2}
      direction={sectionDirection}
      className={`${sectionLayout}`}
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
