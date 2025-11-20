---
title: Infinity data source
description: Learn how to integrate external data sources like Google Sheets into the Business Table panel using the Infinity Data Source with JSON and CSV formats.
keywords:
  - business table
labels:
  products:
    - enterprise
    - oss
    - cloud
---

# Infinity Data Source

The Infinity Data Source is a powerful tool that allows you to seamlessly integrate data from external sources, such as Google Sheets, into the Business Table panel. Whether you're working with JSON or CSV formats, this data source simplifies the process of fetching and displaying spreadsheet data in your dashboards.

This guide will walk you through the steps to configure the Infinity Data Source for both JSON and CSV imports.

## Import as JSON

To retrieve spreadsheet data in JSON format from Google Sheets:

1. In the Business Table panel, configure the Infinity data source with the following settings:
   - **Type**: `JSON`
   - **Parser**: `backend`
   - **Source**: `URL`
   - **Method**: `GET`
   - **URL**: `https://sheets.googleapis.com/v4/spreadsheets/<spreadsheetID>/values/<sheetName>!<range>`
     - Replace `<spreadsheetID>` with the unique ID of your Google Spreadsheet.
     - Replace `<sheetName>` with the name of the specific sheet.
     - Replace `<range>` with the cell range you want to retrieve (e.g., `A1:D7`).
     - Example: `https://sheets.googleapis.com/v4/spreadsheets/1fHQaArXSA9qR4Ie65i12XA_8fp47jAJACOlqHGAFl0hf2wqM/values/Sheet1!A1:D7`

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/json-import.png" class="border" alt="Retrieve Data in JSON Format" >}}

## Import as CSV

To retrieve spreadsheet data in CSV format from Google Sheets:

1. In the Business Table panel, configure the Infinity data source with the following settings:
   - **Type**: `CSV`
   - **Parser**: `backend`
   - **Source**: `URL`
   - **Method**: `GET`
   - **URL**: `https://docs.google.com/spreadsheets/d/<spreadsheetID>/export?format=csv&gid=0`
     - Replace `<spreadsheetID>` with the unique ID of your Google Spreadsheet.
     - Example: `https://docs.google.com/spreadsheets/d/1fVQOrLSKqO4Ve65i_LfA4BjSJACOlqHGAFl0hf2wqM/export?format=csv&gid=0`

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/csv-import.png" class="border" alt="Retrieve Data in CSV Format" >}}

## Conclusion

Integrating Google Sheets data into your Business Table panel using the Infinity Data Source is a straightforward process that opens up endless possibilities for data visualization and analysis. By following the steps outlined above, you can effortlessly import data in either JSON or CSV format and tailor your dashboards to meet your specific needs.

If you encounter any issues or have further questions, feel free to explore additional resources or reach out to the community for support.
