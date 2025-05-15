import { Card, Button, Text } from "@shopify/polaris";

export default function AppRating() {
  const url =
    "https://demo-shop-windy.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=1094180700161/theme&target=mainSection";
  const handleAddBlock = () => {
    window.open(url, "_blank");
  };

  return (
    <div style={{ maxWidth: "550px", margin: "40px auto" }}>
      <Card>
        <div style={{ padding: "20px" }}>
          <Text as="h4" variant="headingLg">
            Add block Star Rating to your product detail page
          </Text>

          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <img
              src="https://cdn.pixabay.com/photo/2022/01/25/14/54/stars-6966346_1280.png"
              alt="Star Rating Block"
              width={200}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
} from "@shopify/polaris";
import React from "react";

function SimpleIndexTableExample() {
  const orders = [
    {
      id: "1020",
      order: "#1020",
      date: "Jul 20 at 4:34pm",
      customer: "Jaydon Stanton",
      total: "$969.44",
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: "1019",
      order: "#1019",
      date: "Jul 20 at 3:46pm",
      customer: "Ruben Westerfelt",
      total: "$701.19",
      paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
    },
    {
      id: "1018",
      order: "#1018",
      date: "Jul 20 at 3.44pm",
      customer: "Leo Carder",
      total: "$798.24",
      paymentStatus: <Badge progress="complete">Paid</Badge>,
      fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
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
      <div style={{ textAlign: "center", marginTop: "20px" }}>
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
            { title: "Order" },
            { title: "Date" },
            { title: "Customer" },
            { title: "Total", alignment: "end" },
            { title: "Payment status" },
            { title: "Fulfillment status" },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>
    </>
  );
}
