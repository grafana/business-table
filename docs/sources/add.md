---
tags:
  - Business Table
title: 'Add data'
description: 'Learn about Add data in Grafana'
labels:
  products:
    - enterprise
    - oss
---
import Image from "@theme/Image";

# Add data

:::info version

Add a row is supported starting from the Business Table 1.9.0

:::

This is one of the most requested features. An end user of your Business Table panel can add and [delete](/plugins/business-table/delete) rows from Grafana dashboard!

<Image
  title="Add and delete rows of the Business Table directly from the Grafana dashboard."
  src="/img/blog/2024-12-04-business-table-1.9.0/table-add-delete-row.gif"
  width="70%"
/>

Data adding configuration itself and permissions for it are done in a the **Add Data** category. All columns you add in the **Layout** category, you can further configure there.

## Add a row configuration

Below are details on how you can configure the add a row feature.

Use **Add data** parameter category to specify:

1.  Which tabs of your Business Table panel should allow to add a row.
2.  What columns should a user specify while adding a new row. It is done by turning on the switch next to a column name.
3.  The [**Editor Type**](/plugins/business-table/editor-types) is a UI element to enter a new value.
4.  [Permission](/plugins/business-table/permission) is a granular control of who is allowed to add a new row.
5.  **Add Request** consists of a data source and the query.
6.  Ensure to set **Layout**->**Show header** to ON, so users have access to the add a row (icon plus) button.

<Image
  title="Steps to configure the Add a row functionality on the Business Table panel."
  src="/img/plugins/business-table/add.png"
/>

## Add Request

Configure the **Add Request** (the request that takes user-entered values and transmits them into your data source, serving as a bridge between user input and data source) in the **Add Data** section.

First, select the data source where the updated values should go to. Then, choose the **Query Editor** mode if it's supported in the data source. Your choice is:

- **Builder**. It uses the standard Grafana query builder.
- **Code**. It allows you to specify an update request query in a language appropriate for your data source.
