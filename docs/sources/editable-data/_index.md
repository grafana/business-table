---
tags:
  - Business Table
title: 'Editable data/data flow'
description: 'Learn about Editable data/data flow in Grafana'
labels:
  products:
    - enterprise
    - oss
weight: 20
---
import Image from "@theme/Image";
import Youtube from "@theme/Youtube";

# Editable data/data flow

The Business Table provides multifarious editing data functionality to facilitate extensive capabilities for end-users to work with the table data.

:::info version
Ensure to have at least version 1.9.0 of the Business Table and access to all the features described for the editable data.
:::

## Data flows

You can configure 7 data flows:

1.  Add data
2.  Edit data
3.  Delete data
4.  Nested objects->Get Options
5.  Nested objects->Add Options
6.  Nested objects->Edit Options
7.  Nested objects->Delete Options

<Youtube
  id="tNa14EULUQo"
  title="Add/Edit/Delete rows with Business Table 1.9.0 in Grafana. Work with nested objects."
/>

## Highlights

Some highlights of data editing in the Business Table panel:

- Every tab has separate add/delete and permission settings.
- Every column has separate edit and permission settings.
- User can enter a new value manually or select from the predefined listing coming from your data source.
- The Add, Update, and Delete requests are configurable and allows custom logic.
- The permission can be Grafana user-based (Viewer, Editor, Admin, and None) or regulated from the backend.
- The **Nested Objects** have their own get, add, edit, delete configuration.

<Image
  title="Data Flow Categories to configure editable data in the Business table panel."
  src="/img/plugins/business-table/table-data-flow.png"
/>

## Categories

| Category                                          | Description                                                                                                                                                                                                                                    |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Layout](/plugins/business-table/layout/)         | The **Layout** parameter category determines the set of tabs and then the set of columns and their types for each tab.                                                                                                                         |
| [Add Data](/plugins/business-table/add/)          | The **Add Data** parameter category determines the tabs where a user can add data, then the columns that should be populated when a row is being added, **Editor Type** for every such column, **Data Source** with **Query**, and permission. |
| [Edit Data](/plugins/business-table/edit/)        | The **Edit Data** parameter category determines the columns that should be populated when a row is being edited, **Editor Type** for every such column, **Data Source** with **Query**, and permission.                                        |
| [Delete Data](/plugins/business-table/delete/)    | The **Delete Data** parameter category determines the tabs where a user can delete a data row, **Data Source** with **Query**, and permission.                                                                                                 |
| [Nested Objects](/plugins/business-table/nested/) | The **Nested Objects** parameter category collects settings for the **Nested Objects** display along with add/edit/delete functionality.                                                                                                       |
