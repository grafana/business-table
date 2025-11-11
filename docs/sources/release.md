---
title: Release notes
description: Learn about the latest updates, new features, enhancements, fixes, and breaking changes across all versions of the Business Table panel.
keywords:
  - business table
  - release notes
labels:
  products:
    - enterprise
    - oss
    - cloud
weight: 50
image: /img/suite.png
hide_table_of_contents: True
---
import BlogPost from "@theme/BlogPost";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Release notes

Discover the updates to the Business Table panel through these release notes, detailing new features, enhancements, fixes, and breaking changes across all versions.

<Tabs
  defaultValue="v3"
  values={[
    { label: "Version 3", value: "v3" },
    { label: "Version 2", value: "v2" },
    { label: "Version 1", value: "v1" },
  ]}
>
  <TabItem value="v3">
## 3.3.0 (2025-08-18)

This release introduces enhancements to the user experience and functionality of the application. Key updates include improved error handling for Update requests and the addition of a new option to toggle the Manager UI between a table-in-group view and a columns view.

## 3.2.0 (2025-08-07)

This update introduces new features to enhance user experience and functionality, along with important fixes and improvements to existing features.

## 3.1.0 (2025-07-11)

This update brings new features and enhancements designed to improve functionality and user experience.

## 3.0.0 (2025-06-30)

:::warning Breaking Changes

**Grafana Compatibility**: This version requires Grafana 11 or Grafana 12. Please ensure your Grafana instance is updated to a compatible version before upgrading.
:::

We're excited to announce the upcoming release of version 3.0.0 of the Business Table plugin for Grafana. This release introduces new features, important compatibility updates, and several enhancements to improve your experience.

</TabItem>

  <TabItem value="v2">
## 2.7.0 (2025-06-24)

This release focuses on adding variable replacement, Google Sheets export, and default filter values, while improving testing dependencies, sorting behavior, user preferences, and background row rendering.

## 2.6.0 (2025-04-22)

This release focuses on enhancing user experience with sorting preferences, improved image handling, and compatibility updates for Grafana 11.6.

## 2.5.0 (2025-03-30)

Introduces new export options, downloadable file cell types, and user preference management for a more customizable table experience.

## 2.4.0 (2025-03-10)

Enhances data interaction with file upload capabilities, background color options, and improved date formatting.

## 2.3.0 (2025-02-26)

Improves usability with better row highlighting, tooltip options, and compatibility with Grafana 11.5, alongside UI refinements.

## 2.2.0 (2025-02-10)

Focuses on compatibility fixes for Grafana 10.3.0 and introduces row highlighting with auto-scroll functionality.

## 2.1.0 (2025-02-04)

Enhances data export options, introduces new cell types like JSON and Gauge, and improves data link behavior.

## 2.0.0 (2025-01-07)

Brings significant UI improvements, better data handling, and compatibility with Grafana 11.4 for a more robust table panel.

  </TabItem>
  <TabItem value="v1">
## 1.9.0 (2024-12-01)

Introduces new cell types like Image, enhances editing capabilities, and improves table layout and data management.

<BlogPost id="business-table-1.9.0" />

## 1.8.0 (2024-11-21)

Focuses on refining data handling with better sorting, variable support, and improved group behavior for a smoother user experience.

## 1.7.0 (2024-11-16)

Enhances content display with HTML and Markdown support, improves error handling, and adds UI customization options.

## 1.6.0 (2024-10-29)

Improves integration with Grafana 11.3, enhances variable usage, and introduces advanced column customization features.

## 1.5.0 (2024-10-08)

Focuses on improving content editing and security with HTML sanitization, alongside UI enhancements for the code editor.

<BlogPost id="business-table-1.5.0" />

## 1.4.0 (2024-10-02)

Introduces nested object support, enhances testing, and improves pagination and column visibility options.

## 1.3.0 (2024-09-20)

:::warning Breaking Changes
Requires Grafana 10.3 or 11
:::

Major update with editable data features, pagination options, and DataLinks support, requiring Grafana 10.3 or 11.

<BlogPost id="business-table-1.3.0" />

## 1.2.0 (2023-09-05)

Adds visual customization with colored backgrounds, column width options, and compatibility with Grafana 11.2.0.

<BlogPost id="business-table-1.2.0" />

## 1.1.0 (2024-08-22)

Enhances functionality with column filtering, plugin signing, and UI improvements for better data organization.

## 1.0.0 (2024-08-04)

Initial release of the Business Table panel with core features and compatibility with Grafana 11.1.0.

  </TabItem>
</Tabs>
