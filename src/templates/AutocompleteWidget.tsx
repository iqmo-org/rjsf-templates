import React, { useMemo, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import {
  enumOptionsValueForIndex,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from "@rjsf/utils";
import { Autocomplete } from "@mui/material";

function convert(val: string | { label: string; value: string }) {
  return typeof val === "string" ? { label: "", value: val } : val;
}

/** The `SelectWidget` is a widget for rendering dropdowns.
 *  It is typically used with string properties constrained with enum options.
 *
 * @param props - The `WidgetProps` for this component
 */
export default function AutocompleteWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  schema,
  uiSchema,
  id,
  options,
  label,
  required,
  disabled,
  readonly,
  value,
  multiple,
  autofocus,
  onChange,
  onBlur,
  onFocus,
  rawErrors = [],
}: WidgetProps<T, S, F>) {
  const { enumOptions } = options;
  const [inputValue, setInputValue] = useState<string>("");
  const [autocompleteValues, setAutocompleteValues] = useState<
    { label: string; value: string }[]
  >([]);

  const autocompleteType = uiSchema && uiSchema["ui:autocompleteType"];
  const autocompletFunction: (
    autocompleteType: string,
    setAutocompleteValues: (
      val: {
        label: string;
        value: string;
      }[],
    ) => void,
  ) => (val: any) => void = uiSchema && uiSchema["ui:autocompletFunction"];

  const _onChange = (e: React.SyntheticEvent, value: any) =>
    onChange(enumOptionsValueForIndex<S>(value, enumOptions));

  const _onBlur = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => {
    if (autocompleteType && inputValue) {
      onChange(enumOptionsValueForIndex<S>(value, enumOptions));
    }
    onBlur(id, enumOptionsValueForIndex<S>(value, enumOptions));
  };

  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) =>
    onFocus(id, enumOptionsValueForIndex<S>(value, enumOptions));

  const getAutocompleteValues = useMemo(
    () => autocompletFunction(autocompleteType, setAutocompleteValues),
    [autocompletFunction, autocompleteType, setAutocompleteValues],
  );

  useEffect(() => {
    if (!enumOptions) {
      getAutocompleteValues(inputValue);
    }
  }, [inputValue, getAutocompleteValues, enumOptions]);

  return (
    <Autocomplete
      id={id}
      sx={{ width: "100%" }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      freeSolo={autocompleteType ? true : false}
      value={typeof value === "undefined" ? null : value}
      isOptionEqualToValue={(v1, v2) => {
        if (!v1 || !v2) {
          return v1 === v2;
        }
        const label1 = convert(v1);
        const label2 = convert(v2);
        return label1.value === label2.value;
      }}
      getOptionLabel={(option) => {
        return typeof option === "string" ? option : `${option.value.trim()}(${option.label})`;
      }}
      disabled={disabled || readonly}
      onChange={_onChange}
      onBlur={_onBlur}
      onFocus={_onFocus}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={
        enumOptions
          ? enumOptions
          : inputValue.length === 0
          ? []
          : autocompleteValues
      }
      renderInput={(params) => (
        <TextField
          name={id}
          label={label || schema.title}
          required={required}
          autoFocus={autofocus}
          error={rawErrors.length > 0}
          SelectProps={{
            multiple: typeof multiple === "undefined" ? false : multiple,
          }}
          {...params}
        />
      )}
    />
  );
}
