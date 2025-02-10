import React, { useState, useRef, useEffect } from "react";
import "./SelectComponent.css";

const SelectComponent = ({
  options,
  isMulti = false,
  placeholder = "Select...",
  onChange,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef(null);

  
  useEffect(() => {
    if (isMulti) {
      console.log(value)
      setSelectedOptions(
        options?.filter((option) => value?.includes(option.value)) || []
      );
    } else {
      const selected = options?.find((option) => option.value == value?.value);
      setSelectedOptions(selected ? [selected] : []);
    }
  }, [value, options, isMulti]);

  useEffect(() => {
    setFilteredOptions(
      options?.filter((option) =>
        Object.values(option).some(
          (val) =>
            val &&
            val?.length &&
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleOption = (option) => {
    let updatedOptions;
    if (isMulti) {
      updatedOptions = selectedOptions.some(
        (selected) => selected.value == option.value
      )
        ? selectedOptions?.filter((selected) => selected.value != option.value)
        : [...selectedOptions, option];
      setSelectedOptions(updatedOptions);
    } else {
      updatedOptions = [option];
      setSelectedOptions(updatedOptions);
      setIsOpen(false);
    }

    
    if (onChange) {
      if (isMulti) {
        onChange(updatedOptions);
      } else {
        onChange(updatedOptions[0]);
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="select-container" ref={containerRef}>
      <div
        className={`select-control ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="select-control-text">
          {console.log("selectedOptions", selectedOptions)}
          {selectedOptions.length > 0 ? (
            selectedOptions?.map((opt) => (
              <span key={opt.value} className="selected-option">
                {opt.label}
              </span>
            ))
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <div className={`arrow ${isOpen ? "open" : ""}`} />
      </div>
      <div className={`select-menu ${isOpen ? "open" : ""}`}>
        <input
          type="text"
          className="select-search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
        <div className="select-options">
          {filteredOptions?.length > 0 ? (
            filteredOptions?.map((option) => (
              <div
                key={option.value}
                className={`select-option ${
                  selectedOptions.some(
                    (selected) => selected.value == option.value
                  )
                    ? "selected"
                    : ""
                }`}
                onClick={() => toggleOption(option)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="no-options">No options available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectComponent;
