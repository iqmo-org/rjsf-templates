import React from "react";
import Grid from "@mui/material/Grid";
import {
  FormContextType,
  ObjectFieldTemplateProps,
  RJSFSchema,
  StrictRJSFSchema,
  canExpand,
  getTemplate,
  getUiOptions,
} from "@rjsf/utils";
import { Box, SxProps } from "@mui/material";
import { PlainAccordion } from "../utils/PlainAccordion";

/** The `ObjectFieldTemplate` is the template to use to render all the inner properties of an object along with the
 * title and description if available. If the object is expandable, then an `AddButton` is also rendered after all
 * the properties.
 *
 * @param props - The `ObjectFieldTemplateProps` for this component
 */
export default function ObjectFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ObjectFieldTemplateProps<T, S, F>) {
  const {
    description,
    title,
    properties,
    required,
    disabled,
    readonly,
    uiSchema,
    idSchema,
    schema,
    formData,
    onAddClick,
    registry,
  } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const TitleFieldTemplate = getTemplate<"TitleFieldTemplate", T, S, F>(
    "TitleFieldTemplate",
    registry,
    uiOptions,
  );
  const DescriptionFieldTemplate = getTemplate<
    "DescriptionFieldTemplate",
    T,
    S,
    F
  >("DescriptionFieldTemplate", registry, uiOptions);
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  return (
    <>
      {(uiOptions.title || title) && (
        <TitleFieldTemplate
          id={`${idSchema.$id}-title`}
          title={title}
          required={required}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      {(uiOptions.description || description) && (
        <DescriptionFieldTemplate
          id={`${idSchema.$id}-description`}
          description={uiOptions.description || description!}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      <Box sx={(uiOptions.wrapperSx || {}) as SxProps}>
        {properties
          .filter(
            (element, idx) =>
              typeof uiOptions.optionalIndex !== "number" ||
              idx < uiOptions.optionalIndex,
          )
          .map((element, index) =>
            // Remove the <Grid> if the inner element is hidden as the <Grid>
            // itself would otherwise still take up space.
            element.hidden ? (
              element.content
            ) : (
              <Box sx={(uiOptions.elementSx || {}) as SxProps} key={index}>
                {element.content}
              </Box>
            ),
          )}
        {canExpand<T, S, F>(schema, uiSchema, formData) && (
          <Grid container justifyContent="flex-end">
            <Grid item={true}>
              <AddButton
                className="object-property-expand"
                onClick={onAddClick(schema)}
                disabled={disabled || readonly}
                uiSchema={uiSchema}
              />
            </Grid>
          </Grid>
        )}
      </Box>
      {typeof uiOptions.optionalIndex === "number" && properties.length  > uiOptions.optionalIndex  && (
        <PlainAccordion title="Optional Parameters">
          <Box sx={(uiOptions.optionalWrapperSx || {}) as SxProps}>
            {properties
              .filter(
                (element, idx) =>
                  typeof uiOptions.optionalIndex === "number" &&
                  idx >= uiOptions.optionalIndex,
              )
              .map((element, index) =>
                // Remove the <Grid> if the inner element is hidden as the <Grid>
                // itself would otherwise still take up space.
                element.hidden ? (
                  element.content
                ) : (
                  <Box
                    p={2}
                    sx={(uiOptions.optionalElementSx || {}) as SxProps}
                    key={index}
                  >
                    {element.content}
                  </Box>
                ),
              )}
          </Box>
        </PlainAccordion>
      )}
    </>
  );
}
