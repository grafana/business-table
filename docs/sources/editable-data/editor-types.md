---
title: Editor types
description: Learn how to configure different UI editor types for columns when users add or edit data rows in the Business Table panel.
keywords:
  - business table
labels:
  products:
    - enterprise
    - oss
    - cloud
weight: 40
---
import Image from "@theme/Image";

# Editor types

The **Editor types** are the UI type elements for the columns when a user adds/edits a data row.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/editor-types.png" max-width="350px" class="border" alt="Types of the addible/editable columns." >}}

## Date Time

The **Date Time** type allows users to enter a value in the DateTime format using a standard Grafana component.

Optionally, you can specify a range of permitted date-times using **Set Min Date** and **Set Max Date** parameters.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/datetime-editor-type.png" class="border" alt="An example of the Date Time Editor type in the Business Table panel." >}}

## Switch

{{< admonition type="note" >}}
**Switch** editor type is available starting from version 1.9.0.
{{< /admonition >}}

The **Switch** editor type makes the user's work with the Business Table panel more intuitive while transforming the boolean type data into a switch that can be turned on and off.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/switch-editor-type.png" class="border" alt="An example of the Switch Editor type in the Business Table panel." >}}

## Number

The **Number** type allows a user to enter a numerical value. Optionally, you can specify the **Min** and **Max** for the allowed values.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/number-editor-type.png" class="border" alt="An example of the Number Editor type in the Business Table panel." >}}

## Select

The **Select** types gives users a drop-down populated from the **Value Field** parameter. Optionally, you can specify **Label Field**. Both parameters, **Value field** and **Label Field**, come from the `dataframe:column` of your data source.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/select-editor-type.png" class="border" alt="An example of the Date Time Editor type in the Business Table panel." >}}

{{< admonition type="note" >}}
**Allow custom value** feature is available starting from version 1.9.0.
{{< /admonition >}}

If allowed, a user can enter a custom value in the prepopulated drop-down list while adding or editing a row.

{{< video-embed src="/media/docs/grafana/panels-visualizations/business-table/select-new-value.mp4" >}}

To allow that, ensure to set **Allow custom value** to ON.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/allow-custom-values.png" class="border" alt="Allow custom values parameter in the Add data and Edit data for the select type column." >}}

## String

The **String** type allows a user to enter any value.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/string-editor-type.png" class="border" alt="An example of the String Editor type in the Business Table panel." >}}

## Text Area

{{< admonition type="note" >}}
**Text Area** editor type is available starting from version 1.9.0.
{{< /admonition >}}

The **Text Area** editor type is designed to add and edit multi-row text values.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/textarea-editor-type.png" class="border" alt="An example of the Text Area Editor type in the Business Table panel." >}}
