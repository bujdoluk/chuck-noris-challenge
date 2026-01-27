import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import JokeCard from "./JokeCard.tsx";
import { Joke } from "../types";

export default function Favourites() {
  const { t } = useTranslation();

  const [favouritesJokes, setFavourites] = useState<Array<Joke>>([]);

  const clearAll = (): void => setFavourites([]);

  useEffect(() => {
    const savedFavourites = localStorage.getItem("favouriteJokes");
    if (savedFavourites) setFavourites(JSON.parse(savedFavourites));
  }, []);

  return (
    <div className="favourites">
      <button className="button" onClick={clearAll}>
        {t("clearAll")}
      </button>

      <div>
        {favouritesJokes.length > 0 && (
          <div className="grid">
            {favouritesJokes.map((favouriteJoke: Joke) => (
              <JokeCard key={favouriteJoke.id} joke={favouriteJoke} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
