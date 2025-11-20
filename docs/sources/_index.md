---
title: Business Table
description: Learn how to use the Business Table Panel plugin to create powerful, flexible data visualizations with advanced features like tree views, data editing, custom cell rendering, and export capabilities.
keywords:
  - business table
labels:
  products:
    - enterprise
    - oss
    - cloud
---

# Business Table

The **Business Table Panel** is a powerful and flexible Grafana plugin designed to elevate data visualization in table format. Tailored for business analytics and reporting dashboards, it offers advanced features like tree views, custom cell rendering, data editing, and export capabilities.

## Requirements

The Business Table panel version requirements for Grafana are as follows:

- **Business Table Panel 3.x** requires **Grafana 11** or **Grafana 12**.
- **Business Table Panel 1.x, 2.x** requires **Grafana 10.3** or **Grafana 11**.

## Getting started

The Business Table panel can be installed from the [Grafana Catalog](https://grafana.com/grafana/plugins/volkovlabs-table-panel/) or utilizing the Grafana command line tool.

{{< youtube id="1qYzHfPXJF8" >}}

For the latter, please use the following command.

```sh
grafana cli plugins install volkovlabs-table-panel
```

## Highlights

- **Tree View**: Display hierarchical data with expandable and collapsible rows.
- **Tabbed Views**: Switch between multiple data frames within a single panel.
- **Dynamic Filtering**: Filter table data using dashboard variables.
- **Pagination**: Support for client-side and server-side pagination for large datasets.
- **Thresholds**: Apply Grafana’s threshold styling for visual data insights.
- **Custom Cell Types**: Render cells as JSON, Gauge, Image, HTML/Markdown, and more.
- **Data Editing**: Enable permission-based editing with query integration.
- **Export Options**: Download table data as CSV or Excel files.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/groups.png" class="border" alt="Tabs and grouped columns in the Business Table panel." >}}

## Tutorial

The Business Table 1.9.0 for Grafana brings an exciting functionality when a user can add, edit and delete rows from the Grafana dashboard. In addition, the Business Table 1.9.0 features useful functionality such as Grafana Thresholds, displaying images, easy connections with other Grafana panels and more!

{{< youtube id="tNa14EULUQo" >}}

We have many other tutorials that you can find helpful. You can review all related to this plugin tutorials [here](/plugins/business-table/tutorials).

## Documentation

| Section                                            | Description                                           |
| -------------------------------------------------- | ----------------------------------------------------- |
| [Editable data](/plugins/business-table/editable/) | Explains 7 configurable data flows.                   |
| [Features](features)                               | Explains the plugin features.                         |
| [Tutorials](tutorials)                             | Tutorials for the Business Table panel.               |
| [Release Notes](release)                           | Stay up to date with the latest features and updates. |

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/business-table/blob/main/LICENSE).

