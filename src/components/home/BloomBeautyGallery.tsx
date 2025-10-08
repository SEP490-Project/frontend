import { Button } from "@/components/ui/button";
import { Instagram, ShoppingBag } from "lucide-react";

export default function BloomBeautyGallery() {
  const galleryItems = [
    {
      id: 1,
      image: "./public/gallery/skincare-clay-mask-jar-with-pink-packaging.jpg",
    },
    {
      id: 2,
      image: "./public/gallery/beauty-store-interior-with-pink-and-white-products.jpg",
    },
    {
      id: 3,
      image: "./public/gallery/pink-cream-in-glass-jar-skincare-product.jpg",
    },
    {
      id: 4,
      image: "./public/gallery/hands-holding-white-beauty-device-skincare-tool.jpg",
    },
    {
      id: 5,
      image: "./public/gallery/pink-skincare-tubes-with-scrunchie-beauty-products.jpg",
    },
    {
      id: 6,
      image: "./public/gallery/asian-woman-applying-makeup-with-brush-beauty-rout.jpg",
    },
    {
      id: 7,
      image: "./public/gallery/hands-holding-golden-serum-bottle-skincare-product.jpg",
    },
    {
      id: 8,
      image: "./public/gallery/blue-hyaluronic-acid-skincare-tubes-beauty-product.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#ffffff] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Left decorative arrow */}
            <svg
              width="51"
              height="14"
              viewBox="0 0 51 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1.12622 10.416C1.74767 10.7786 1.76816 10.8384 1.48583 11.4653C0.938158 12.6818 1.0657 13.0809 2.09704 13.3752C3.27664 13.7116 5.21013 13.3431 6.32991 12.5682C6.75399 12.2748 7.72923 11.6344 8.49731 11.1453L9.89384 10.2558C34.4322 10.262 21.3992 10.2465 50.5 10.2465L50.5 9.69254L50.5 9.13855L31.299 9.13855L23.6563 9.13855L22.6829 7.2683C21.1398 4.30337 18.5783 2.02516 15.4873 0.868438C14.0284 0.32243 13.7214 0.368524 13.9099 1.10577C14.246 2.42004 15.7648 4.95619 16.9842 6.239C17.9197 7.22316 18.7692 8.31409 20.2703 9.13235L12.5448 9.13545L9.93457 9.13855L8.75055 8.42967C8.09907 8.03989 7.22531 7.44424 6.80892 7.10609C5.12587 5.74019 1.3883 5.43372 1.20745 6.64695C1.16649 6.92195 1.29776 7.46153 1.49933 7.84622C1.70089 8.2309 1.83915 8.55975 1.80656 8.57681C0.300409 9.36812 0.12817 9.83348 1.12622 10.416ZM6.41463 9.23649C5.61815 8.73968 3.97932 8.58124 2.95753 8.90233C1.25773 9.43659 1.37853 10.0061 3.29479 10.494C4.14481 10.7105 4.57424 10.7072 5.43427 10.4781C6.89759 10.0879 7.18877 9.71935 6.41463 9.23649ZM3.43165 11.366C2.69405 11.2082 2.51646 11.2433 2.32491 11.5841C1.84054 12.4456 2.03187 12.6843 3.20216 12.6792C4.46392 12.6736 5.95285 12.0975 6.63528 11.351L7.10079 10.8417L6.5189 11.0024C4.83144 11.468 4.23582 11.538 3.43165 11.366ZM6.63528 8.03413C5.95285 7.28758 4.46392 6.71143 3.20216 6.70589C2.29977 6.7019 2.09797 6.77237 2.10356 7.08881C2.11938 7.94815 2.50436 8.21739 3.43398 8.01862C4.23559 7.84711 4.83283 7.91757 6.5189 8.38269L7.10079 8.54335L6.63528 8.03413ZM19.4777 4.1538C18.3639 3.11031 15.8527 1.60436 15.2266 1.60436C14.8419 1.60436 14.9043 1.79847 15.8078 3.41079C16.2622 4.2216 17.098 5.34641 17.6657 5.91015C18.6802 6.9184 20.647 8.25218 21.1188 8.25218C21.251 8.25218 20.4303 7.36358 19.2947 6.27755C17.7313 4.78201 17.2688 4.2072 17.3889 3.90871C17.5197 3.58452 17.9368 3.88367 19.7493 5.60213C20.9603 6.75021 21.9509 7.60955 21.9509 7.51161C21.9509 7.05069 20.5732 5.18044 19.4777 4.1538Z"
                fill="#383838"
              />
            </svg>

            <h1 className="text-2xl md:text-3xl font-bold text-[#383838] tracking-wide">
              SHARE HOW YOU BLOSSOMED WITH <span className="text-[#fec6d4]">#BSHOWSELL</span>
            </h1>

            {/* Right decorative arrow */}
            <svg
              width="51"
              height="14"
              viewBox="0 0 51 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M49.8738 10.416C49.2523 10.7786 49.2318 10.8384 49.5142 11.4653C50.0618 12.6818 49.9343 13.0809 48.903 13.3752C47.7234 13.7116 45.7899 13.3431 44.6701 12.5682C44.246 12.2748 43.2708 11.6344 42.5027 11.1453L41.1062 10.2558C16.5678 10.262 29.6008 10.2465 0.5 10.2465L0.5 9.69254L0.5 9.13855L19.701 9.13855L27.3437 9.13855L28.3171 7.2683C29.8602 4.30337 32.4217 2.02516 35.5127 0.868438C36.9716 0.32243 37.2786 0.368524 37.0901 1.10577C36.754 2.42004 35.2352 4.95619 34.0158 6.239C33.0803 7.22316 32.2308 8.31409 30.7297 9.13235L38.4552 9.13545L41.0654 9.13855L42.2495 8.42967C42.9009 8.03989 43.7747 7.44424 44.1911 7.10609C45.8741 5.74019 49.6117 5.43372 49.7925 6.64695C49.8335 6.92195 49.7022 7.46153 49.5007 7.84622C49.2991 8.2309 49.1609 8.55975 49.1934 8.57681C50.6996 9.36812 50.8718 9.83348 49.8738 10.416ZM44.5854 9.23649C45.3819 8.73968 47.0207 8.58124 48.0425 8.90233C49.7423 9.43659 49.6215 10.0061 47.7052 10.494C46.8552 10.7105 46.4258 10.7072 45.5657 10.4781C44.1024 10.0879 43.8112 9.71935 44.5854 9.23649ZM47.5683 11.366C48.3059 11.2082 48.4835 11.2433 48.6751 11.5841C49.1595 12.4456 48.9681 12.6843 47.7978 12.6792C46.5361 12.6736 45.0472 12.0975 44.3647 11.351L43.8992 10.8417L44.4811 11.0024C46.1686 11.468 46.7642 11.538 47.5683 11.366ZM44.3647 8.03413C45.0472 7.28758 46.5361 6.71143 47.7978 6.70589C48.7002 6.7019 48.902 6.77237 48.8964 7.08881C48.8806 7.94815 48.4956 8.21739 47.566 8.01862C46.7644 7.84711 46.1672 7.91757 44.4811 8.38269L43.8992 8.54335L44.3647 8.03413ZM31.5223 4.1538C32.6361 3.11031 35.1473 1.60436 35.7734 1.60436C36.1581 1.60436 36.0957 1.79847 35.1922 3.41079C34.7378 4.2216 33.902 5.34641 33.3343 5.91015C32.3198 6.9184 30.353 8.25218 29.8812 8.25218C29.749 8.25218 30.5697 7.36358 31.7053 6.27755C33.2687 4.78201 33.7312 4.2072 33.6111 3.90871C33.4803 3.58452 33.0632 3.88367 31.2507 5.60213C30.0397 6.75021 29.0491 7.60955 29.0491 7.51161C29.0491 7.05069 30.4268 5.18044 31.5223 4.1538Z"
                fill="#383838"
              />
            </svg>
          </div>

          <div className="text-center">
            <button className="text-[#697586] hover:text-[#383838] transition-colors text-sm font-medium">
              See All
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {galleryItems.map((item) => (
            <div key={item.id} className="relative group overflow-hidden rounded-lg aspect-square">
              <img
                src={item.image || "/placeholder.svg"}
                alt={`Beauty gallery item ${item.id}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 text-[#383838] hover:bg-white flex items-center gap-2 text-xs px-4 py-2"
                >
                  <Instagram className="w-3 h-3" />
                  See In
                </Button>
                <Button
                  size="sm"
                  className="bg-[#fec6d4] hover:bg-[#fec6d4]/90 text-[#383838] flex items-center gap-2 text-xs px-4 py-2"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Buy Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Follow Us Button */}
        <div className="text-center">
          <Button className="bg-[#fec6d4] hover:bg-[#fec6d4]/90 text-[#FFFFFF] px-12 py-3 rounded-full text-base font-medium">
            Follow Us
          </Button>
        </div>
      </div>
    </div>
  );
}
