'use client';
import React from 'react';
import Select from 'react-select';

interface CustomSelectProps {
  options: { label: string; value: number }[];
  onSelect: (value: number) => void;
  placeholder: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onSelect, placeholder }) => {
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
        placeholder={placeholder}
        isSearchable // Agrega la capacidad de búsqueda
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
      />
    </div>
  );
};

export default CustomSelect;
