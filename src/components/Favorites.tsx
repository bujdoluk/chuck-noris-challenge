import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import JokeItem from "./JokeItem.tsx";
import { Joke } from "../types/index.ts";
import { CONSTANTS } from "../utils/constants.ts";

export default function Favorites() {
  const { t } = useTranslation();

  const [favoritesJokes, setFavoriteJokes] = useState<Array<Joke>>([]);

  const clearAll = (): void => {
    setFavoriteJokes([]);
    localStorage.removeItem("favoriteJokes");
  };

  const maxFavoritesJokes = (jokes: Array<Joke>): Array<Joke> => {
    if (jokes.length <= CONSTANTS.MAX_FAVORITES_JOKES) return jokes;
    return jokes.slice(jokes.length - CONSTANTS.MAX_FAVORITES_JOKES);
  };

  useEffect((): void => {
    const favorites = localStorage.getItem("favoriteJokes");
    if (!favorites) return;

    const parsedJokes: Array<Joke> = JSON.parse(favorites);
    const maxNumberOfJokes = maxFavoritesJokes(parsedJokes);

    setFavoriteJokes(maxNumberOfJokes);

    if (maxNumberOfJokes.length !== parsedJokes.length) {
      localStorage.setItem("favoriteJokes", JSON.stringify(maxNumberOfJokes));
    }
  }, []);

  const deleteFromFavorites = (favorite: Joke): void => {
    setFavoriteJokes((previousJokes: Array<Joke>) => {
      const updated = previousJokes.filter(
        (joke: Joke) => joke.id !== favorite.id
      );
      localStorage.setItem("favoriteJokes", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="favorites">
      <button className="button" onClick={clearAll}>
        {t("clearAll")}
      </button>

      <div>
        {favoritesJokes.length > 0 && (
          <div className="grid">
            {favoritesJokes.map((favoriteJoke: Joke) => (
              <JokeItem
                key={favoriteJoke.id}
                joke={favoriteJoke}
                onDelete={deleteFromFavorites}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
