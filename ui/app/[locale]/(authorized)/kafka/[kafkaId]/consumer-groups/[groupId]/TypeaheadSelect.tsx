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
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';

export function TypeaheadSelect({ value, selectItems, onChange, placeholder }: {
  value: string;
  selectItems: string[];
  onChange: (items: string) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('');
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const textInputRef = React.useRef<HTMLInputElement>(null);

  const NO_RESULTS = 'no results';

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect: SelectProps["onSelect"] = (_, topic) => {
    onChange(topic as string);
    setIsOpen(false);
  };

  const filteredItems = filterValue
    ? selectItems.filter(selectItem => selectItem.toLowerCase().includes(filterValue.toLowerCase()))
    : selectItems;

  const options = filteredItems.length
    ? filteredItems.map(item => (
      <SelectOption key={item} value={item}>
        {item}
      </SelectOption>
    ))
    : [
      <SelectOption key={NO_RESULTS} value={NO_RESULTS} isAriaDisabled>
        {"No results found for" + { filterValue }}
      </SelectOption>
    ];

  const onInputChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setFilterValue(value);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && focusedItemIndex !== null) {
      const selectedItem = filteredItems[focusedItemIndex];
      onChange(selectedItem);
      setIsOpen(false);
    }
  };

  const onClearButtonClick = () => {
    setFilterValue('');
    setFocusedItemIndex(null);
    setActiveItemId(null);
    textInputRef.current?.focus();
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      variant="typeahead"
      aria-label="Typeahead menu toggle"
      onClick={() => onToggle(!isOpen)}
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
          innerRef={textInputRef}
          placeholder={placeholder}
          {...(activeItemId && { 'aria-activedescendant': activeItemId })}
          role="combobox"
          isExpanded={isOpen}
          aria-controls="typeahead-select-listbox"
        />

        <TextInputGroupUtilities {...(!filterValue ? { style: { display: 'none' } } : {})}>
          <Button variant="plain" onClick={onClearButtonClick} aria-label="Clear input value">
            <TimesIcon aria-hidden />
          </Button>
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Select
      id="typeahead-select"
      isOpen={isOpen}
      selected={[value]}
      onSelect={onSelect}
      onOpenChange={(isOpen) => !isOpen && setIsOpen(false)}
      toggle={toggle}
    >
      <SelectList id="typeahead-select-listbox">
        {options}
      </SelectList>
    </Select>
  );
};
