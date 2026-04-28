import React from "react";

export default function Shimmer() {
  return (
    <div style={{ marginTop: "2rem" }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .shimmer-line {
          background: linear-gradient(90deg, #fce7f3 25%, #fdf0f5 50%, #fce7f3 75%);
          background-size: 600px 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
      `}</style>

      {/* Loading label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "2px solid #be185d",
            borderTopColor: "transparent",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: "#9d174d",
          }}
        >
          AI is analyzing your products…
        </span>
      </div>

      {/* Cards shimmer */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              background: "white",
              border: "1px solid #fce7f3",
              borderRadius: 16,
              padding: "1.25rem",
            }}
          >
            <div
              className="shimmer-line"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                marginBottom: "0.75rem",
              }}
            />
            <div
              className="shimmer-line"
              style={{ height: 14, width: "70%", marginBottom: 8 }}
            />
            <div
              className="shimmer-line"
              style={{ height: 12, width: "50%", marginBottom: 6 }}
            />
            <div
              className="shimmer-line"
              style={{ height: 12, width: "40%" }}
            />
          </div>
        ))}
      </div>

      {/* Table shimmer */}
      <div
        style={{
          background: "white",
          border: "1px solid #fce7f3",
          borderRadius: 16,
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          className="shimmer-line"
          style={{ height: 14, width: "30%", marginBottom: "1rem" }}
        />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem" }}
          >
            <div className="shimmer-line" style={{ height: 12, flex: 1 }} />
            <div className="shimmer-line" style={{ height: 12, flex: 1 }} />
            <div className="shimmer-line" style={{ height: 12, flex: 1 }} />
          </div>
        ))}
      </div>

      {/* Verdict shimmer */}
      <div
        style={{
          background: "#fff0f5",
          border: "1px solid #fce7f3",
          borderRadius: 16,
          padding: "1.5rem",
        }}
      >
        <div
          className="shimmer-line"
          style={{ height: 14, width: "20%", marginBottom: "1rem" }}
        />
        <div
          className="shimmer-line"
          style={{ height: 12, width: "90%", marginBottom: 8 }}
        />
        <div
          className="shimmer-line"
          style={{ height: 12, width: "75%", marginBottom: 8 }}
        />
        <div className="shimmer-line" style={{ height: 12, width: "60%" }} />
      </div>
    </div>
  );
}

// const ShimmerCard = () => {
//   return (
//     <div className="bg-white rounded-2xl p-4 shadow animate-pulse">
//       <div className="h-40 bg-gray-200 rounded-xl"></div>

//       <div className="mt-4 space-y-2">
//         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//         <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//         <div className="h-3 bg-gray-200 rounded w-1/3"></div>
//       </div>
//     </div>
//   );
// };

// const Shimmer = () => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//       {[...Array(2)].map((_, i) => (
//         <ShimmerCard key={i} />
//       ))}
//     </div>
//   );
// };

// export default Shimmer;
