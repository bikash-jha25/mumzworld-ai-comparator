export function compareProducts(products) {
  const features = ["price", "weight", "age_range"];
  const table = [];

  features.forEach((feature) => {
    const row = { feature };

    products.forEach((p) => {
      row[p.name] = p[feature] || "Not specified";
    });

    table.push(row);
  });

  return { table };
}
