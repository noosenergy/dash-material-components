import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    const input = screen.getByRole('combobox');
    expect(input.value).toBe('option_c');
  });

  it('should render matching options with inserted input', async () => {
    render(<Autocomplete options={options} />);
    const input = screen.getByRole('combobox');
    userEvent.type(input, 'option');

    await waitFor(() => {
      expect(screen.getByText('option_a')).toBeInTheDocument();
      expect(screen.getByText('option_b')).toBeInTheDocument();
      expect(screen.getByText('option_c')).toBeInTheDocument();
    });
  });

  it('should render no options if non-matching input is inserted', async () => {
    render(<Autocomplete options={options} />);
    const input = screen.getByRole('combobox');

    // Use userEvent.type to simulate typing
    userEvent.type(input, 'jiberish');

    // Wait for the presentation element to be visible
    await waitFor(() => {
      const element = screen.getByRole('presentation');
      expect(element).toBeVisible();
    });

    // Wait for the DOM to update after the change event
    await waitFor(() => {
      expect(screen.queryByText('option_a')).toBeNull();
      expect(screen.queryByText('option_b')).toBeNull();
      expect(screen.queryByText('option_c')).toBeNull();
    });
  });

  it('should allow selection by clicking on option', async () => {
    render(<Autocomplete options={options} setProps={() => true} />);
    const input = screen.getByRole('combobox');
    userEvent.type(input, 'opt');

    await waitFor(() => {
      const element = screen.getByRole('presentation');
      expect(element).toBeVisible();
    });

    fireEvent.click(screen.getByText('option_b'));

    await waitFor(() => {
      expect(input.value).toBe('option_b');
    });
  });
});
