import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import JokeItem from "./JokeItem.tsx";
import { Joke } from "../types";

export default function Favourites() {
  const { t } = useTranslation();

  const [favouritesJokes, setFavourites] = useState<Array<Joke>>([]);

  const clearAll = (): void => {
    setFavourites([]);
    localStorage.removeItem("favouriteJokes");
  };

  useEffect(() => {
    const savedFavourites = localStorage.getItem("favouriteJokes");
    if (savedFavourites) setFavourites(JSON.parse(savedFavourites));
  }, []);

  return (
    <div className="favourites">
      <button className="button" onClick={clearAll}>
        {t("clearAll")}
      </button>

      {favouritesJokes.length > 0 ? (
        <ul className="grid">
          {favouritesJokes.map((favouriteJoke: Joke) => (
            <li key={favouriteJoke.id} className="favourites__item">
              <JokeItem joke={favouriteJoke} />
            </li>
          ))}
        </ul>
      ) : (
        <p>{t("emptyList")}</p>
      )}
    </div>
  );
}
