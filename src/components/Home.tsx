import React, { useState, useRef, useEffect } from "react";
import config from "../config/config.json";
import { Joke } from "../types";
import { CONSTANTS } from "../utils/constants.ts";
import { useTranslation } from "react-i18next";
import JokeCard from "./JokeCard.tsx";

export default function Home() {
  const { t } = useTranslation();

  const [joke, setJoke] = useState<Joke>();
  const [jokes, setJokes] = useState<Array<Joke>>([]);
  const [loadingJoke, setLoading] = useState<boolean>(false);
  const [loadingNewJoke, setNewLoading] = useState<boolean>(false);
  const [favouriteJokes, setFavouriteJokes] = useState<Array<Joke>>([]);

  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchJoke = async (): Promise<Joke | void> => {
    try {
      const response: Response = await fetch(config.url);
      const joke: Joke = await response.json();
      return joke;
    } catch (error: unknown) {
      console.error("Could not fetch a joke", error);
    }
  };

  const onFetchJoke = (): void => {
    if (intervalRef.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(async (): Promise<void> => {
      setLoading(true);
      const joke = await fetchJoke();
      if (joke) {
        setJoke(joke);
      }
      setLoading(false);
    }, CONSTANTS.DEBOUNCE);
  };

  const onFetchNewJoke = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setNewLoading(false);
      return;
    }

    setNewLoading(true);

    intervalRef.current = window.setInterval(async (): Promise<void> => {
      const newJoke = await fetchJoke();
      if (newJoke) {
        setJokes((previousJoke: Array<Joke>) => [newJoke, ...previousJoke]);
      }
    }, CONSTANTS.REFRESH_INTERVAL);
  };

  const onAddToFavourites = (): void => {};

  useEffect(() => {
    const onKeyboardEvent = (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() === "r") {
        onFetchJoke();
      }
    };

    window.addEventListener("keydown", onKeyboardEvent);

    return () => {
      window.removeEventListener("keydown", onKeyboardEvent);
    };
  }, []);

  return (
    <div className="home">
      <button onClick={onFetchJoke} disabled={loadingJoke}>
        {loadingJoke ? "Loading..." : "Get One Joke"}
      </button>

      {joke && (
        <div className="grid">
          <JokeCard joke={joke} />
        </div>
      )}

      <button
        onClick={onFetchNewJoke}
        disabled={loadingNewJoke && !intervalRef.current}
      >
        {intervalRef.current ? t("stop") : t("getJokeEveryTreeSeconds")}
      </button>

      {jokes.length > 0 && (
        <div className="grid">
          {jokes.map((joke: Joke) => (
            <JokeCard key={joke.id} joke={joke} />
          ))}
        </div>
      )}

      <button onClick={onAddToFavourites}>{t("addToFavourites")}</button>
    </div>
  );
}
