---
title: Layout
description: Learn how to configure the Layout parameter category to set up tabs, columns, and display types for each tab in the Business Table panel.
keywords:
  - business table
labels:
  products:
    - enterprise
    - oss
    - cloud
weight: 10
---

# Layout

The **Layout** parameter category determines the set of tabs, then the columns, and their display types for each tab.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/layout.png" class="border" alt="The layout category of the Business Table panel." >}}

## Column types for displaying data

You can specify a column display type in **Layout > Format > Type**. The display type determines how the data appears. There are currently 8 available types.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/layout-types.png" class="border" alt="The display data types of the Business Table panel." >}}

### Auto

Same as Colored text. Used by default.

### Boolean

The **Boolean** type displays a checkmark in a circle for a `true` value and an empty circle for a `false` value.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/boolean-type.png" class="border" alt="An example of the Boolean type in the Business Table panel." >}}

### Colored background

The **Colored background** type changes the cell background colors according to the Grafana **Thresholds** configuration.

Using the **Apply to Row** parameter, you can color the entire row (not shown) or only one cell (as shown).

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/colored-background.png" class="border" alt="Colored background type uses Grafana Thresholds feature." >}}

### Colored text

The **Colored text** type changes the cell font colors according to the Grafana **Thresholds** configuration.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/colored-text.png" class="border" alt="Colored text type uses Grafana Thresholds feature." >}}

### Image

The **Image** type interprets the image links and base64 formats.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/image-type.png" class="border" alt="An example of the Image type in the Business Table panel." >}}

### Nested objects

See the [Nested Objects](/plugins/business-table/nested/) section of this documentation.

### Preformatted

The **Preformatted** type, similar to the `pre` HTML tag, displays text with spaces and line breaks preserved. The text appears exactly as written, without any formatting changes.

When the **Preformatted style** switch is ON, the text displays in a fixed-width font.
When the **Preformatted style** switch is OFF, the text displays in the font configured for your browser.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/pre-type.png" class="border" alt="An example of the Preformatted type in the Business Table panel." >}}

### Rich text

The **Rich text** type interprets sanitized HTML and Markdown.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/rich-type.png" class="border" alt="An example of the Rich Text type in the Business Table panel." >}}

HTML from the example above:

```html
<h3>Features/ 2</h3>
- Updated behavior <br />
- Added All options<br />
```

Markdown from the example above:

```markdown
This is the first line.\
And this is the second line.
```

## Other layout parameters

| Section                                                       | Description                                         |
| ------------------------------------------------------------- | --------------------------------------------------- |
| [Multi tables as tabs](#multi-tables-as-tabs)                 | Demonstrates multi table as tabs                    |
| [Tree View/Row grouping](#tree-viewrow-grouping)              | Demonstrates tree view/row grouping                 |
| [Auto-width columns](#auto-width-columns)                     | Demonstrates auto-width columns                     |
| [Table footer](#table-footer)                                 | Explains how the table footer works                 |
| [Filtering in the **Client** and **Query** modes](#filtering) | Demonstrates the **Client** and **Query** filtering |
| [Sorting](#sorting)                                           | Demonstrates column sorting                         |
| [Pin columns](#pin-columns)                                   | Demonstrates column pinning                         |
| [Show and hide columns](#show-and-hide-columns)               | Demonstrates the show/hide column button            |
| [Hide the table header](#hide-the-table-header)             | Explains how to hide the table header               |

### Multi tables as tabs

The Business Table panel lets you create a multi-tab view and configure the fields of each tab separately.

To add a new tab, use the **New Table** parameter.
To add a column to an existing tab, use the **New Column** parameter.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/tabs.png" class="border" alt="The Business Table panel allows you have a multi tabs view." >}}

### Tree View/Row grouping

This feature lets you combine unique field values into groups and collapse or expand them using arrows to create a Tree View-style layout.

{{< video-embed src="/media/docs/grafana/panels-visualizations/business-table/table-treeview.mp4" class="border" >}}

The following image displays the steps to configure Tree View for the Business Table panel:

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/row-grouping.png" class="border" alt="The Business Table panel row grouping." >}}

### Auto-width columns

The column width can be determined automatically within a specified range or explicitly hardcoded by a user in pixels.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/auto-width.png" class="border" alt="Auto-width column property." >}}

### Table footer

Every column in the Business Table panel has the **Show in Footer** property.
If you enable this property for at least one column, a footer appears.

You can select an aggregation function for each column to apply to the value displayed in the footer.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/footer.png" class="border" alt="The Business Table panel supports the Footer feature." >}}

### Filtering

The Business Table panel starts strong with the filtering feature offering two main options:

- Client,
- Query.

#### Client

Every column in the Business Table panel supports the **Filter** feature. When set to **Yes**, a funnel icon is displayed next to the column header.

With **Filter Mode > Client**, when you click the funnel icon, additional filtering options are displayed.

The available options depend on the column data type:

- **String**
  - **Search** (step 5 in the following image). Provides a form where you can type free text or enter a number value for filtering.
  - **Options** (step 6 in the following image). Provides a multi-select list of all existing values in the column.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/filtering-client-string.png" class="border" alt="The Client filtering feature of the Business Table panel for the String data type." >}}

- **Number**

Select from a list of mathematical operations and specify a number to apply it towards.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/filtering-client-number.png" class="border" alt="The Client filtering feature of the Business Table panel for the Number data type." >}}

- **Time**

Select a time range using a standard Grafana range picker.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/filtering-client-time.png" class="border" alt="The Client filtering feature of the Business Table panel for the Time data type." >}}

#### Query

This filtering method enables panel interconnectivity or use in data links. With **Filter Mode > Query**, the displayed data is filtered according to the selected dashboard variables.

The following image shows how to configure **Query** filtering method:

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/filtering-query.png" class="border" alt="The Query filtering feature of the Business Table panel." >}}

In this example, two panels work together (panel interconnectivity). When you select a value on the Business Variable panel, it changes the status displayed in the Business Table panel.

{{< video-embed src="/media/docs/grafana/panels-visualizations/business-table/query-filtering-w-var.mp4" >}}

### Sorting

Every column in the Business Table panel has the **Sort** property. Set it to **Yes** and then specify the default sorting order (ascending or descending). A sorting icon appears next to the column header. The order changes to the opposite when you click the icon.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/sorting.png" class="border" alt="The Business Table panel supports the Sorting feature." >}}

### Pin Columns

Pinning columns is a helpful feature for wide tables. You can pin any column so it always stays visible on the left or right.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/pin.png" class="border" alt="Column pin parameter." >}}

In the following example, the **Country** column is pinned to the left.

{{< video-embed src="/media/docs/grafana/panels-visualizations/business-table/pin.mp4" >}}

### Show and hide columns

{{< admonition type="note" >}}
This feature is supported starting from version 1.5.0.
{{< /admonition >}}

This feature lets you hide or show any column in your Business Table visualization. It's helpful when you want to experiment with the table's visual aspects without removing the column and all its configuration.

Also, a column might be required for the underlying logic but not intended for display.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/hide-show.png" class="border" alt="Hide and show columns in the Business Table panel." >}}

### Hide the table header

{{< admonition type="note" >}}
Hiding the table header is supported starting from Business Table 1.9.0.
{{< /admonition >}}

You can hide the Business Table header from the dashboard by turning off the **Layout > Show header** switch.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/show-hide.png" class="border" alt="Show or hide the table header." >}}

{{< admonition type="note" >}}
The plus icon (the button to add a row) is also hidden when you hide the table header. If you want to allow users to add rows, keep the table header visible.
{{< /admonition >}}
