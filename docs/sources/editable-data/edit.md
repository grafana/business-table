---
tags:
  - Business Table
title: 'Edit data'
description: 'Learn about Edit data in Grafana'
labels:
  products:
    - enterprise
    - oss
weight: 30
---
import Image from "@theme/Image";

# Edit data

Editing and permissions for data editing are done in a the **Edit Data** category. All columns you added into the **Layout** category, you can further configure there.

<Image
  title="Editing and permission settings are done in a new Edit Data category."
  src="/img/plugins/business-table/category.png"
/>

To allow the edit action on a column, turn the appropriate switch on. With that the tag **Editable** appears next to the column name in the **Layout** category.

<Image
  title="To allow the edit action on a column, turn the appropriate switch on."
  src="/img/plugins/business-table/edit-tag.png"
/>

## Update Request

Configure the **Update Request** (the request that takes user-entered values and transmits them into your data source, serving as a bridge between user input and data source) in the **Edit Data** -> **Settings** section.

First, select the data source where the updated values should go to. Then, choose the **Query Editor** mode if it's supported in the data source. Your choice is:

- **Builder**. It uses the standard Grafana query builder.
- **Code**. It allows you to specify an update request query in a language appropriate for your data source.

<Image
  title="Configure the Update Request."
  src="/img/plugins/business-table/update-request.png"
/>
