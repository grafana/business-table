---
title: Edit data
description: Learn how to configure data editing and permissions in the Business Table panel using the Edit Data category.
keywords:
  - business table
labels:
  products:
    - enterprise
    - oss
    - cloud
weight: 30
---

# Edit data

Editing and permissions for data editing are done in a the **Edit Data** category. All columns you added into the **Layout** category, you can further configure there.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/category.png" class="border" alt="Editing and permission settings are done in a new Edit Data category." >}}

To allow the edit action on a column, turn the appropriate switch on. With that the tag **Editable** appears next to the column name in the **Layout** category.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/edit-tag.png" class="border" alt="To allow the edit action on a column, turn the appropriate switch on." >}}

## Update Request

Configure the **Update Request** (the request that takes user-entered values and transmits them into your data source, serving as a bridge between user input and data source) in the **Edit Data** -> **Settings** section.

First, select the data source where the updated values should go to. Then, choose the **Query Editor** mode if it's supported in the data source. Your choice is:

- **Builder**. It uses the standard Grafana query builder.
- **Code**. It allows you to specify an update request query in a language appropriate for your data source.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/update-request.png" class="border" alt="Configure the Update Request." >}}
