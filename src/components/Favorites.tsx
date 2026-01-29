import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import JokeItem from "./JokeItem.tsx";
import { Joke } from "../types/index.ts";
import { CONSTANTS } from "../utils/constants.ts";

export default function Favorites() {
  const { t } = useTranslation();

  const [favorites, setFavorites] = useState<Array<Joke>>([]);

  const clearAll = (): void => {
    setFavorites([]);
    localStorage.removeItem("favoriteJokes");
  };

  const maxFavorites = (jokes: Array<Joke>): Array<Joke> => {
    if (jokes.length <= CONSTANTS.MAX_FAVORITES_JOKES) return jokes;
    return jokes.slice(jokes.length - CONSTANTS.MAX_FAVORITES_JOKES);
  };

  useEffect((): void => {
    const favorites = localStorage.getItem("favoriteJokes");
    if (!favorites) return;

    const parsedJokes: Array<Joke> = JSON.parse(favorites);
    const maxNumberOfJokes = maxFavorites(parsedJokes);

    setFavorites(maxNumberOfJokes);

    if (maxNumberOfJokes.length !== parsedJokes.length) {
      localStorage.setItem("favoriteJokes", JSON.stringify(maxNumberOfJokes));
    }
  }, []);

  const deleteFromFavorites = (favorite: Joke): void => {
    setFavorites((jokes: Array<Joke>) => {
      const filteredJokes = jokes.filter(
        (joke: Joke) => joke.id !== favorite.id
      );
      localStorage.setItem("favoriteJokes", JSON.stringify(filteredJokes));
      return filteredJokes;
    });
  };

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
        {favorites.map((joke: Joke) => (
          <JokeItem key={joke.id} joke={joke} onDelete={deleteFromFavorites} />
        ))}
      </div>
    </div>
  );
}
