---
title: External export
description: Learn how to export table data to external sources by sending HTTP requests with payload data in the Business Table panel.
keywords:
  - business table
labels:
  products:
    - enterprise
    - oss
    - cloud
---
import Image from "@theme/Image";

# External export

The Business Table panel now supports exporting table data to external sources by sending an HTTP request. The data is represented as a two-dimensional array (`[][]`) and is accessible via the `${payload}` variable, which is escaped as a string for inclusion in the request body.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/export-button.png" class="border" alt="The Export Button" >}}

This feature enables seamless integration with external services, allowing users to export table data to platforms like Google Sheets, databases, or other APIs. The export is triggered by a user action, such as clicking a button, and can be customized to work with various data sources.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/payload-in-body.png" class="border" alt="Export Body Configuration in Infinity Data Source" >}}

## Overview of external export

External export allows you to:

- Send table data to external systems via HTTP requests.
- Integrate with platforms like Google Sheets using APIs.
- Customize the export process through the Infinity data source in Grafana.

{{< admonition type="note" >}}
This guide focuses on exporting data to Google Sheets, but the principles can be applied to other external systems with appropriate API configurations.
{{< /admonition >}}

You can export table data directly to Google Sheets using the Google Sheets API through the Infinity data source. Follow the steps below to set up and configure this integration.

## Prepare Your Google Spreadsheet

Before exporting data, prepare the target spreadsheet to receive the data:

1. Go to [Google Sheets](https://docs.google.com/spreadsheets) and create a new spreadsheet.
2. Name the spreadsheet for easy identification (e.g., "Business Table Export").
3. Identify the sheet and range where the data will be appended (e.g., `Sheet1!A1`).

## Set up Google Cloud Console

To enable data export to Google Sheets, create a service account with the necessary permissions:

1. Navigate to [Google Cloud Console](https://console.cloud.google.com).
2. Create a new project or select an existing one.

   {{< figure src="/media/docs/grafana/panels-visualizations/business-table/google-cloud.png" class="border" alt="Select Project in Google Cloud" >}}

3. Go to **APIs & Services** > **Enable APIs and Services**.
4. Search for `Google Sheets API` and enable it for your project.

   {{< figure src="/media/docs/grafana/panels-visualizations/business-table/enabled-sheets-api.png" class="border" alt="Enabled API for Google Cloud Project" >}}

5. Click **Manage this API** > **Credentials** > **Manage Service Accounts**.
6. Click **Create Service Account**, provide a name, and set the role to `Editor`.

   {{< figure src="/media/docs/grafana/panels-visualizations/business-table/permission-role.png" class="border" alt="Select Role as Editor" >}}

7. Go to the **Credentials** menu, edit the service account, and navigate to the **Keys** section.
8. Click **Add Key**, select `JSON` as the key type, and save the file.

   {{< figure src="/media/docs/grafana/panels-visualizations/business-table/key-type.png" class="border" alt="Select Key Type as JSON" >}}

9. Download JSON key file and use it to configure Infinity data source.

## Update Google Spreadsheet permissions

To grant access to your Google Spreadsheet for the created service account, follow these steps:

1. Open your Google Spreadsheet.
2. Click the **Share** button in the top-right corner of the screen.
3. In the "Share with people and groups" field, enter the service account email address (e.g., `test-account@test-spreadsheets.iam.gserviceaccount.com`).
4. Set the permission level to **Editor** to allow the service account to modify the spreadsheet.
5. Click **Send** or **Done** to save the changes.

{{< admonition type="note" >}}
Ensure that the service account email is correctly copied from your Google Cloud Console. If the email is incorrect or the service account lacks necessary permissions at the project level, access will be denied.
{{< /admonition >}}

## Configure Infinity Data Source

Set up the Infinity data source to authenticate with Google Sheets:

1. In Grafana, create or open an Infinity data source.
2. Go to the **Authentication** tab.
3. Select **Other Authentication** > **Provider: Google JWT**.
4. Upload the JSON key file downloaded from Google Cloud Console.
5. Set the `Scopes` field to `https://www.googleapis.com/auth/spreadsheets`.
6. Add the following allowed hosts: `https://docs.google.com`, `https://sheets.googleapis.com`, `docs.google.com`, `sheets.googleapis.com`.
7. Click **Save and Test** to verify the configuration.

   {{< figure src="/media/docs/grafana/panels-visualizations/business-table/auth-config-infinity.png" class="border" alt="Infinity Data Source Authentication Configuration" >}}

8. Go to **URL, Headers & Params** > **URL Settings** and set `Allow Dangerous HTTP Methods` to `true`.

## Configure export request in Business Table

Configure the Business Table panel to send data to Google Sheets:

1. Create or edit a Business Table panel with your data.

   {{< figure src="/media/docs/grafana/panels-visualizations/business-table/configured-panel.png" class="border" alt="Configured Business Table Panel" >}}

2. In the panel settings, go to **Advanced Options** > **External Export** and enable it.
3. Select your configured Infinity data source.
4. Set the following options:

   - **Type**: `JSON`
   - **Parser**: `backend`
   - **Source**: `URL`
   - **Method**: `PUT`
   - **URL**: `https://sheets.googleapis.com/v4/spreadsheets/<spreadsheetID>/values/<sheetName>!<startCell>?valueInputOption=RAW`
     - Replace `<spreadsheetID>`, `<sheetName>`, and `<startCell>` with your spreadsheet details.
     - Example: `https://sheets.googleapis.com/v4/spreadsheets/1fHQaArXS9qR4Ie65i_8fp47jAJACOlqHGZ35AFl0hf2wqM/values/Sheet1!A1?valueInputOption=RAW`
   - **URL Option**: `Body Type` - `Raw`
   - **Body Content Type**: `JSON`
   - **Body Content**:
     ```json
     {
       "range": "Sheet1!A1",
       "majorDimension": "ROWS",
       "values": ${payload}
     }
     ```

5. (Optional) Test with hardcoded data:

   ```json
   {
     "range": "Sheet1!A1",
     "majorDimension": "ROWS",
     "values": [
       ["value", "device", "status"],
       ["100", "sensor A", "ok"],
       ["200", "sensor B", "error"]
     ]
   }
   ```

   {{< figure src="/media/docs/grafana/panels-visualizations/business-table/put-configuration.png" class="border" alt="Request Configuration for Infinity Data Source" >}}

6. Save the dashboard and click the **Export** button to send data to Google Sheets.

:::warning
Infinity data source may return a "status OK" even if there is an error. Check the **Network** tab in your browser's developer tools if the export fails.
:::

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/filled-table.png" class="border" alt="Google Sheets Data After Successful Export" >}}

## Troubleshooting

- **Export Fails**: Check the **Network** tab in your browser's developer tools for detailed error messages.
- **Authentication Issues**: Ensure the service account has the correct permissions and the JSON key file is uploaded correctly in Infinity.
- **Data Not Updating**: Verify the range and sheet name in the export URL match your Google Spreadsheet configuration.

If you encounter issues not covered in this guide, reach out to the community or support channels for assistance.
