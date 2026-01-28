import React from "react";
import { Joke } from "../types";
import { useTranslation } from "react-i18next";

interface Props {
  joke: Joke;
  favorites?: Array<Joke>;
  onAdd?: (joke: Joke) => void;
  onRemove?: (joke: Joke) => void;
  onDelete?: (joke: Joke) => void;
}

const JokeItem: React.FC<Props> = ({
  joke,
  favorites = [],
  onAdd,
  onRemove,
  onDelete,
}) => {
  const { t } = useTranslation();

  const isAdded = favorites.find((favorite: Joke) => favorite.id === joke.id);

  const toggleFavorite = (): void => {
    if (isAdded) {
      onRemove?.(joke);
    } else {
      onAdd?.(joke);
    }
  };

  const deleteJoke = (): void => {
    onDelete?.(joke);
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

      {onAdd && (
        <button className="joke__add" onClick={toggleFavorite}>
          {isAdded ? t("removeFromFavorites") : t("addToFavorites")}
        </button>
      )}

      {onDelete && (
        <button className="joke__add" onClick={deleteJoke}>
          {t("deleteFromFavorites")}
        </button>
      )}
    </div>
  );
};

export default JokeItem;
