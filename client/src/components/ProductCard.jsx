import React from "react";

export default function ProductCard({ product, isSelected }) {
  return (
    <div style={{
      background: isSelected ? "linear-gradient(135deg, #fff0f5, #fdf4ff)" : "white",
      border: isSelected ? "2px solid #be185d" : "1px solid #fce7f3",
      borderRadius: 16,
      padding: "1.1rem",
      transition: "all 0.2s ease",
      position: "relative",
      boxShadow: isSelected
        ? "0 4px 20px rgba(190,24,93,0.18)"
        : "0 2px 8px rgba(0,0,0,0.05)",
      userSelect: "none",
    }}>
      {/* Selected badge */}
      {isSelected && (
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "#be185d", color: "white",
          width: 22, height: 22, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700,
        }}>✓</div>
      )}

      {/* Image placeholder */}
      <div style={{
        width: "100%", height: 130, borderRadius: 10,
        background: isSelected ? "#fdf0f5" : "#faf9f7",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "0.85rem",
        fontSize: 40,
        border: "1px solid #fce7f3",
      }}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 10 }} />
        ) : (
          "🛒"
        )}
      </div>

      {/* Name */}
      <h3 style={{
        fontFamily: "'DM Sans', 'Noto Kufi Arabic', sans-serif",
        fontWeight: 600, fontSize: 14,
        color: isSelected ? "#9d174d" : "#1c1917",
        marginBottom: "0.4rem",
        lineHeight: 1.35,
      }}>{product.name}</h3>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.4rem" }}>
        {product.price && product.price !== "Not specified" && (
          <span style={{ background: "#fdf0f5", color: "#9d174d", fontSize: 11, fontFamily: "'DM Sans', sans-serif", padding: "2px 8px", borderRadius: 999, fontWeight: 500 }}>
            {product.price}
          </span>
        )}
        {product.weight && product.weight !== "Not specified" && (
          <span style={{ background: "#f0fdf4", color: "#166534", fontSize: 11, fontFamily: "'DM Sans', sans-serif", padding: "2px 8px", borderRadius: 999, fontWeight: 500 }}>
            {product.weight}
          </span>
        )}
        {product.age_range && product.age_range !== "Not specified" && (
          <span style={{ background: "#fffbeb", color: "#92400e", fontSize: 11, fontFamily: "'DM Sans', sans-serif", padding: "2px 8px", borderRadius: 999, fontWeight: 500 }}>
            {product.age_range}
          </span>
        )}
      </div>

      {/* Select CTA */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11, marginTop: "0.65rem",
        color: isSelected ? "#be185d" : "#a8a29e",
        fontWeight: isSelected ? 600 : 400,
      }}>
        {isSelected ? "✓ Selected for comparison" : "Tap to select"}
      </p>
    </div>
  );
}

// import React from "react";

// const ProductCard = ({ product, isSelected }) => {
//   return (
//     <div
//       className={`
//         bg-white rounded-2xl shadow-sm border p-4
//         transition-all duration-300 ease-in-out
//         ${isSelected
//           ? "ring-2 ring-blue-500 shadow-lg scale-[1.03]"
//           : "hover:shadow-lg hover:scale-[1.03]"}
//       `}
//     >
//       <img
//         src={product.image}
//         alt={product.name}
//         className="w-full h-40 object-cover rounded-xl mb-3"
//       />

//       <h3 className="font-semibold text-lg text-gray-800">
//         {product.name}
//       </h3>

//       <div className="text-sm text-gray-600 mt-2 space-y-1">
//         <p>💰 {product.price}</p>
//         <p>⚖️ {product.weight}</p>
//         <p>👶 {product.age}</p>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;