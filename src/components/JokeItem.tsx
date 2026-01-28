import React, { useState } from "react";
import { Joke } from "../types";
import { useTranslation } from "react-i18next";

interface Props {
  joke: Joke;
  favouriteJokes?: Array<Joke>;
  onAddToFavourites?: (joke: Joke) => void;
  onRemoveFromFavourites?: (joke: Joke) => void;
  onDeleteFromFavourites?: (joke: Joke) => void;
}

const JokeCard: React.FC<Props> = ({
  joke,
  favouriteJokes = [],
  onAddToFavourites,
  onRemoveFromFavourites,
  onDeleteFromFavourites,
}) => {
  const { t } = useTranslation();

  const isAdded = favouriteJokes.find(
    (addedJoke: Joke) => addedJoke.id === joke.id
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
      <div>
        <span className="joke__id">{t("id")}</span>
        {joke.id}
      </div>

      <div className="joke__url">
        <img src={joke.icon_url} alt={t("chuckNorisJoke") || ""} />
      </div>

      <div className="joke__value">{joke.value}</div>

      <div className="joke__link">
        <a href={joke.url}>{t("visitJoke")}</a>
      </div>

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

export default JokeCard;
