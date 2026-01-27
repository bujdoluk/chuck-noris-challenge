import React from "react";
import { Joke } from "../types";
import { useTranslation } from "react-i18next";

interface Props {
  joke: Joke;
  onAddToFavourites?: (joke: Joke) => void;
}

const JokeCard: React.FC<Props> = ({ joke, onAddToFavourites }) => {
  const { t } = useTranslation();

  return (
    <div className="joke">
      <div>
        <span className="joke__id">{t("id")}: </span>
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
        <button onClick={(): void => onAddToFavourites(joke)}>
          {t("addToFavourites")}
        </button>
      )}
    </div>
  );
};

export default JokeCard;
