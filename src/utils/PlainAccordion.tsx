// Copyright (C) 2022, IQMO Corporation [support@iqmo.com]
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
  } from "@mui/material";
  
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  import { ReactNode } from "react";
  
  export function PlainAccordion({
    children,
    title,
    openTitle,
    defaultExpanded,
  }: {
    children?: ReactNode;
    title: string;
    openTitle?: string;
    defaultExpanded?: boolean;
  }) {
    return (
      <Accordion
        disableGutters
        elevation={0}
        defaultExpanded={defaultExpanded}
        sx={{
          gridColumn: "span 2",
          border: "none",
          backgroundColor: "inherit",
          backgroundImage: "none",
          "&::before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: 0,
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            padding: "0px",
            flexDirection: "row-reverse",
            "&.Mui-expanded": {
              minHeight: "0px",
            },
            ".expandedTitle": {
              display: "none",
            },
            "&.Mui-expanded .expandedTitle": {
              display: "inherit",
            },
            "&.Mui-expanded .collapsedTitle": {
              display: "none",
            },
            ".MuiAccordionSummary-content.Mui-expanded": {
              margin: "12px 0",
            },
          }}
        >
          <Box
            sx={{
              paddingLeft: "10px",
            }}
          >
            <div className="expandedTitle">{openTitle ? openTitle : title}</div>
            <div className="collapsedTitle">{title}</div>
          </Box>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: "0px",
          }}
        >
          {children}
        </AccordionDetails>
      </Accordion>
    );
  }
  