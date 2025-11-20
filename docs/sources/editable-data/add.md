---
title: Add data
description: Learn how to add new rows to your Business Table panel with configurable data entry options.
keywords:
  - business table
labels:
  products:
    - enterprise
    - oss
    - cloud
weight: 20
---

# Add data

{{< admonition type="note" >}}
Adding rows is supported starting from Business Table 1.9.0.
{{< /admonition >}}

This is one of the most requested features. You can add and [delete](/plugins/business-table/delete) rows from your Grafana dashboard.

{{< video-embed src="/media/docs/grafana/panels-visualizations/business-table/table-add-delete-row.mp4" >}}

You configure data adding and permissions in the **Add Data** category. You can further configure all columns that you add in the **Layout** category.

## Row addition configuration

To configure the add row feature, use the **Add data** parameter category to specify:

- Which tabs of your Business Table panel allow adding rows.
- What columns you need to specify when adding a new row. Enable the switch next to a column name.
- The [**Editor Type**](/plugins/business-table/editor-types), which is the UI element for entering a new value.
- [Permission](/plugins/business-table/permission), which provides granular control over who can add a new row.
- **Add Request**, which consists of a data source and query.
- **Layout > Show header** set to ON so that you have access to the add row (plus icon) button.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/add.png" class="border" alt="Steps to configure the Add a row functionality on the Business Table panel." >}}

## Add request

The **Add Request** takes the values you enter and sends them to your data source, serving as a bridge between your input and the data source. Configure it in the **Add Data** section.

First, select the data source where you want to send the updated values. Then, choose the **Query Editor** mode if your data source supports it:

- **Builder**. It uses the standard Grafana query builder.
- **Code**. It allows you to specify an update request query in a language appropriate for your data source.
