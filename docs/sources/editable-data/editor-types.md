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

<Image
  title="Types of the addible/editable columns."
  src="/img/plugins/business-table/editor-types.png"
  width="70%"
/>

## Date Time

The **Date Time** type allows users to enter a value in the DateTime format using a standard Grafana component.

Optionally, you can specify a range of permitted date-times using **Set Min Date** and **Set Max Date** parameters.

<Image
  title="An example of the Date Time Editor type in the Business Table panel."
  src="/img/plugins/business-table/datetime-editor-type.png"
/>

## Switch

:::info version
**Switch** editor type is available starting from version 1.9.0.
:::

The **Switch** editor type makes the user's work with the Business Table panel more intuitive while transforming the boolean type data into a switch that can be turned on and off.

<Image
  title="An example of the Switch Editor type in the Business Table panel."
  src="/img/plugins/business-table/switch-editor-type.png"
/>

## Number

The **Number** type allows a user to enter a numerical value. Optionally, you can specify the **Min** and **Max** for the allowed values.

<Image
  title="An example of the Number Editor type in the Business Table panel."
  src="/img/plugins/business-table/number-editor-type.png"
/>

## Select

The **Select** types gives users a drop-down populated from the **Value Field** parameter. Optionally, you can specify **Label Field**. Both parameters, **Value field** and **Label Field**, come from the `dataframe:column` of your data source.

<Image
  title="An example of the Date Time Editor type in the Business Table panel."
  src="/img/plugins/business-table/select-editor-type.png"
/>

:::info version
**Allow custom value** feature is available starting from version 1.9.0.
:::

If allowed, a user can enter a custom value in the prepopulated drop-down list while adding or editing a row.

<Image
  title="If allowed, a user can enter a custom value in the prepopulated drop-down list while adding or editing a row."
  src="/img/plugins/business-table/select-new-value.gif"
/>

To allow that, ensure to set **Allow custom value** to ON.

<Image
  title="Allow custom values parameter in the Add data and Edit data for the select type column."
  src="/img/plugins/business-table/allow-custom-values.png"
/>

## String

The **String** type allows a user to enter any value.

<Image
  title="An example of the String Editor type in the Business Table panel."
  src="/img/plugins/business-table/string-editor-type.png"
/>

## Text Area

:::info version
**Text Ares** editor type is available starting from version 1.9.0.
:::

The **Text Area** editor type is designed to add and edit multi-row text values.

<Image
  title="An example of the Text Area Editor type in the Business Table panel."
  src="/img/plugins/business-table/textarea-editor-type.png"
/>
