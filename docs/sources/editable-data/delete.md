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
Delete a row is supported starting from the Business Table 1.9.0
{{< /admonition >}}

This is one of the most requested features. An end user of your Business Table panel can [add](/plugins/business-table/add) and delete rows from Grafana dashboard!

{{< video-embed src="/media/docs/grafana/panels-visualizations/business-table/table-add-delete-row.mp4" >}}

Data deleting configuration itself and permissions for it are done in a the **Delete Data** category.

## Delete a row configuration

Below are details on how you can configure the delete a row feature.

Use **Delete data** parameter category to specify:

- Which tabs of your Business Table panel should allow to delete a row.
- [Permission](/plugins/business-table/permission) is a granular control of who is allowed to delete a row.
- **Delete Request** consists of a data source and the query.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/delete-conf.png" class="border" alt="Steps to configure the Delete a row functionality on the Business Table panel." >}}

## Delete request

Configure the **Delete Request** in the **Delete Data** section.

First, select the data source where the delete commands should go to. Then, choose the **Query Editor** mode if it's supported in the data source. Your choice is:

- **Builder**. It uses the standard Grafana query builder.
- **Code**. It allows you to specify an update request query in a language appropriate for your data source.
