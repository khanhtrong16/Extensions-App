import { LoaderFunction } from "@remix-run/node";
import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Button,
  ButtonGroup,
} from "@shopify/polaris";
import { authenticate } from "app/shopify.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  //   const reponsive = await admin.graphql(
  //     `#graphql
  //         query()

  //     `,
  //   );
  console.log("test: ", product.metafields.star.review);

  return null;
};

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

  const handleEdit = (id: string) => {
    console.log("Edit item:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete item:", id);
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
              Edit
            </Button>
            <Button
              size="slim"
              tone="critical"
              onClick={() => handleDelete(id)}
            >
              Delete
            </Button>
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
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
            { title: "Actions" },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>
    </>
  );
}
