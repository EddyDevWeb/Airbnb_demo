// src/components/ListingCard.tsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { type Listing } from "../types/listing";
import { addFavorite, removeFavorite } from "../services/favorite.service";
import useAuth from "../hooks/useAuth";

interface Props {
  item: Listing;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}

export default function ListingCard({ item, isFavorited = false, onToggleFavorite }: Props) {
  const { _id, title, location, price, images, category } = item;
  const categoryName = typeof category === "object" ? category.name : category;
  const { user } = useAuth();
  const [favLoading, setFavLoading] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?.user?.id || favLoading) return;

    setFavLoading(true);
    try {
      if (isFavorited) {
        await removeFavorite(_id);
        toast.success("Eliminado de favoritos");
      } else {
        await addFavorite(_id);
        toast.success("Agregado a favoritos");
      }
      onToggleFavorite?.();
    } catch {
      toast.error("Error al actualizar favorito");
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="relative">
      {user?.user?.id && (
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-10 bg-white/80 rounded-full p-2 hover:bg-white transition shadow-sm"
        >
          {isFavorited ? "❤️" : "🤍"}
        </button>
      )}

      <Link
        to={`/listing/${_id}`}
        className="
          block bg-white rounded-xl overflow-hidden shadow-sm 
          hover:shadow-lg transition-all cursor-pointer
          hover:-translate-y-1
        "
      >
        <div className="w-full h-52 overflow-hidden">
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="p-4">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-gray-600 text-sm">{location}</p>

          <div className="flex justify-between items-center mt-4">
            <span className="text-gray-500 text-sm capitalize">{categoryName}</span>
            <span className="font-bold">${price}/noche</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
