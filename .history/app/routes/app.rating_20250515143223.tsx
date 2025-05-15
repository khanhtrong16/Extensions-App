import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
  Button,
} from "@shopify/polaris";
import React from "react";

export default function AppRating() {
  const url =
    "https://demo-shop-windy.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=1094180700161/theme&target=mainSection";
  const handleAddBlock = () => {
    window.open(url, "_blank");
  };

  const orders = [
    {
      product: "Product 1",
      rating: 4.5,
      count: 100,
      customer: "Customer 1",
    },
    {
      product: "Product 2",
    },
  ];
  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  const rowMarkup = orders.map(
    (
      { id, order, date, customer, total, paymentStatus, fulfillmentStatus },
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {order}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{date}</IndexTable.Cell>
        <IndexTable.Cell>{customer}</IndexTable.Cell>
        <IndexTable.Cell>
          <Text as="span" alignment="end" numeric>
            {total}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{paymentStatus}</IndexTable.Cell>
        <IndexTable.Cell>{fulfillmentStatus}</IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <>
      <div style={{ marginBottom: "1s0px" }}>
        <Button onClick={handleAddBlock}>Add block Star Rating</Button>
      </div>
      <LegacyCard>
        <IndexTable
          resourceName={resourceName}
          itemCount={orders.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Product" },
            { title: "Rating" },
            { title: "Count" },
            { title: "Customer" },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>
    </>
  );
}
