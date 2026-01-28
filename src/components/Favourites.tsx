import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import JokeItem from "./JokeItem.tsx";
import { Joke } from "../types";
import { CONSTANTS } from "../utils/constants.ts";

export default function Favourites() {
  const { t } = useTranslation();

  const [favouritesJokes, setFavouriteJokes] = useState<Array<Joke>>([]);

  const clearAll = (): void => {
    setFavouriteJokes([]);
    localStorage.removeItem("favouriteJokes");
  };

  const maxFavouritesJokes = (jokes: Array<Joke>): Array<Joke> => {
    if (jokes.length <= CONSTANTS.MAX_FAVOURITES_JOKES) return jokes;
    return jokes.slice(jokes.length - CONSTANTS.MAX_FAVOURITES_JOKES);
  };

  useEffect((): void => {
    const favouriteJokes = localStorage.getItem("favouriteJokes");
    if (!favouriteJokes) return;

    const parsedJokes: Array<Joke> = JSON.parse(favouriteJokes);
    const maxJokes = maxFavouritesJokes(parsedJokes);

    setFavouriteJokes(maxJokes);

    if (maxJokes.length !== parsedJokes.length) {
      localStorage.setItem("favouriteJokes", JSON.stringify(maxJokes));
    }
  }, []);

  const deleteFromFavourites = (favouriteJoke: Joke): void => {
    setFavouriteJokes((previousJokes: Array<Joke>) => {
      const updated = previousJokes.filter(
        (joke: Joke) => joke.id !== favouriteJoke.id
      );
      localStorage.setItem("favouriteJokes", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="favourites">
      <button className="button" onClick={clearAll}>
        {t("clearAll")}
      </button>

      <div>
        {favouritesJokes.length > 0 && (
          <div className="grid">
            {favouritesJokes.map((favouriteJoke: Joke) => (
              <JokeItem
                key={favouriteJoke.id}
                joke={favouriteJoke}
                onDeleteFromFavourites={deleteFromFavourites}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
