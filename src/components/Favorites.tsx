import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import JokeItem from "./JokeItem.tsx";
import { Joke } from "../types/index.ts";
import { CONSTANTS } from "../utils/constants.ts";

export default function Favorites() {
  const { t } = useTranslation();

  const [favorites, setFavorites] = useState<Array<Joke>>(() => {
    const favorites = localStorage.getItem("favoriteJokes");
    if (!favorites) return [];
    const parsedFavorites: Array<Joke> = JSON.parse(favorites);
    return parsedFavorites.slice(-CONSTANTS.MAX_FAVORITES_JOKES);
  });

  const clearAll = (): void => setFavorites([]);

  useEffect((): void => {
    localStorage.setItem("favoriteJokes", JSON.stringify(favorites));
  }, [favorites]);

  const deleteFromFavorites = (joke: Joke): void =>
    setFavorites((favorites) =>
      favorites.filter((favorite: Joke) => favorite.id !== joke.id)
    );

  if (favorites.length === 0) {
    return (
      <div className="favorites">
        <button className="button" onClick={clearAll}>
          {t("clearAll")}
        </button>
        <p>{t("noData")}</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <button className="button" onClick={clearAll}>
        {t("clearAll")}
      </button>

      <div className="grid">
        {favorites.map((favorite: Joke) => (
          <JokeItem
            key={favorite.id}
            joke={favorite}
            onDelete={deleteFromFavorites}
          />
        ))}
      </div>
    </div>
  );
}
