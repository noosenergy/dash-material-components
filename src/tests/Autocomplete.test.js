import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import Autocomplete from '../components/inputs/Autocomplete';
import '@testing-library/jest-dom';

const options = [
  {label: 'option_a', value: 'value_a'},
  {label: 'option_b', value: 'value_b'},
  {label: 'option_c', value: 'value_c'}
];

describe('Autocomplete', () => {
  it('should render correctly', () => {
    render(<Autocomplete options={options} />);
    const element = screen.getByRole('combobox');
    expect(element).toBeInTheDocument();
  });

  it('should render correctly with initialized value', () => {
    render(<Autocomplete options={options} selected={[options[2]]} />);
    const input = screen.getByRole('textbox');
    expect(input.value).toBe('option_c');
  });

  it('should render matching options with inserted input', () => {
    render(<Autocomplete options={options} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, {target: {value: 'option'}});
    expect(screen.getByText('option_a')).toBeInTheDocument();
    expect(screen.getByText('option_b')).toBeInTheDocument();
    expect(screen.getByText('option_c')).toBeInTheDocument();
  });

  it('should render no options if non-matching input is inserted', () => {
    render(<Autocomplete options={options} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, {target: {value: 'option_d'}});
    expect(screen.queryByText('option_a')).toBeNull();
    expect(screen.queryByText('option_b')).toBeNull();
    expect(screen.queryByText('option_c')).toBeNull();
  });

  it('should allow selection by clicking on option', () => {
    render(<Autocomplete options={options} setProps={() => true} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, {target: {value: 'option'}});
    fireEvent.click(screen.getByText('option_b'));
    expect(input.value).toBe('option_b');
  });
});
