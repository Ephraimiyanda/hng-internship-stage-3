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
import LogoutImg from "../public/logout-svgrepo-com.svg";
import Image from "next/image";

// Define the Photo type based on PhotoProps
type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  genres: any;
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

const SortablePhoto = SortableElement((item: PhotoData, index: number) => (
  <div>
    <PhotoCard
      index={index}
      photo={{
        src: "",
        width: 0,
        height: 0,
        alt: "",
      }}
      margin={""}
      direction={""}
      {...item}
    />
  </div>
));

const SortableGallery = SortableContainer<SortableGalleryProps | any>(
  ({ items }: any) => (
    <Gallery
      photos={items}
      renderImage={(props) => <SortablePhoto {...props} />}
    />
  )
);

export default function Home() {
  const [photos, setPhotos] = useState<PhotoData[] | null>(null);
  const [items, setItems] = useState<ItemsState>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const fetchMovieGenres = async (id: number) => {
    try {
      const apiKey = "c539753a1f88f569625d05489744019a";
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
      );
      const videoData = await res.json();

      const genre = videoData.genres.map((genre: any) => genre.name);
      return genre;
    } catch (error) {
      console.error("Error fetching movie genres:", error);
      return [];
    }
  };

  const fetchPhoto = async () => {
    try {
      const apiKey = "c539753a1f88f569625d05489744019a";
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`
      );
      const photoRes = await res.json();
      const photoData = photoRes.results;

      // Fetch genres for each movie and update the items
      const updatedItems = await Promise.all(
        photoData.map(async (data: PhotoData) => {
          const genres = await fetchMovieGenres(data.id);
          return {
            src: `https://image.tmdb.org/t/p/original/${data.poster_path}`,
            width: 100,
            height: 150,
            alt: data.title,
            title: data.title,
            genres: genres,
          };
        })
      );

      setPhotos(photoData);
      setItems(updatedItems);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPhoto();
  }, []);

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    setItems(arrayMove(filteredItems, oldIndex, newIndex));
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const filteredItems = items.filter((item) =>
    item.genres.some((genre: any) =>
      genre.toLowerCase().includes(searchQuery.toLowerCase())
    )
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
        className=" flex flex-col sm:flex-row bg-stone-300"
      >
        <NavbarBrand>
          <p className="font-bold text-inherit text-2xl"> Gallery</p>
        </NavbarBrand>
        <NavbarContent className=" gap-4 " justify="center">
          <NavbarItem>
            <Input
              startContent={
                <SearchIcon size={28} strokeWidth={1} width={20} height={20} />
              }
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              color="default"
              placeholder="search for pictures based on their tags..."
              className="max-w-[470px] sm:w-[320px] md:w-[400px] justify-self-end sm:justify-self-center text-black "
              style={{
                background: "rgb(214 211 209)",
              }}
            />
          </NavbarItem>
        </NavbarContent>
        <NavbarContent className="lg:flex" justify="end">
          <NavbarItem>
            <Button
              className="hidden sm:flex"
              as={Link}
              color="danger"
              variant="flat"
              onClick={() => {
                logout();
              }}
            >
              logout
            </Button>
            <Button
              className="flex sm:hidden "
              size="sm"
              style={{
                width: "30px",
              }}
              as={Link}
              color="danger"
              variant="flat"
              onClick={() => {
                logout();
              }}
            >
              <Image
                src={LogoutImg}
                width={15}
                height={15}
                alt="logout"
              />
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="px-6 ">
        <p className="py-4">
          To search for images you search based on the genre of the movie since
          the images are posters for the movies like{" "}
          <span className="font-semibold">Action</span>,{" "}
          <span className="font-semibold">Drama</span>,{" "}
          <span className="font-semibold">Animation</span>,{" "}
          <span className="font-semibold">Thriller</span> e.t.c.
        </p>
        {photos ? (
          filteredItems.length > 0 ? (
            <SortableGallery items={filteredItems} onSortEnd={onSortEnd} axis={"xy"} />
          ) : (
            <div className="h-[75vh] flex flex-col justify-center items-center"> <p>No results found for the query <span className="font-bold">{`"${searchQuery}"`}</span> </p></div>
           
          )
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}
