import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Button,
  ButtonGroup,
  Icon,
} from "@shopify/polaris";
import { EditIcon, DeleteIcon } from "@shopify/polaris-icons";
import React from "react";

export default function AppRating() {
  const url =
    "https://demo-shop-windy.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=1094180700161/theme&target=mainSection";

  const handleAddBlock = () => {
    window.open(url, "_blank");
  };

  const orders = [
    {
      id: "1",
      product: "Product 1",
      rating: 4.5,
      count: 100,
      customer: "Customer 1",
    },
    {
      id: "2",
      product: "Product 2",
      rating: 3.8,
      count: 75,
      customer: "Customer 2",
    },
  ];

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  const handleEdit = (id) => {
    console.log("Edit item:", id);
    // Thêm logic chỉnh sửa tại đây
  };

  const handleDelete = (id) => {
    console.log("Delete item:", id);
    // Thêm logic xóa tại đây
  };

  const rowMarkup = orders.map(
    ({ id, product, rating, count, customer }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {product}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{rating}</IndexTable.Cell>
        <IndexTable.Cell>{count}</IndexTable.Cell>
        <IndexTable.Cell>{customer}</IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup>
            <Button size="slim" onClick={() => handleEdit(id)}>
              <Icon source={EditIcon} />
            </Button>
            <Button size="slim" destructive onClick={() => handleDelete(id)}>
              <Icon source={DeleteIcon} />
            </Button>
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <Button primary onClick={handleAddBlock}>
          Add block Star Rating
        </Button>
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
            { title: "Actions" },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>
    </>
  );
}
