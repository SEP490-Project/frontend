import { Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function NewArrivals() {
  const [favorites, setFavorites] = useState<number[]>([2, 4]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    );
  };

  const allProducts = [
    // Page 1
    [
      {
        id: 1,
        name: "All-Around Safe Block Essence Sun SPF45+",
        description: "All Around Safe Block Sun Milk SPF50+/PA+++",
        price: "32$",
        image: "/new-arrivals/pink-sunscreen-bottle-with-dropper-and-cherry-blos.jpg",
        discount: null,
        buttonStyle: "outline",
      },
      {
        id: 2,
        name: "Super Aqua Snail Cream",
        description: "Skin Reinforcement Gel Type Cream",
        price: "32$",
        image: "/new-arrivals/minimalist-skincare-packaging-with-snail-cream.jpg",
        discount: "-20%",
        buttonStyle: "outline",
      },
      {
        id: 3,
        name: "Clarifying Emulsion",
        description: "with Bija Seed Oil",
        price: "32$",
        image: "/new-arrivals/innisfree-pink-tube-skincare-product.jpg",
        discount: null,
        buttonStyle: "outline",
      },
      {
        id: 4,
        name: "Dewy Glow Jelly Cream",
        description: "With Jeju Cherry Blossom",
        price: "32$",
        image: "/new-arrivals/pink-jar-cream-with-cherry-blossom-innisfree.jpg",
        discount: null,
        buttonStyle: "outline",
      },
    ],
    // Page 2
    [
      {
        id: 5,
        name: "Hydrating Toner Essence",
        description: "Deep Moisture with Hyaluronic Acid",
        price: "28$",
        image: "/new-arrivals/pink-sunscreen-bottle-with-dropper-and-cherry-blos.jpg",
        discount: "-15%",
        buttonStyle: "outline",
      },
      {
        id: 6,
        name: "Vitamin C Brightening Serum",
        description: "Radiance Boosting Formula",
        price: "45$",
        image: "/new-arrivals/minimalist-skincare-packaging-with-snail-cream.jpg",
        discount: null,
        buttonStyle: "outline",
      },
      {
        id: 7,
        name: "Gentle Foam Cleanser",
        description: "pH Balanced Daily Cleanser",
        price: "24$",
        image: "/new-arrivals/innisfree-pink-tube-skincare-product.jpg",
        discount: null,
        buttonStyle: "outline",
      },
      {
        id: 8,
        name: "Night Recovery Mask",
        description: "Overnight Intensive Treatment",
        price: "38$",
        image: "/new-arrivals/pink-jar-cream-with-cherry-blossom-innisfree.jpg",
        discount: "-10%",
        buttonStyle: "outline",
      },
    ],
    // Page 3
    [
      {
        id: 9,
        name: "Eye Cream Anti-Aging",
        description: "Peptide Complex for Fine Lines",
        price: "52$",
        image: "/new-arrivals/pink-sunscreen-bottle-with-dropper-and-cherry-blos.jpg",
        discount: null,
        buttonStyle: "outline",
      },
      {
        id: 10,
        name: "Exfoliating Scrub",
        description: "Gentle Weekly Treatment",
        price: "29$",
        image: "/new-arrivals/minimalist-skincare-packaging-with-snail-cream.jpg",
        discount: null,
        buttonStyle: "outline",
      },
      {
        id: 11,
        name: "Moisturizing Cream",
        description: "Rich Barrier Repair Formula",
        price: "35$",
        image: "/new-arrivals/innisfree-pink-tube-skincare-product.jpg",
        discount: "-25%",
        buttonStyle: "outline",
      },
      {
        id: 12,
        name: "Lip Treatment Balm",
        description: "Nourishing Overnight Care",
        price: "18$",
        image: "/new-arrivals/pink-jar-cream-with-cherry-blossom-innisfree.jpg",
        discount: null,
        buttonStyle: "outline",
      },
    ],
  ];

  const totalPages = allProducts.length;
  // const currentProducts = allProducts[currentPage]

  const goToPage = (pageIndex: number) => {
    if (pageIndex === currentPage || isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(pageIndex);
      setIsTransitioning(false);
    }, 300);
  };

  const goToPrevPage = () => {
    const prevPage = currentPage > 0 ? currentPage - 1 : totalPages - 1;
    goToPage(prevPage);
  };

  const goToNextPage = () => {
    const nextPage = currentPage < totalPages - 1 ? currentPage + 1 : 0;
    goToPage(nextPage);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-2">
            <svg
              width="51"
              height="13"
              viewBox="0 0 51 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1.12622 9.91605C1.74767 10.2786 1.76816 10.3384 1.48583 10.9653C0.938158 12.1818 1.0657 12.5809 2.09704 12.8752C3.27664 13.2116 5.21013 12.8431 6.32991 12.0682C6.75399 11.7748 7.72923 11.1344 8.49731 10.6453L9.89384 9.75583C34.4322 9.76198 21.3992 9.74652 50.5 9.74652L50.5 9.19254L50.5 8.63855L31.299 8.63855L23.6563 8.63855L22.6829 6.7683C21.1398 3.80337 18.5783 1.52516 15.4873 0.368438C14.0284 -0.17757 13.7214 -0.131476 13.9099 0.605768C14.246 1.92004 15.7648 4.45619 16.9842 5.739C17.9197 6.72316 18.7692 7.81409 20.2703 8.63235L12.5448 8.63545L9.93457 8.63855L8.75055 7.92967C8.09907 7.53989 7.22531 6.94424 6.80892 6.60609C5.12587 5.24019 1.3883 4.93372 1.20745 6.14695C1.16649 6.42195 1.29776 6.96153 1.49933 7.34622C1.70089 7.7309 1.83915 8.05975 1.80656 8.07681C0.300409 8.86812 0.12817 9.33348 1.12622 9.91605ZM6.41463 8.73649C5.61815 8.23968 3.97932 8.08124 2.95753 8.40233C1.25773 8.93659 1.37853 9.50609 3.29479 9.99404C4.14481 10.2105 4.57424 10.2072 5.43427 9.97809C6.89759 9.58787 7.18877 9.21935 6.41463 8.73649ZM3.43165 10.866C2.69405 10.7082 2.51646 10.7433 2.32491 11.0841C1.84054 11.9456 2.03187 12.1843 3.20216 12.1792C4.46392 12.1736 5.95285 11.5975 6.63528 10.851L7.10079 10.3417L6.5189 10.5024C4.83144 10.968 4.23582 11.038 3.43165 10.866ZM6.63528 7.53413C5.95285 6.78758 4.46392 6.21143 3.20216 6.20589C2.29977 6.2019 2.09797 6.27237 2.10356 6.58881C2.11938 7.44815 2.50436 7.71739 3.43398 7.51862C4.23559 7.34711 4.83283 7.41757 6.5189 7.88269L7.10079 8.04335L6.63528 7.53413ZM19.4777 3.6538C18.3639 2.61031 15.8527 1.10436 15.2266 1.10436C14.8419 1.10436 14.9043 1.29847 15.8078 2.91079C16.2622 3.7216 17.098 4.84641 17.6657 5.41015C18.6802 6.4184 20.647 7.75218 21.1188 7.75218C21.251 7.75218 20.4303 6.86358 19.2947 5.77755C17.7313 4.28201 17.2688 3.7072 17.3889 3.40871C17.5197 3.08452 17.9368 3.38367 19.7493 5.10213C20.9603 6.25021 21.9509 7.10955 21.9509 7.01161C21.9509 6.55069 20.5732 4.68044 19.4777 3.6538Z"
                fill="#383838"
              />
            </svg>

            <h1 className="text-2xl font-bold text-[#383838] tracking-wider">NEW ARRIVALS</h1>
            <svg
              width="51"
              height="13"
              viewBox="0 0 51 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M49.8738 9.91605C49.2523 10.2786 49.2318 10.3384 49.5142 10.9653C50.0618 12.1818 49.9343 12.5809 48.903 12.8752C47.7234 13.2116 45.7899 12.8431 44.6701 12.0682C44.246 11.7748 43.2708 11.1344 42.5027 10.6453L41.1062 9.75583C16.5678 9.76198 29.6008 9.74652 0.5 9.74652L0.5 9.19254L0.5 8.63855L19.701 8.63855L27.3437 8.63855L28.3171 6.7683C29.8602 3.80337 32.4217 1.52516 35.5127 0.368438C36.9716 -0.17757 37.2786 -0.131476 37.0901 0.605768C36.754 1.92004 35.2352 4.45619 34.0158 5.739C33.0803 6.72316 32.2308 7.81409 30.7297 8.63235L38.4552 8.63545L41.0654 8.63855L42.2495 7.92967C42.9009 7.53989 43.7747 6.94424 44.1911 6.60609C45.8741 5.24019 49.6117 4.93372 49.7925 6.14695C49.8335 6.42195 49.7022 6.96153 49.5007 7.34622C49.2991 7.7309 49.1609 8.05975 49.1934 8.07681C50.6996 8.86812 50.8718 9.33348 49.8738 9.91605ZM44.5854 8.73649C45.3819 8.23968 47.0207 8.08124 48.0425 8.40233C49.7423 8.93659 49.6215 9.50609 47.7052 9.99404C46.8552 10.2105 46.4258 10.2072 45.5657 9.97809C44.1024 9.58787 43.8112 9.21935 44.5854 8.73649ZM47.5683 10.866C48.3059 10.7082 48.4835 10.7433 48.6751 11.0841C49.1595 11.9456 48.9681 12.1843 47.7978 12.1792C46.5361 12.1736 45.0472 11.5975 44.3647 10.851L43.8992 10.3417L44.4811 10.5024C46.1686 10.968 46.7642 11.038 47.5683 10.866ZM44.3647 7.53413C45.0472 6.78758 46.5361 6.21143 47.7978 6.20589C48.7002 6.2019 48.902 6.27237 48.8964 6.58881C48.8806 7.44815 48.4956 7.71739 47.566 7.51862C46.7644 7.34711 46.1672 7.41757 44.4811 7.88269L43.8992 8.04335L44.3647 7.53413ZM31.5223 3.6538C32.6361 2.61031 35.1473 1.10436 35.7734 1.10436C36.1581 1.10436 36.0957 1.29847 35.1922 2.91079C34.7378 3.7216 33.902 4.84641 33.3343 5.41015C32.3198 6.4184 30.353 7.75218 29.8812 7.75218C29.749 7.75218 30.5697 6.86358 31.7053 5.77755C33.2687 4.28201 33.7312 3.7072 33.6111 3.40871C33.4803 3.08452 33.0632 3.38367 31.2507 5.10213C30.0397 6.25021 29.0491 7.10955 29.0491 7.01161C29.0491 6.55069 30.4268 4.68044 31.5223 3.6538Z"
                fill="#383838"
              />
            </svg>
          </div>
          <button className="text-[#697586] hover:text-[#383838] transition-colors">See All</button>
        </div>

        <div className="relative overflow-hidden">
          <button
            onClick={goToPrevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-[#B0A6BD] bg-opacity-60 flex items-center justify-center hover:bg-opacity-80 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={goToNextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-[#B0A6BD] bg-opacity-60 flex items-center justify-center hover:bg-opacity-80 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="relative w-full">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {allProducts.map((products, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-full">
                    {products.map((product) => (
                      <div key={product.id} className="group flex flex-col h-full">
                        {/* Product Image Container */}
                        <div className="relative bg-[#fec6d4] bg-opacity-20 rounded-lg mb-4 aspect-square overflow-hidden">
                          {product.discount && (
                            <div className="absolute top-4 left-4 bg-[#fec6d4] text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                              {product.discount}
                            </div>
                          )}
                          <button
                            onClick={() => toggleFavorite(product.id)}
                            className="absolute top-4 right-4 z-10 transition-transform hover:scale-110 active:scale-95"
                          >
                            <Heart
                              className={`w-6 h-6 transition-all duration-300 ${
                                favorites.includes(product.id)
                                  ? "text-red-500 fill-red-500 animate-pulse"
                                  : "text-[#b0a6bd] hover:text-red-400"
                              }`}
                            />
                          </button>
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <h3 className="font-semibold text-[#383838] text-lg leading-tight line-clamp-2">
                              {product.name}
                            </h3>

                            {/* Star Rating */}
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-[#dfe1e3] fill-current" />
                              ))}
                              <span className="text-[#697586] text-sm ml-2">(0)</span>
                            </div>

                            <p className="text-[#697586] text-sm line-clamp-2">
                              {product.description}
                            </p>

                            <p className="font-semibold text-[#383838] text-lg">{product.price}</p>
                          </div>

                          <Button
                            className={`w-full py-3 font-medium transition-all duration-200 mt-4 hover:scale-[1.02] active:scale-[0.98] ${
                              product.buttonStyle === "filled"
                                ? "bg-[#383838] text-white hover:bg-[#383838]/90 hover:shadow-lg"
                                : "bg-transparent border border-[#dfe1e3] text-[#383838] hover:bg-[#383838] hover:text-white hover:border-[#383838] hover:shadow-md"
                            }`}
                            variant={product.buttonStyle === "filled" ? "default" : "outline"}
                          >
                            Add To Bag
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-12">
          {allProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentPage
                  ? "bg-[#b0a6bd] scale-110"
                  : "bg-[#dfe1e3] hover:bg-[#b0a6bd]/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
