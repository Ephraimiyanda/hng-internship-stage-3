import React, { useState, useEffect } from "react";
import Gallery, { PhotoProps } from "react-photo-gallery";
import PhotoCard from "@/components/PhotoCard";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from "react-sortable-hoc";
import Loader from "@/components/loading";
import Photo from "@/components/PhotoCard";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Input,
} from "@nextui-org/react";
import { SearchIcon } from "@/components/searchIcon";
import { useAuth } from "../context/authContext"; 
import { useRouter } from "next/router"; 

// Define the Photo type based on PhotoProps
type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
};

// Define the type for your photo data
type PhotoData = {
  title: string;
  poster_path: string;
  id: number;
  release_date: string;
};
type SortableGalleryProps = {
  items: Photo[];

  onSortEnd: (params: { oldIndex: number; newIndex: number }) => void;
  axis: "xy";
};
// Define the type for the items state
type ItemsState = Photo[] | [];

/* popout the browser and maximize to see more rows! -> */
const SortablePhoto = SortableElement(
  ({ item, index }: { item: Photo; index: number }) => (
    <div key={index} className="w-fit grid-cols-1">
      <PhotoCard
        index={index}
        photo={{
          src: item.src,
          width: item.width,
          height: item.height,
          alt: item.alt,
        }}
      
        margin={""}
        direction={""}
      />
      <div className="flex justify-end">
        <Button
          style={{
            borderRadius: "0px",
            color: "white",
            borderColor: "white",
            borderWidth: "1px",
            background: "black",
            marginLeft: "auto",
            height: "30px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "140px",
            zIndex:"10"
          }}
          className="absolute -mt-[30px] whitespace-nowrap overflow-hidden overflow-ellipsis w-[130px] px-4 text-center"
        >
          {item.title}
        </Button>
      </div>
    </div>
  )
);

const SortableGallery = SortableContainer<SortableGalleryProps>(
  ({ items }: any) => (
    <Gallery
      photos={items}
      renderImage={(props) => (
        <SortablePhoto item={{...props.photo}} index={props.index} />
      )}
    />
  )
);

export default function Home() {
  const [photos, setPhotos] = useState<PhotoData[] | null>(null); // Initialize photos as null
  const [items, setItems] = useState<ItemsState>([]); // Initialize items as an empty array
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const { isAuthenticated, logout } = useAuth(); // Use the useAuth hook to access authentication state and logout function
  const router = useRouter(); // Use the useRouter hook to navigate

  const fetchPhoto = async () => {
    try {
      const apiKey = "c539753a1f88f569625d05489744019a";
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`
      );
      const photoRes = await res.json();
      const photoData = photoRes.results;
      setPhotos(photoData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPhoto();
  }, []);

  useEffect(() => {
    // Convert photoData to Photo objects when photos are fetched
    if (photos) {
      const convertedPhotos: Photo[] = photos.map((data: PhotoData) => ({
        src: `https://image.tmdb.org/t/p/original/${data.poster_path}`,
        width: 100, // Set your desired width
        height: 150, // Set your desired height
        alt: data.title,
        title: data.title,
      }));

      setItems(convertedPhotos);
    }
  }, [photos]);

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  // Function to handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Filter the items based on the search query
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="bg-white">
      <Navbar
        style={{
          padding: "1px",
          justifyContent: "space-between",
          maxWidth: "unset",
          display: "flex",
        }}
        maxWidth="full"
        className=" flex flex-col sm:flex-row"
      >
        <NavbarBrand>
          <p className="font-bold text-inherit text-2xl">Sortable Gallery</p>
        </NavbarBrand>
        <NavbarContent className=" gap-4 " justify="center">
          <NavbarItem>
            <Input
              startContent={
                <SearchIcon size={28} strokeWidth={1} width={20} height={20} />
              }
              value={searchQuery}
              onChange={(e)=>{setSearchQuery(e.target.value)}}
              color="default"
              placeholder="search for pictures based on their tags..."
              className="max-w-[470px] sm:w-[350px] md:w-[450px] justify-self-end sm:justify-self-center"
            />
          </NavbarItem>
        </NavbarContent>
        <NavbarContent className="hidden lg:flex" justify="end">
          <NavbarItem>
            <Button as={Link} color="danger"  variant="flat"  onClick={() => {
                  logout(); 
                }}>
              logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="px-6">
        {photos ? (
          <SortableGallery
            items={filteredItems}
            onSortEnd={onSortEnd}
            axis={"xy"}
          />
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}
