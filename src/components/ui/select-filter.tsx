'use client';
import React from 'react';
import Select from 'react-select';
import { useTheme } from "next-themes"

interface CustomSelectProps {
  options: { label: string; value: number }[];
  onSelect: (value: number) => void;
  placeholder: string;
}

// Define los estilos para el tema oscuro
const darkThemeStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: 'black',
    borderColor: state.isFocused ? 'black' : 'white',
    '&:hover': {
      borderColor: 'white',
    },
    color: 'white',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'black',
    color: 'white',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'gray' : 'black',
    color: 'white',
    '&:hover': {
      backgroundColor: 'gray',
      color: 'black',
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onSelect, placeholder }) => {
  const { theme } = useTheme()

  const customSelectStyles = theme === 'dark' || theme ==='system' ? darkThemeStyles : {}

  const [selectedOption, setSelectedOption] = React.useState<any>(null);

  const handleChange = (selected: any) => {
    if (selected?.value === 0) {
      return;
    }
    setSelectedOption(selected);
    onSelect(selected?.value || 0);
  };

  return (
    <div className="relative">
      <label className="font-bold leading-2 text-lg" htmlFor="custom-select">
        {placeholder}
      </label>
      <Select
        id="custom-select"
        value={selectedOption}
        onChange={handleChange}
        options={options}
        styles={customSelectStyles} 
      />
    </div>
  )
}

export default CustomSelect;