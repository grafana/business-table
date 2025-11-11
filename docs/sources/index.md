---
tags:
  - Business Table
hide_table_of_contents: true
title: 'Business Table'
description: 'Learn about Business Table in Grafana'
labels:
  products:
    - enterprise
    - oss
---
import Feedback from "../_feedback.mdx";
import GettingStarted from "./_getting_started.mdx";
import Image from "@theme/Image";
import Tutorial from "./_tutorial.mdx";

# Business Table

The **Business Table Panel** is a powerful and flexible Grafana plugin designed to elevate data visualization in table format. Tailored for business analytics and reporting dashboards, it offers advanced features like tree views, custom cell rendering, data editing, and export capabilities.

## Requirements

The Business Table panel version requirements for Grafana are as follows:

- **Business Table Panel 3.x** requires **Grafana 11** or **Grafana 12**.
- **Business Table Panel 1.x, 2.x** requires **Grafana 10.3** or **Grafana 11**.

<GettingStarted />

## Highlights

- **Tree View**: Display hierarchical data with expandable and collapsible rows.
- **Tabbed Views**: Switch between multiple data frames within a single panel.
- **Dynamic Filtering**: Filter table data using dashboard variables.
- **Pagination**: Support for client-side and server-side pagination for large datasets.
- **Thresholds**: Apply Grafana’s threshold styling for visual data insights.
- **Custom Cell Types**: Render cells as JSON, Gauge, Image, HTML/Markdown, and more.
- **Data Editing**: Enable permission-based editing with query integration.
- **Export Options**: Download table data as CSV or Excel files.

<Image
  title="Tabs and grouped columns in the Business Table panel."
  src="/img/plugins/business-table/groups.png"
/>

<Tutorial />

## Documentation

| Section                                            | Description                                           |
| -------------------------------------------------- | ----------------------------------------------------- |
| [Editable data](/plugins/business-table/editable/) | Explains 7 configurable data flows.                   |
| [Features](features)                               | Explains the plugin features.                         |
| [Tutorials](tutorials)                             | Tutorials for the Business Table panel.               |
| [Release Notes](release)                           | Stay up to date with the latest features and updates. |

## License

Apache License Version 2.0, see [LICENSE](https://github.com/volkovlabs/business-table/blob/main/LICENSE).

<Feedback />
