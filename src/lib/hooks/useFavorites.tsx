"use client";

import {useCallback} from "react";
import {useLocalStorage} from "usehooks-ts";

type Favorite = {
  uuid: string
  title: string
}

const useFavorites = (): {
  favs: Favorite[],
  addFav: (_uuid: string, _title: string) => void,
  removeFav: (_uuid: string) => void
} => {
  const [favs, setFavs] = useLocalStorage<Favorite[]>('favorites', [], {initializeWithValue: false})

  const addFav = useCallback((uuid: string, title: string) => {
    setFavs([...favs, {uuid, title}])
  }, [favs, setFavs])

  const removeFav = useCallback((uuid: string) => {
    const itemIndex = favs.findIndex(fav => fav.uuid === uuid);
    const oldFavs = [...favs];
    oldFavs.splice(itemIndex, 1);
    setFavs(oldFavs);
  }, [favs, setFavs])

  return {favs, addFav, removeFav}
}

export default useFavorites;
