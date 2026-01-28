import React from "react";
import { Joke } from "../types";
import { useTranslation } from "react-i18next";

interface Props {
  joke: Joke;
  favouriteJokes?: Array<Joke>;
  onAddToFavourites?: (joke: Joke) => void;
  onRemoveFromFavourites?: (joke: Joke) => void;
  onDeleteFromFavourites?: (joke: Joke) => void;
}

const JokeItem: React.FC<Props> = ({
  joke,
  favouriteJokes = [],
  onAddToFavourites,
  onRemoveFromFavourites,
  onDeleteFromFavourites,
}) => {
  const { t } = useTranslation();

  const isAdded = favouriteJokes.find(
    (favouriteJoke: Joke) => favouriteJoke.id === joke.id
  );

  const onToggleFavorite = (): void => {
    if (isAdded) {
      onRemoveFromFavourites?.(joke);
    } else {
      onAddToFavourites?.(joke);
    }
  };

  const onDeleteClick = (): void => {
    onDeleteFromFavourites?.(joke);
  };

  return (
    <div className="joke">
      <div className="joke__icon">
        <img src={joke.icon_url} alt={t("chuckNorisJoke") || ""} />
      </div>

      <div>
        <a href={joke.url} target="_blank" className="joke__link">
          {t("visitWebsite")}
        </a>
      </div>

      <div className="joke__value">{joke.value}</div>

      {onAddToFavourites && (
        <button className="joke__add" onClick={(): void => onToggleFavorite()}>
          {isAdded ? t("removeFromFavourites") : t("addToFavourites")}
        </button>
      )}

      {onDeleteFromFavourites && (
        <button className="joke__add" onClick={(): void => onDeleteClick()}>
          {t("deleteFromFavourites")}
        </button>
      )}
    </div>
  );
};

export default JokeItem;
