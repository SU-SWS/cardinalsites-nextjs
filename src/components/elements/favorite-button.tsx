"use client";

import useFavorites from "@lib/hooks/useFavorites";
import {HTMLAttributes} from "react";
import {HeartIcon} from "@heroicons/react/24/outline";
import {clsx} from "clsx";
import {useIsClient} from "usehooks-ts";

type Props = HTMLAttributes<HTMLButtonElement> & {
  uuid: string
  title: string
}

const FavoriteButton = ({uuid, title, ...props}: Props) => {
  const {favs, addFav, removeFav} = useFavorites()
  const onClick = () => {
    isFavorite ? removeFav(uuid) : addFav(uuid, title);
  }
  const isFavorite = !!favs.find(fav => fav.uuid === uuid)

  // No need to add the button on the server, but also it doesn't show initial state correctly for some reason.
  if (!useIsClient()) return;
  return (
    <button onClick={onClick} role="switch" aria-checked={isFavorite} {...props}>
      <HeartIcon width={30} className={clsx("text-cardinal-red", {"fill-cardinal-red": isFavorite})}/>
      <span className="sr-only">Add/Remove &quot;{title}&quot; from favorites</span>
    </button>
  )
}
export default FavoriteButton