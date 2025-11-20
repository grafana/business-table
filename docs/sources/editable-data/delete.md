---
title: Delete data
description: Learn how to delete rows from your Business Table panel with proper configuration and safety measures.
keywords:
  - business table
labels:
  products:
    - enterprise
    - oss
    - cloud
weight: 50
---

# Delete data

{{< admonition type="note" >}}
Deleting rows is supported starting from Business Table 1.9.0.
{{< /admonition >}}

This is one of the most requested features. You can [add](https://grafana.com/docs/plugins/volkovlabs-table-panel/<PLUGINS_VERSION>/editable-data/add/) and delete rows from your Grafana dashboard.

{{< video-embed src="/media/docs/grafana/panels-visualizations/business-table/table-add-delete-row.mp4" >}}

You configure data deletion and permissions in the **Delete Data** category.

## Row deletion configuration

To configure the delete row feature, use the **Delete data** parameter category to specify:

- Which tabs of your Business Table panel allow deleting rows.
- [Permission](https://grafana.com/docs/plugins/volkovlabs-table-panel/<PLUGINS_VERSION>/editable-data/permission/), which provides granular control over who can delete a row.
- **Delete Request**, which consists of a data source and query.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/delete-conf.png" class="border" alt="Steps to configure the Delete a row functionality on the Business Table panel." >}}

## Delete request

Configure the **Delete Request** in the **Delete Data** section.

First, select the data source where you want to send delete commands. Then, choose the **Query Editor** mode if your data source supports it:

- **Builder**. It uses the standard Grafana query builder.
- **Code**. It allows you to specify an update request query in a language appropriate for your data source.
