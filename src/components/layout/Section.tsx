import React from 'react';
import Card from '../../fragments/Card';
import SectionGrid from '../../fragments/SectionGrid';
import {DashComponentProps} from 'props';

/**
 * Section component
 * Dashboard > Page > Section
 */
const Section = ({
  id = 'section',
  children,
  cards,
  size,
  orientation = 'rows',
  setProps,
  downloaded = 0
}: SectionProps) => {
  const handleSectionDownload = () => {
    // Fire Dash-assigned callback
    setProps({downloaded: downloaded + 1});
  };

  let cardElement: JSX.Element;
  const sectionElements: JSX.Element[] = [];

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

type SectionProps = {
  /** Array of cards to render as component children */
  cards: Array<{
    /** Card title */
    title: string;
    /** Card size (0 < size <= 12) */
    size: number;
    /** Card downloadable */
    downloadable: boolean;
  }>;
  /** Section container size (0 < size <= 12) */
  size?: number;
  /** Section general orientation (rows or columns) */
  orientation?: 'columns' | 'rows';
  /** Section download counter */
  downloaded?: number;
} & DashComponentProps;

export default Section;
