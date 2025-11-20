---
title: Nested objects
description: Learn how to work with nested objects in the Business Table panel to handle complex hierarchical data structures.
keywords:
  - business table
labels:
  products:
    - enterprise
    - oss
    - cloud
weight: 60
---

# Nested objects

{{< admonition type="note" >}}
Nested objects feature is supported starting from the Business table 1.5.0
{{< /admonition >}}

Simply put, this feature allows an end-user to add, edit, and delete rows associated with a table cell. Sometimes this feature can be called **Comments**.

Developed to meet the specific requirements of the sponsor, this feature, even in its current form, holds significant potential for the broader open-source community.

## Highlights

- The nested objects/comments can be stored in any data source, the same as a table or completely different.
- An end user can add, edit, and delete nested objects/comments.
- Access to each action is configured separately and can follow Grafana roles or backend configuration.
- The card displaying nested objects/comments supports Markdown.

## Example requirements

I will explain the feature using the following example.

Picture a table visualization used to display orders. Each order is associated with numerous events, and it's the responsibility of the system users to input each event via the dashboard.

In this system, events follow a specific sequence: a status change from received to shipped to delivered, each accompanied by user notes, the event date, and the name of the user who recorded it.

There are two types of users in the system:

- Operators are only allowed to add new events.
- Supervisors, in addition to the operator privileges, are allowed to modify and delete the events.

The image below shows the Business Table panel on the dashboard. It has two orders. The order from Nick R. went through five status changes and, therefore, has five records in the **order status** column.
The order from Mary C. has two records in the **Order status** columns.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/example-1.png" class="border" alt="The Business Table visualization with multiple entries associated with the same row." >}}

To work with all statuses (all records associated with a specific row), a user clicks the **Show All Order Status** link (see the image above). That action opens a pop-up window. See the following illustration below.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/example-2.png" class="border" alt="A pop-up window to work with all associated records. The available actions are segmented by specified privileges." >}}

Please note that the user can add/edit only two fields (title and description) in the current feature design.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/edit.png" class="border" alt="The add/edit event window." >}}

## PostgreSQL database configuration

Below are two tables:

- `orders`. It contains all placed orders.
- `order_status`. It contains all statuses as they change over time. Following the terminology I established in the beginning of this article, this table contains the nested objects or comments.

SQL to create the `orders` table:

```sql
create table orders
(
    order_id integer,
    order_num text,
    customer_name text,
    ordered_item_name text,
    destination_country text
);
```

SQL to create the `order_status` table:

```sql
create table order_status
(
    order_status_id integer,
    order_id integer,
    date timestamp default now(),
    title text,
    description text,
    user_name text
);
```

Data example in these tables.

The `orders` table.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/orders.png" class="border" alt="How the orders table can be populated." >}}

The `order_status` table.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/order-status.png" class="border" alt="How the orders_status table can be populated." >}}

SQL to populate the `orders` and `order_status` tables:

```sql

insert into order_status(order_status_id, order_id, date, title, description, user_name) values
                        (1, 1, '2024-10-04 13:27:00.00', 'received', 'The order is in the system, but no funds transferred yet.', 'bob.r');
insert into order_status(order_status_id, order_id, date, title, description, user_name) values
                        (2, 1, '2024-10-05 15:01:00.00', 'received', 'Error on our side, proceed with the order.', 'rob.b');
insert into order_status(order_status_id, order_id, date, title, description, user_name) values
                        (3, 1, '2024-10-06 15:01:00.00', 'packed', 'The order is moved to the next step', 'bob.r');
insert into order_status(order_status_id, order_id, date, title, description, user_name) values
                        (4, 1, '2024-10-06 21:11:00.00', 'shipped', 'The payment has been received.', 'bob.r');
insert into order_status(order_status_id, order_id, date, title, description, user_name) values
                        (5, 1, '2024-10-16 11:40:00.00', 'delivered', 'All good.', 'bob.r');
insert into order_status(order_status_id, order_id, date, title, description, user_name) values
                        (6, 2, '2024-10-04 08:30:00.00', 'received', 'The ordered item is not in stock until next month.', 'bob.r');
insert into order_status(order_status_id, order_id, date,  title, description, user_name) values
                        (7, 2, '2024-10-05 09:15:00.00', 'refunded', 'Full refund has been placed.', 'bob.r');
insert into order_status(order_status_id, order_id, date, title, description, user_name) values
                        (8, 3, '2024-10-05 08:30:00.00', 'received', 'The ordered item is ready for packing.', 'bob.r');
insert into order_status(order_status_id, order_id, date, title, description, user_name) values
                        (9, 3, '2024-10-05 09:15:00.00', 'packed', 'All good', 'bob.r');
insert into order_status(order_status_id, order_id, date, title, description, user_name) values
                        (10, 3, '2024-10-05 23:15:00.00', 'shipped', 'All good', 'bob.r');
insert into order_status(order_status_id, order_id, date, title, description, user_name) values
                        (11, 3, '2024-10-15 23:15:00.00', 'delivered', 'All good', 'bob.r');

```

## Grafana configuration

Start with the data frame configuration. In my example, the query returns all orders and the column containing the list of unique order status identifiers.

I utilize Grafana's transformation, **Convert field type**, to ensure the array of status identifiers can be processed correctly.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/query.png" class="border" alt="The data frame query with array of orders." >}}

SQL to return data frame for the Business Table panel:

```sql
select *,
array_to_json(array(
  select order_status_id
  from order_status os
  where os.order_id = oo.order_id
)) as order_status
from orders oo order by oo.order_id;
```

In the Business Table options -> **Layout** ensure to:

1. Add a column to display the nested objects/comments,
1. Set its type to **Nested Objects**,
1. Select the configured **Object** from the list.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/layout.png" class="border" alt="Add and configure the column with nested objects/comments in the Layout category." >}}

In the **Nested objects** category:

1. Add a column to display nested objects/comments.
1. Select a type. Only the **Card** type exists for now.
1. Configure the query to fetch the nested objects/comments initially in the **Get options**.
1. Specify a data source where your nested objects/comments are kept.
1. Create a query. In this example, I use the SQL query with predefined `${payload.ids:csv}` as a combined list of identifiers.
1. Ensure that **Id Field** is populated with the column name containing the unique comment identifier.
1. Configure the comment card. See below for more details.
1. Set the nested objects/comments sorting: **Show first**, **None**, **Show latest**.
1. Specify how many nested objects/comments to show at once.
1. Configure the allowed actions and user privileges. See below for more details.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/nested.png" class="border" alt="Configure a column in the Nested objects category." >}}

SQL from the **Get Options->Query Editor** parameter:

```sql
SELECT * FROM order_status WHERE order_status_id IN (${payload.ids:csv});
```

## Comment Card

Configuring a comment card means identifying data frame column names for display. Starting from release 1.5.0, you can specify four column names. An end user can enter only top and bottom **title** and **description** when adding or editing objects. Fields in the middle can display dates, user login who did changes, etc.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/card.png" class="border" alt="Configure fields to display on a comment card." >}}

## Actions and permission

There are three actions you can allow users to perform on the nested objects/comments. All three actions are available in the pop-up window after a user clicks on the **Show All** link.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/actions.png" class="border" alt="Actions you can allow users to perform on the nested objects/comments." >}}

To configure actions and access to them, use the **Nested objects**->Column name->**Operations**:

1. Set the **Add Options**, **Update Options**, **Delete Options** switch to ON.
1. Select **Check** parameter, where you have three options:

   - **By Org User Role**. With that, specify roles that should have access to this action. It is a multi-select drop-down with the following values: **Admin**, **Editor**, **Viewer**, **None**.
   - **Always Allowed**. Any user will have access to this action.
   - **By Backend**. With that, specify a data frame column name with a boolean type. If the returned value is **true**, the access is given. If the returned value is **false**, the access is NOT given.

{{< figure src="/media/docs/grafana/panels-visualizations/business-table/action-config.png" class="border" alt="Action configuration example." >}}

### SQL example

#### Add action

```sql
INSERT INTO order_status (order_status_id, order_id, title, description)
VALUES (nextval('seq_order_status'), ${payload.row.order_id}, ${payload.item.title:sqlstring}, ${payload.item.description:sqlstring})
```

#### Update action

```sql
UPDATE order_status
SET title = ${payload.item.title:sqlstring}, description = ${payload.item.description:sqlstring}
WHERE order_status_id = ${payload.item.order_status_id};
```

#### Delete action

```sql
DELETE FROM order_status
WHERE order_status_id = ${payload.item.order_status_id};
```

## Working with non-standard data sources

In some cases, certain data sources may not fully align with the standard behavior described above. This is due to differences in how various data sources handle query execution and configuration.

For example, when using `Trino`, some internal parameters — such as `refId` — are not automatically passed in the payload. As a result, queries may not execute correctly or may fail altogether unless additional configuration is provided.

To work around this limitation, you may need to manually modify the JSON configuration file and explicitly define missing parameters like `refId`. Alternatively, other custom integration strategies may be required depending on the data source.

This is not considered a bug.

When configuring nested data source options in the Business Table panel, it relies on Grafana’s built-in `getdata sourceSrv` from `@grafana/runtime` to resolve and interact with data sources. The same mechanism is used when editing or executing queries.

In the case of data sources like PostgreSQL, parameters such as refId are automatically included by the data source plugin itself. However, for data sources like Trino, manual configuration may be necessary, as these plugins may not inject such values by default.

Custom handling isn't implemented for each data source. Instead, the request is delegated to `usedata sourceRequest`, which consumes the full request configuration using the standard Grafana runtime.
