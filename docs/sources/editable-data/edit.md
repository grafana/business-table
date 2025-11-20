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

You configure data editing and permissions in the **Edit Data** category. You can further configure all columns that you added in the **Layout** category.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/category.png" class="border" alt="Editing and permission settings are configured in the Edit Data category." >}}

To allow editing on a column, enable the switch. The **Editable** tag appears next to the column name in the **Layout** category.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/edit-tag.png" class="border" alt="To allow the edit action on a column, turn the appropriate switch on." >}}

## Update request

The **Update Request** takes the values you enter and sends them to your data source, serving as a bridge between your input and the data source. Configure it in the **Edit Data** -> **Settings** section.

First, select the data source where you want to send the updated values. Then, choose the **Query Editor** mode if your data source supports it:

- **Builder**. It uses the standard Grafana query builder.
- **Code**. It allows you to specify an update request query in a language appropriate for your data source.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/update-request.png" class="border" alt="Configure the Update Request." >}}
