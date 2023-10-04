import React from 'react';
import PropTypes from 'prop-types';

import Card from '../../fragments/Card';
import SectionGrid from '../../fragments/SectionGrid';

/**
 * Section component
 * Dashboard > Page > Section
 */
const Section = (props) => {
  const {id, children, cards, size, orientation, setProps, downloaded} = props;

  const handleSectionDownload = (event) => {
    // Fire Dash-assigned callback
    setProps({downloaded: downloaded + 1});
  };

  let cardElement;
  let sectionElements = [];

  // Fetch cards
  if (children) {
    React.Children.forEach(children, (child, i) => {
      cardElement = (
        <Card
          key={i}
          id={`card-${i + 1}`}
          title={cards[i].title}
          size={cards[i].size}
          orientation={orientation}
          downloadable={cards[i].downloadable}
          handleDownload={handleSectionDownload}
        >
          {child}
        </Card>
      );

      sectionElements.push(cardElement);
    });
  }

  // Pass-on props given incompatibility with MUI styles and Dash callbacks
  return (
    <SectionGrid id={id} size={size} orientation={orientation}>
      {sectionElements}
    </SectionGrid>
  );
};

Section.defaultProps = {
  id: 'section',
  orientation: 'rows',
  downloaded: 0
};

Section.propTypes = {
  /** Used to identify dash components in callbacks */
  id: PropTypes.string,

  /** Used to enable Dash-assigned component callback */
  setProps: PropTypes.func,

  /** Used to render elements inside the component */
  children: PropTypes.node,

  /** Array of cards to render as component children */
  cards: PropTypes.arrayOf(
    PropTypes.exact({
      /** Card title */
      title: PropTypes.string,

      /** Card size (0 < size <= 12) */
      size: PropTypes.number,

      /** Card dowloadable */
      downloadable: PropTypes.bool
    })
  ),

  /** Section container size (0 < size <= 12) */
  size: PropTypes.number,

  /** Section general orientation (rows or columns) */
  orientation: PropTypes.oneOf(['columns', 'rows']),

  /** Section download counter */
  downloaded: PropTypes.number
};

export default Section;
