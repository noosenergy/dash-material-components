import React from 'react';
import {render, screen, fireEvent, act} from '@testing-library/react';
import InputText from '../components/inputs/InputText';
import '@testing-library/jest-dom';

const setPropsPlaceholder = () => true;

describe('InputText', () => {
  it('should render correctly', () => {
    render(<InputText value="Hello World!" setProps={undefined} />);
    const element: any = screen.getByRole('textbox');
    expect(element.value).toBe('Hello World!');
  });

  it('Should render with adornments', () => {
    render(
      <InputText
        inputType="integer"
        adornmentLeft="LEFT"
        adornmentRight="RIGHT"
        setProps={undefined}
      />
    );
    expect(screen.getByText('LEFT')).toBeInTheDocument();
    expect(screen.getByText('RIGHT')).toBeInTheDocument();
  });

  it('should only allow integers', () => {
    render(<InputText inputType="integer" setProps={setPropsPlaceholder} />);
    const element: any = screen.getByRole('textbox');
    act(() => {
      element.focus();
    });
    fireEvent.change(element, {target: {value: '12'}});
    expect(element.value).toBe('12');
    fireEvent.change(element, {target: {value: 'a'}});
    expect(element.value).toBe('12');
    fireEvent.change(element, {target: {value: '--'}});
    expect(element.value).toBe('12');
    fireEvent.change(element, {target: {value: '.'}});
    expect(element.value).toBe('12');
  });

  it('should only allow floats', () => {
    render(<InputText inputType="float" precision={3} setProps={setPropsPlaceholder} />);
    const element: any = screen.getByRole('textbox');
    act(() => {
      element.focus();
    });
    fireEvent.change(element, {target: {value: '12.3'}});
    expect(element.value).toBe('12.3');
    fireEvent.change(element, {target: {value: 'a'}});
    expect(element.value).toBe('12.3');
    fireEvent.change(element, {target: {value: '--'}});
    expect(element.value).toBe('12.3');
    fireEvent.change(element, {target: {value: '..'}});
    expect(element.value).toBe('12.3');
    fireEvent.change(element, {target: {value: '12.345'}});
    expect(element.value).toBe('12.345');
    fireEvent.change(element, {target: {value: '12.3456'}});
    expect(element.value).toBe('12.345');
    fireEvent.change(element, {target: {value: '-10.555'}});
    expect(element.value).toBe('-10.555');
  });

  it('shoud only allow integer number within range', () => {
    render(
      <InputText
        inputType="integer"
        minValue={-10}
        maxValue={10}
        value={0}
        setProps={setPropsPlaceholder}
      />
    );
    const element: any = screen.getByRole('textbox');
    act(() => {
      element.focus();
    });
    fireEvent.change(element, {target: {value: '12'}});
    expect(element.value).toBe('0');
    fireEvent.change(element, {target: {value: '-12'}});
    expect(element.value).toBe('0');
    fireEvent.change(element, {target: {value: '10'}});
    expect(element.value).toBe('10');
    fireEvent.change(element, {target: {value: '-10'}});
    expect(element.value).toBe('-10');
  });

  it('shoud only allow float number within range', () => {
    render(
      <InputText
        inputType="float"
        minValue={-10}
        maxValue={10}
        value={0}
        setProps={setPropsPlaceholder}
      />
    );
    const element: any = screen.getByRole('textbox');
    act(() => {
      element.focus();
    });
    fireEvent.change(element, {target: {value: '12.3'}});
    expect(element.value).toBe('0');
    fireEvent.change(element, {target: {value: '-12.3'}});
    expect(element.value).toBe('0');
    fireEvent.change(element, {target: {value: '9.5'}});
    expect(element.value).toBe('9.5');
    fireEvent.change(element, {target: {value: '-9.5'}});
    expect(element.value).toBe('-9.5');
  });

  it('should only allow string up to max length', () => {
    render(<InputText inputType="text" maxLength={5} setProps={setPropsPlaceholder} />);
    const element: any = screen.getByRole('textbox');
    act(() => {
      element.focus();
    });
    fireEvent.change(element, {target: {value: '12345'}});
    expect(element.value).toBe('12345');
    fireEvent.change(element, {target: {value: '123456'}});
    expect(element.value).toBe('12345');
  });
});
