interface PriceTagProps {
  price: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceTag({ price, size = "md", className = "" }: PriceTagProps) {
  const sizes = {
    sm: { yen: "0.7rem", price: "0.95rem" },
    md: { yen: "0.85rem", price: "1.2rem" },
    lg: { yen: "1rem", price: "1.6rem" },
  };

  return (
    <span className={`text-[#D4450C] ${className}`} style={{ fontWeight: 700, lineHeight: 1 }}>
      <span style={{ fontSize: sizes[size].yen }}>¥</span>
      <span style={{ fontSize: sizes[size].price }}>{price.toLocaleString()}</span>
    </span>
  );
}
