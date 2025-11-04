# Business Table Panel for Grafana

[![CI](https://github.com/grafana/business-text/actions/workflows/push.yml/badge.svg)](https://github.com/grafana/business-text/actions/workflows/push.yml)
[![CD](https://github.com/grafana/business-text/actions/workflows/publish.yml/badge.svg)](https://github.com/grafana/business-text/actions/workflows/publish.yml)
[![License](https://img.shields.io/github/license/grafana/business-text)](https://github.com/grafana/business-text/blob/main/LICENSE)

> This project was originally contributed by [Volkov Labs](https://github.com/volkovlabs/business-table) - thanks for all your great work!
>
> We have republished under the same plugin ID, keeping the community signature. This means you can simply update your plugin version. A new ID would have required manual updates to your dashboards. For additional information on the changes, see the [Notices](https://github.com/grafana/business-table/blob/main/NOTICES.md).

## 📋 Introduction

The **Business Table Panel** is a powerful and flexible Grafana plugin designed to elevate data visualization in table format. Tailored for business analytics and reporting dashboards, it offers advanced features like tree views, custom cell rendering, data editing, and export capabilities.

## 📋 Requirements

- **Business Table Panel 3.x** requires **Grafana 11** or **Grafana 12**.
- **Business Table Panel 1.x, 2.x** requires **Grafana 10.3** or **Grafana 11**.

## 🚀 Installation

Choose one of the following methods to install the plugin:

### Grafana Plugins Catalog

Visit the official plugin page at [grafana.com/plugins/volkovlabs-table-panel](https://grafana.com/grafana/plugins/volkovlabs-table-panel/) and follow the provided instructions.

### Grafana CLI

Run the following command in your terminal:

```bash
grafana cli plugins install volkovlabs-table-panel
```

## ✨ Key Features

- **Tree View**: Display hierarchical data with expandable and collapsible rows.
- **Tabbed Views**: Switch between multiple data frames within a single panel.
- **Dynamic Filtering**: Filter table data using dashboard variables.
- **Pagination**: Support for client-side and server-side pagination for large datasets.
- **Thresholds**: Apply Grafana’s threshold styling for visual data insights.
- **Custom Cell Types**: Render cells as JSON, Gauge, Image, HTML/Markdown, and more.
- **Data Editing**: Enable permission-based editing with query integration.
- **Export Options**: Download table data as CSV or Excel files.

## 📜 License

This project is licensed under the [Apache License 2.0](https://github.com/grafana/business-table/blob/main/LICENSE).
