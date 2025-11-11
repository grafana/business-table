---
title: Permission
description: Learn about Permission in Grafana
keywords:
  - business table
labels:
  products:
    - enterprise
    - oss
    - cloud
weight: 70
---
import Image from "@theme/Image";

# Permission

Permission are set for every tab and every action (add/delete/edit).

:::info version

Add and delete a row is supported starting from the Business table 1.9.0

:::

<Image
  title="Unique permissions for add, delete and edit."
  src="/img/plugins/business-table/permissions-where.png"
/>

In the **Permission** parameter of **Add Data**, **Edit Data**, or **Delete Data** set the **Check** parameter to one of the following:

- **Always Allowed**. Every user has permission.
- **By Org User Role**. With that, you need to specify which roles have permission (**Editor**, **Viewer**, **Admin**, **None**).
- **By Backend**. With that, you need to specify a data frame column with a boolean value. If the value is **true**, a user has permission. If the value is **false**, a user does NOT have permission.

<Image
  title="Permission options"
  src="/img/blog/2024-09-26-business-table-1.3.0/permissions.png"
  width="90%"
/>
