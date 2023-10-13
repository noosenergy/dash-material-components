import React from 'react';
import { render, screen } from '@testing-library/react';
import Slider from '../../../src/components/inputs/Slider';
import '@testing-library/jest-dom';

describe('Slider', () => {
  it('should render correctly', () => {
    render(<Slider selected={50} />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();

    // Test textinput is not rendered
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('should render correctly with min, max, marks and textinput', () => {
    const initialValue = 50;
    const max = 100;
    const min = 0;

    render(<Slider selected={initialValue} minValue={min} maxValue={max}
      marks={[{"label": "x", "value": min}, {"label": "y", "value": max}]}
      showInputText={true}
    />);

    const slider = screen.getByRole('slider');

    // Min, max are set to correct values
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuemax', String(max));
    expect(slider).toHaveAttribute('aria-valuemin', String(min));

    // Test marks are rendered
    expect(screen.getByText('x')).toBeInTheDocument();
    expect(screen.getByText('y')).toBeInTheDocument();

    // Test textinput is rendered
    const text_input = screen.getByRole('textbox');
    expect(text_input).toBeInTheDocument();
    expect(text_input).toHaveValue(String(initialValue));
  });

});
