---
title: Permissions
description: Learn how to set permissions for every tab and every action in the Business Table panel.
keywords:
  - business table
labels:
  products:
    - enterprise
    - oss
    - cloud
weight: 70
---

# Permissions

You set permissions for every tab and every action (add/delete/edit).

{{< admonition type="note" >}}
Adding and deleting rows is supported starting from Business Table 1.9.0.
{{< /admonition >}}

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/permissions-where.png" class="border" alt="Unique permissions for add, delete, and edit." >}}

In the **Permission** parameter of **Add Data**, **Edit Data**, or **Delete Data**, set the **Check** parameter to one of the following:

- **Always Allowed**: Every user has permission.
- **By Org User Role**: Specify which roles have permission (**Editor**, **Viewer**, **Admin**, **None**).
- **By Backend**: Specify a data frame column with a boolean value. If the value is **true**, the user has permission. If the value is **false**, the user doesn't have permission.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/permissions.png" class="border" alt="Permission options" >}}
