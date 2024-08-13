import React, { useState } from 'react';
import {
  Select,
  SelectOption,
  SelectProps,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
  Button
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';

export function TypeaheadSelect({ value, selectItems, onChange, placeholder }: {
  value: string;
  selectItems: string[];
  onChange: (item: string) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('');
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const textInputRef = React.useRef<HTMLInputElement>(null);

  const NO_RESULTS = 'no results';

  // Handle menu toggle
  const onToggleClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      textInputRef.current?.focus();
    }
  };

  // Handle option selection
  const onSelect: SelectProps["onSelect"] = (_event, selection) => {
    onChange(selection as string);
    setIsOpen(false);
  };

  // Filter items based on input value
  const filteredItems = filterValue
    ? selectItems.filter(item => item.toLowerCase().includes(filterValue.toLowerCase()))
    : selectItems;

  // Options to display in the select menu
  const options = filteredItems.length
    ? filteredItems.map(item => (
      <SelectOption key={item} value={item}>
        {item}
      </SelectOption>
    ))
    : [
      <SelectOption key={NO_RESULTS} value={NO_RESULTS} isAriaDisabled>
        No results found for "{filterValue}"
      </SelectOption>
    ];

  // Handle text input change
  const onInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setFilterValue(value);
    setFocusedItemIndex(null); // Reset focused item
  };

  // Handle input keydown events
  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && focusedItemIndex !== null) {
      const selectedItem = filteredItems[focusedItemIndex];
      onChange(selectedItem);
      setIsOpen(false);
    }
  };

  // Handle clearing the input
  const onClearButtonClick = () => {
    setFilterValue('');
    setFocusedItemIndex(null);
    setActiveItemId(null);
    textInputRef.current?.focus();
  };

  // Create the toggle component
  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      aria-label="Typeahead menu toggle"
      onClick={onToggleClick}
      isExpanded={isOpen}
      isFullWidth
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={filterValue || value}
          onClick={() => setIsOpen(true)}
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          id="typeahead-select-input"
          autoComplete="off"
          ref={textInputRef}
          placeholder={placeholder}
          {...(activeItemId && { 'aria-activedescendant': activeItemId })}
          role="combobox"
          isExpanded={isOpen}
          aria-controls="typeahead-select-listbox"
        />
        <TextInputGroupUtilities>
          {filterValue && (
            <Button variant="plain" onClick={onClearButtonClick} aria-label="Clear input value">
              <TimesIcon aria-hidden />
            </Button>
          )}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Select
      id="typeahead-select"
      isOpen={isOpen}
      selected={value ? [value] : []}
      onSelect={onSelect}
      onOpenChange={(isOpen) => !isOpen && setIsOpen(false)}
      toggle={toggle}
      shouldFocusFirstItemOnOpen={false}
    >
      <SelectList id="typeahead-select-listbox">
        {options}
      </SelectList>
    </Select>
  );
}
